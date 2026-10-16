# M365 Copilot Reporting Agent POC – MOCK DEMO

**This is a mock / sample demo.** All data, documents, numbers and narratives are fictional (SAMPLE). It has **no** connection to Microsoft 365 Copilot, Copilot Studio, AWS, Aurora, Athena or Tableau, makes no network calls, and contains no real company data, customer names, hostnames or credentials.

Purpose: support a discussion of the POC "Microsoft 365 Copilot Reporting Agent with AWS DM Source" (aggregated Aurora PostgreSQL DM data + O365 content, reports written by the Copilot LLM, no external LLM API).

## Tabs
1. **Architecture** – interactive diagram (green = recommended POC path, dashed = later/optional); click boxes for details and caveats.
2. **Ask the agent** – preset prompts, simulated step-by-step run, mock report with table and inline-SVG chart, download as HTML / CSV. Banner: *Simulated output – not a live Copilot connection.*
3. **Open questions** – checklist for IT and the DM team, plus unverified items (ticks stored in browser localStorage only).

## Run locally
No build step, no dependencies. Open `index.html` in a browser (double-click, or `file:///.../copilot-poc-demo/index.html`).

Files: `index.html`, `css/style.css`, `js/data.js` (all sample data), `js/app.js`.

## GitHub Pages deployment (documentation only – NOT done)
This project has not been pushed or deployed anywhere and has no git remote. If you later decide to publish (check data-sharing policy first; the demo is public on free GitHub Pages unless using a private-Pages plan):
1. Create a repository and add it as a remote: `git remote add origin <url>`.
2. `git push -u origin main`.
3. Repo **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*, Branch = `main`, folder `/ (root)`.
4. Wait for the Pages build, then open the URL shown (`https://<user>.github.io/<repo>/`).
Exclude `screenshots/` if not wanted.
