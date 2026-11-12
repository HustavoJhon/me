<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README">
    <img src="./public/favicon.svg" alt="Logo" width="100" height="100">
  </a>

  <h3 align="center">Portfolio</h3>

  <p align="center">
    Welcome to My Portfolio <br>
    This repository showcases my personal website, where I present my projects, skills, and experience. Built with modern web technologies, it serves as my digital portfolio.

  </p>

![Astro](https://img.shields.io/badge/Astro-BC52EE.svg?style=for-the-badge&logo=Astro&logoColor=white)
![Json](https://img.shields.io/badge/JSON-000000.svg?style=for-the-badge&logo=JSON&logoColor=white)

---

</div>



### 2. Add Your Content:

Edit the `cv.json` file to create your own printable Portfolio/CV.

### 3. Launch the Development Server:

```bash
# Enjoy the results
pnpm dev
```
1. Open [**http://localhost:4321**](http://localhost:4321/) in your browser to view the result 🚀

### 4. Customisable colours:
Change the data-theme of `cv.json` and choose one of the colour themes defined in theme.css, red, blue, green, cyber and default, with its variants in dark mode, or create your own.

## Commands

|     | Command         | Action                                                                       |
| :-- | :-------------- | :--------------------------------------------------------------------------- |
| ⚙️  | `dev` o `start` | Launches a local development server at `localhost:4321`.                   |
| ⚙️  | `build`         | Checks for errors and creates a production build in `./dist/`. |
| ⚙️  | `preview`       | Local preview at `localhost:4321`                                       |

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
