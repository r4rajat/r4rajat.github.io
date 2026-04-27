# r4rajat.github.io

Personal portfolio for Rajat Gupta, deployed at **[r4rajat.com](https://r4rajat.com)** via GitHub Pages.

## Stack

Plain HTML, CSS, and JavaScript — no build step, no framework, no jQuery. Just static files served directly by GitHub Pages.

```
index.html              page markup
assets/css/style.css    theme tokens + layout
assets/js/main.js       theme toggle, project rendering, interactions
assets/js/projects.js   project data
assets/img/             images (favicon, education logos)
resume.pdf              placeholder résumé
CNAME                   custom domain mapping
```

## Run locally

From the repo root:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## License

[MIT](./LICENSE)
