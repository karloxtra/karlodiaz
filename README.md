# Karlo Diaz — Portfolio

A minimal, editorial one-page portfolio. Pure HTML / CSS / JS — no build step, no dependencies.

## Structure

```
index.html      Markup: header, gallery, contact panel, project modal
styles.css      All styling (design tokens live at the top as CSS variables)
script.js       View switching, modal, scroll reveal, custom cursor
```

## Replacing the placeholder content

**Images** — each project in `index.html` currently uses a generated gradient block:
```html
<div class="project-media"><div class="placeholder-img" style="--h:214;--h2:250"></div></div>
```
Swap it for a real image:
```html
<div class="project-media"><img src="images/nordic-studio-01.jpg" alt="Nordic Studio brand identity"></div>
```
Add `.project-media img{width:100%;height:100%;object-fit:cover;display:block;}` to `styles.css` once you do.

**Project details** — edit the `PROJECTS` object at the top of `script.js`. Each key matches a `data-project="..."` attribute in `index.html`. Update `title`, `category`, `year`, `role`, `description`, and swap `hues` for real image paths inside `renderProject()` once you're using actual photos.

**Contact info** — update the email and social links inside the `#contact-view` section of `index.html`.

**Logo** — the header mark is a simple inline SVG in `index.html` (`.logo`). Swap it for your own mark, keeping it roughly 20–24px square.

## Gallery layout

The grid is 6 columns on desktop; each `.span-*` class controls how many columns a project spans (see `styles.css`, "Column spans" section). Rows are designed to sum to 6 for a clean edge, e.g. a 4-span item next to a 2-span item. Add or remove projects freely — just give each `<article>` a `span-*` class and matching aspect-ratio.

## Deploying

**Vercel**
1. Push this folder to a GitHub repo.
2. Import the repo in Vercel — no framework preset needed, it's a static site.
3. Leave build command empty and output directory as `/`.

**GitHub Pages**
1. Push to a repo, enable Pages in repo settings, point it at the root of `main`.

No environment variables, no npm install, nothing to configure.
