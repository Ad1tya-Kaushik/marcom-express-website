import { useEffect, useMemo, useState } from "react";

const API = "/api";
const fallbackEmail = "marketing@marcomexpress.in";

function Logo() {
  return <a className="logo" href="#home" aria-label="Marcom Express home">
    <span>MARCO<span className="logo-m">M↗</span></span>
    <small> E X P R E S S </small>
    <em>STRATEGY <b>|</b> MARKETING <b>|</b> COMMUNICATIONS</em>
  </a>;
}

function SectionTitle({ eyebrow, children, light = false }) {
  return <div className={`section-title ${light ? "light" : ""}`}>
    {eyebrow && <p className="eyebrow">{eyebrow}</p>}
    <h2>{children}</h2>
  </div>;
}

function App() {
  const [content, setContent] = useState(null);
  const [cases, setCases] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [formState, setFormState] = useState({ busy: false, message: "", error: false });

  useEffect(() => {
    Promise.all([
      fetch(`${API}/content`).then(r => { if (!r.ok) throw new Error("Could not load website content"); return r.json(); }),
      fetch(`${API}/case-studies`).then(r => { if (!r.ok) throw new Error("Could not load portfolio"); return r.json(); })
    ]).then(([siteContent, portfolio]) => {
      setContent(siteContent);
      setCases(portfolio);
    }).catch(() => setLoadError("The website could not connect to its backend. Check that the server is running on port 5000."));
  }, []);

  const categories = useMemo(() => ["All", ...new Set(cases.map(item => item.category))], [cases]);
  const filteredCases = useMemo(() => cases.filter(item => {
    const matchesCategory = category === "All" || item.category === category;
    const term = query.trim().toLowerCase();
    const matchesQuery = !term || `${item.client} ${item.title} ${item.challenge} ${item.category}`.toLowerCase().includes(term);
    return matchesCategory && matchesQuery;
  }), [cases, category, query]);

  async function submitEnquiry(event) {
    event.preventDefault();
    setFormState({ busy: true, message: "", error: false });
    try {
      const response = await fetch(`${API}/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to submit your enquiry.");
      setForm({ name: "", email: "", company: "", message: "" });
      setFormState({ busy: false, message: "Thank you. Your enquiry has been received.", error: false });
    } catch (error) {
      setFormState({ busy: false, message: error.message || "Something went wrong.", error: true });
    }
  }

  const data = content;
  const email = data?.brand?.email || fallbackEmail;

  return <>
    <header className="site-header">
      <div className="nav-wrap">
        <Logo />
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">☰</button>
        <nav className={menuOpen ? "nav-links open" : "nav-links"} onClick={() => setMenuOpen(false)}>
          <a href="#about">About</a><a href="#approach">Approach</a><a href="#solutions">Solutions</a>
          <a href="#portfolio">Portfolio</a><a href="#contact" className="nav-cta">Let's Talk <span>↗</span></a>
        </nav>
      </div>
    </header>

    <main>
      {loadError && <div className="error-banner">{loadError}</div>}
      <section className="hero" id="home">
        <div className="hero-grid"></div>
        <div className="container hero-content">
          <p className="eyebrow">STRATEGY <span>•</span> MARKETING <span>•</span> COMMUNICATIONS</p>
          <h1>Communication<br/>that moves <span>business</span><i>.</i></h1>
          <p className="hero-copy">We decode business challenges and turn complex ideas into strategic communication that creates measurable impact.</p>
          <div className="hero-actions"><a className="btn btn-orange" href="#portfolio">Explore our work <span>↗</span></a><a className="text-link" href="#about">Discover Marcom Express <span>↓</span></a></div>
          <div className="hero-note"><span className="note-line"></span> YOUR STRATEGIC COMMUNICATIONS PARTNER</div>
        </div>
        <div className="hero-stamp">M<br/><span>EXPRESS</span></div>
      </section>

      <section className="intro-section section-pad" id="about">
        <div className="container intro-grid">
          <div><p className="eyebrow">01 / WHO WE ARE</p><h2 className="display-heading">Not just another<br/><span>marketing agency.</span></h2></div>
          <div className="intro-copy"><p className="lead">{data?.positioning || "We are a Strategic Business Communication Consultancy, not a conventional marketing agency."}</p><p>{data?.philosophy}</p><a className="underlined-link" href="#approach">Explore our approach <span>↗</span></a></div>
        </div>
      </section>

      <section className="core-section section-pad">
        <div className="container">
          <SectionTitle eyebrow="02 / OUR STRATEGIC CORE">Purpose before promotion.</SectionTitle>
          <div className="core-grid">
            {[["VISION",data?.vision],["MISSION",data?.mission],["BRAND PROMISE",data?.promise]].map(([label, text]) =>
              <article className="core-card" key={label}><span className="card-index">{label}</span><p>{text || " "}</p></article>
            )}
          </div>
          <div className="values-grid">{(data?.values || []).map((item,i)=><article className="value-item" key={item.title}><span>0{i+1}</span><div><h3>{item.title}</h3><p>{item.description}</p></div></article>)}</div>
        </div>
      </section>

      <section className="approach-section section-pad" id="approach">
        <div className="container">
          <SectionTitle eyebrow="03 / HOW WE WORK" light>From business challenge<br/>to business impact.</SectionTitle>
          <p className="approach-sub">A structured six-stage framework that connects insight, strategy, creativity and measurable growth.</p>
          <div className="steps-grid">{(data?.methodology || []).map((step,i)=><article className="step-card" key={step.name}><span className="step-number">0{i+1}</span><h3>{step.name}<b>↗</b></h3><p>{step.description}</p></article>)}</div>
        </div>
      </section>

      <section className="solutions-section section-pad" id="solutions">
        <div className="container">
          <SectionTitle eyebrow="04 / WHAT WE DO">Strategy meets execution.</SectionTitle>
          <div className="solution-columns">
            <div><h3 className="orange-heading">Solutions</h3><p className="column-intro">Strategic direction built around business objectives.</p>{(data?.solutions || []).map((item,i)=><div className="list-row" key={item}><span>0{i+1}</span>{item}<b>↗</b></div>)}</div>
            <div><h3 className="orange-heading">Services</h3><p className="column-intro">Creative communication that brings strategy to life.</p>{(data?.services || []).map((item,i)=><div className="list-row" key={item}><span>0{i+1}</span>{item}<b>↗</b></div>)}</div>
          </div>
          <div className="architecture-grid">{(data?.architecture || []).map(item=><article key={item.name}><span>{item.name}</span><h3>{item.heading}</h3><p>{item.description}</p></article>)}</div>
        </div>
      </section>

      <section className="proof-section section-pad">
        <div className="container">
          <SectionTitle eyebrow="05 / WHY MARCOM EXPRESS">Different by design.</SectionTitle>
          <div className="proof-grid">{(data?.differentiators || []).map(item=><article key={item.metric}><strong>{item.metric}</strong><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
          <div className="numbers-band">
            <div><strong>{data?.leadership?.experience || "50+ Years"}</strong><span>Combined leadership experience</span></div>
            <div><strong>{data?.leadership?.expertise || "360°"}</strong><span>Integrated marketing expertise</span></div>
            <div><strong>{data?.leadership?.execution || "500+"}</strong><span>Delivered strategic business impact</span></div>
          </div>
          <div className="expertise-row"><div><h3>Industry experience</h3><p>{(data?.leadership?.industries || []).join(" · ")}</p></div><div><h3>Areas of expertise</h3><p>{(data?.leadership?.capabilities || []).join(" · ")}</p></div></div>
        </div>
      </section>

      <section className="portfolio-section section-pad" id="portfolio">
        <div className="container">
          <div className="portfolio-heading"><SectionTitle eyebrow="06 / SELECTED BUSINESS IMPACT">Proof in the work.</SectionTitle><p>Explore selected engagements and the business challenges behind them.</p></div>
          <div className="portfolio-tools">
            <div className="filter-tabs">{categories.map(item=><button key={item} className={category===item?"active":""} onClick={()=>setCategory(item)}>{item}</button>)}</div>
            <input aria-label="Search case studies" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search case studies..." />
          </div>
          <div className="case-grid">{filteredCases.map((item,i)=><button className="case-card" key={item.id} onClick={()=>setSelected(item)}>
            <div className="case-top"><span>{item.client}</span><span>0{i+1 < 10 ? i+1 : i+1}</span></div>
            <div className="case-card-body"><span className="case-category">{item.category}</span><h3>{item.title}</h3><p>{item.challenge}</p><span className="case-open">View case study <b>↗</b></span></div>
          </button>)}</div>
          {filteredCases.length===0 && <p className="empty-state">No case studies match your search. Try another keyword or category.</p>}
          <p className="portfolio-footnote">Case study descriptions and impact figures are based on the supplied Marcom Express corporate presentation.</p>
        </div>
      </section>

      <section className="contact-section section-pad" id="contact">
        <div className="container contact-grid">
          <div><p className="eyebrow">07 / START A CONVERSATION</p><h2 className="display-heading">Let's solve<br/><span>something meaningful.</span></h2><p className="contact-copy">Have a business challenge to decode? Tell us what you're working on.</p><a className="contact-email" href={`mailto:${email}`}>{email} ↗</a></div>
          <form className="contact-form" onSubmit={submitEnquiry}>
            <label>Your name<input required minLength="2" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Enter your name"/></label>
            <label>Work email<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@company.com"/></label>
            <label>Company (optional)<input value={form.company} onChange={e=>setForm({...form,company:e.target.value})} placeholder="Your organisation"/></label>
            <label>How can we help?<textarea required minLength="10" rows="4" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Tell us a little about your business challenge..."/></label>
            <button className="btn btn-orange submit-btn" disabled={formState.busy}>{formState.busy?"Sending...":"Send enquiry"} <span>↗</span></button>
            {formState.message && <p className={formState.error?"form-message error":"form-message success"} role="status">{formState.message}</p>}
          </form>
        </div>
      </section>
    </main>

    <footer className="footer"><div className="container footer-top"><Logo/><p>Clarity of thought.<br/>Purpose in communication.<br/>Impact on business.</p><a href="#home">Back to top ↑</a></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Marcom Express. Corporate information sourced from the 2026–27 presentation.</span><a href={`mailto:${email}`}>{email}</a></div></footer>

    {selected && <div className="modal-backdrop" role="presentation" onClick={()=>setSelected(null)}><section className="case-modal" role="dialog" aria-modal="true" aria-label={selected.title} onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setSelected(null)} aria-label="Close">×</button><p className="eyebrow">{selected.client} / {selected.category}</p><h2>{selected.title}</h2><div className="modal-block"><h3>Business challenge</h3><p>{selected.challenge}</p></div><div className="modal-block"><h3>Strategy</h3><p>{selected.strategy}</p></div><div className="modal-block"><h3>Business impact</h3><ul>{selected.impact.map((point,i)=><li key={i}>{point}</li>)}</ul></div><a className="btn btn-orange" href="#contact" onClick={()=>setSelected(null)}>Discuss a project <span>↗</span></a></section></div>}
  </>;
}

export default App;
