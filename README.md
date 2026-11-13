<a id="readme-top"></a>

<br />
<div align="center">
  <a href="https://hustavojhon.vercel.app">
    <img src="./public/favicon.svg" alt="Logo" width="100" height="100">
  </a>

  <h3 align="center">Portfolio</h3>

  <p align="center">
    My personal website and printable CV, in Spanish: projects, skills, experience, certificates and GitHub activity.<br>
    <a href="https://hustavojhon.vercel.app">hustavojhon.vercel.app</a>
  </p>

![Astro](https://img.shields.io/badge/Astro-BC52EE.svg?style=for-the-badge&logo=Astro&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4.svg?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Json](https://img.shields.io/badge/JSON-000000.svg?style=for-the-badge&logo=JSON&logoColor=white)

---

</div>

Static site built with Astro 7 and Tailwind CSS 4. All content comes from `cv.json`; the page also prints as a CV.

## Getting started

Requirements: Node.js 24+ and pnpm (the version is pinned in `package.json` → `packageManager`).

```bash
pnpm install
pnpm dev        # http://localhost:4321
```

### Content

Edit `cv.json`. Certificates listed there link to PDFs in `public/certificates/`; keep each entry's title, issuer and date identical to what is printed on the certificate.

### Colour themes

Set `basics.theme` in `cv.json` to one of the themes in `public/themes/themes.css` (red, blue, green, cyber, gruvbox or default), each with a dark variant, or add your own. Tailwind exposes them as `skin-*` utilities, mapped in `src/styles/global.css`.

## Commands

|     | Command                 | Action                                                          |
| :-- | :---------------------- | :-------------------------------------------------------------- |
| ⚙️  | `dev` or `start`        | Launches a local development server at `localhost:4321`.        |
| ⚙️  | `build`                 | Type-checks (`astro check`) and creates a production build in `./dist/`. |
| ⚙️  | `preview`               | Serves the production build locally.                            |
| 🧪  | `test`                  | Runs the unit tests (Node's built-in test runner).              |
| 🔄  | `contributions:update`  | Refreshes the committed GitHub contributions snapshot.          |

## Deployment

The site is deployed by Vercel's Git integration (no `vercel.json`; Vercel detects Astro and uses pnpm from `packageManager`):

- **Every push to `main` deploys to production automatically** (hustavojhon.vercel.app).
- Pushes to any other branch, such as `dev`, create preview deployments only.

Work on `dev` and merge into `main` only when the change is ready to go live.

## GitHub contributions data

The contribution graph never depends on GitHub being available at build time.

- `src/data/contributions.json` is a committed, validated snapshot (one entry per year, with the date it was fetched).
- During `astro build`/`astro dev` only the **current year** is refreshed from GitHub (8 s timeout). If the request fails, times out or the HTML does not validate (complete year, daily counts summing to the total), the snapshot is used and a `[contributions]` warning is logged. The page always shows the real date of the data it renders.
- Set `CONTRIBUTIONS_OFFLINE=1` to skip the network entirely.

Refresh the snapshot (e.g. at the start of a new year) and commit the result:

```bash
pnpm contributions:update             # every year with activity
pnpm contributions:update 2025 2026   # specific years only
```

Only years that pass validation are written; failed years keep their previous data. Parser and loader tests: `pnpm test`.
