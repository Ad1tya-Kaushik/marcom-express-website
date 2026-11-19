# Marcom Express Dynamic Website

A responsive, full-stack portfolio website built from the supplied **Marcom Express Portfolio / Corporate Presentation 2026–27**.

## Features

- React-based responsive website
- Express backend API
- Website content and case studies loaded from JSON data files
- Search and category filtering for portfolio case studies
- Case-study detail modal
- Contact/enquiry form with server-side validation
- Enquiries saved to `server/data/inquiries.json`
- Vite development server with API proxy
- Production build served by Express

## Technology stack

- **React**: builds the interactive user interface.
- **Vite**: runs the frontend development server and builds frontend assets.
- **Node.js**: JavaScript runtime for the backend.
- **Express**: creates API endpoints and handles form submissions.
- **JSON files**: store the site's content, portfolio entries and submitted enquiries.

This starter uses JSON-file storage rather than a database. It is suitable for a local demonstration or prototype. For a public production deployment, use a database, secure form handling, spam protection, HTTPS, backups and access controls. Do not expose the saved enquiries file through a public static route.

## Requirements

Install Node.js LTS (which includes npm). Verify in PowerShell:

```powershell
node -v
npm -v
```

If either command is not recognised, install Node.js LTS and reopen PowerShell or VS Code.

## Run locally (Windows PowerShell)

1. Extract the ZIP file.
2. Open the extracted `marcom-express-website` folder in VS Code.
3. Open the VS Code terminal in that folder.
4. Install dependencies:

```powershell
npm install
```

5. Start the frontend and backend together:

```powershell
npm run dev
```

6. Open the Vite URL shown in the terminal, normally:

```text
http://localhost:5173
```

The backend API runs at:

```text
http://localhost:5000
```

Check the backend with:

```text
http://localhost:5000/api/health
```

Keep the terminal running while using the site. Press `Ctrl + C` to stop both development processes.

## Project structure

```text
marcom-express-website/
├── client/
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       └── styles.css
├── server/
│   ├── server.js
│   └── data/
│       ├── content.json
│       ├── case-studies.json
│       └── inquiries.json
├── package.json
└── README.md
```

## How the dynamic parts work

1. React requests `/api/content` and `/api/case-studies` from Express.
2. Express reads the JSON files and returns the content.
3. React renders the content into the page.
4. Portfolio search and category controls filter the case studies.
5. When a visitor submits the enquiry form, React sends a POST request to `/api/inquiries`.
6. Express validates the data and appends the enquiry to `server/data/inquiries.json`.

To add or edit a portfolio item, edit `server/data/case-studies.json` while the server is stopped or restart the server after changing it. The frontend layout does not need to be rewritten.

## Production build

Build the React frontend:

```powershell
npm run build
```

Then start the Express server:

```powershell
npm start
```

Open `http://localhost:5000`. The server serves the built frontend from `client/dist`.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check backend status |
| GET | `/api/content` | Get company content |
| GET | `/api/case-studies` | Get all case studies |
| GET | `/api/case-studies?q=delta` | Search case studies |
| GET | `/api/case-studies?category=Product%20launch` | Filter by category |
| POST | `/api/inquiries` | Validate and save an enquiry |

Example POST body:

```json
{
  "name": "Aarav Sharma",
  "email": "aarav@example.com",
  "company": "Example Ltd",
  "message": "I would like to discuss a communication project."
}
```

## Important notes about the source presentation

- The website content is based on the provided 27-page corporate presentation.
- The presentation provides the contact email `marketing@marcomexpress.in`; it does not provide a phone number or postal address.
- Case-study claims and figures are reproduced as presented. Confirm all client names, permissions, figures and project descriptions with Marcom Express before publishing publicly.
- The supplied PDF does not provide downloadable brand logo artwork or original media assets. The website currently uses a text-based logo treatment. Replace it with approved logo artwork and approved case-study images/videos before launch.
- The phrase "30K+ community members" is used for the SOLIDWORKS case study; the source slide appears to contain a typographical error ("Resisted 30K+ members"), so confirm the intended wording before public release.
- The PDF says "500+ Execution" but does not define the unit. The website labels this as strategic execution projects; verify the exact intended meaning before publication.
- The presentation states "50+ Years" of combined leadership experience. The website describes this as combined leadership experience.

## Before public launch

- Move enquiries to a database (for example PostgreSQL or MongoDB).
- Add spam protection, rate limiting and secure server-side validation.
- Add a private/admin workflow for reading and managing enquiries.
- Configure HTTPS and environment variables.
- Add privacy/consent wording to the enquiry form.
- Obtain approval for client logos, photographs, videos and case-study claims.
