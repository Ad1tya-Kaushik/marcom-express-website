import express from "express";
import cors from "cors";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5000;
const dataDir = path.join(__dirname, "data");

app.use(cors());
app.use(express.json({ limit: "100kb" }));

async function readJson(filename) {
  const raw = await fs.readFile(path.join(dataDir, filename), "utf8");
  return JSON.parse(raw);
}

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "Marcom Express API" }));

app.get("/api/content", async (_req, res) => {
  try { res.json(await readJson("content.json")); }
  catch (error) { console.error(error); res.status(500).json({ message: "Unable to load website content." }); }
});

app.get("/api/case-studies", async (req, res) => {
  try {
    const studies = await readJson("case-studies.json");
    const q = String(req.query.q || "").toLowerCase();
    const category = String(req.query.category || "");
    const filtered = studies.filter(item => {
      const text = `${item.client} ${item.title} ${item.challenge} ${item.category}`.toLowerCase();
      return (!q || text.includes(q)) && (!category || category === "All" || item.category === category);
    });
    res.json(filtered);
  } catch (error) { console.error(error); res.status(500).json({ message: "Unable to load case studies." }); }
});

app.post("/api/inquiries", async (req, res) => {
  const { name, email, company = "", message } = req.body || {};
  if (typeof name !== "string" || name.trim().length < 2 ||
      typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof message !== "string" || message.trim().length < 10) {
    return res.status(400).json({ message: "Please provide a valid name, email address and message (at least 10 characters)." });
  }
  try {
    const file = path.join(dataDir, "inquiries.json");
    let inquiries = [];
    try { inquiries = JSON.parse(await fs.readFile(file, "utf8")); } catch { inquiries = []; }
    const inquiry = {
      id: `inq_${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      company: typeof company === "string" ? company.trim() : "",
      message: message.trim(),
      receivedAt: new Date().toISOString()
    };
    inquiries.push(inquiry);
    await fs.writeFile(file, JSON.stringify(inquiries, null, 2) + "\n", "utf8");
    res.status(201).json({ message: "Enquiry received successfully.", id: inquiry.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "The enquiry could not be saved. Please try again later." });
  }
});

// In production, serve the built React application from client/dist.
const distPath = path.resolve(__dirname, "../client/dist");
app.use(express.static(distPath));
app.get("*", async (_req, res, next) => {
  try { await fs.access(path.join(distPath, "index.html")); res.sendFile(path.join(distPath, "index.html")); }
  catch { next(); }
});

app.listen(PORT, () => console.log(`Marcom Express API running at http://localhost:${PORT}`));
