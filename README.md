# MatkaLottery.com

India's plain-language guide to lotteries, odds, prize tax, lottery scams and the history of matka — with free browser-based tools, lead generation, sponsorship, donations, contests and careers. **Educational only: no results, no tips, no betting.**

Live (GitHub Pages): `https://webworksa1.github.io/matkalottery-com/` — custom domain: `https://matkalottery.com/` once DNS is connected.

## What's inside

| Area | Pages |
|---|---|
| Home | `index.html` (hero tax ticket, live widgets, tools, scam band, lead form, videos, live news, FAQ, newsletter) |
| Learn | `learn.html`, `matka-history.html`, `is-matka-legal.html`, `state-lotteries.html`, `lottery-tax.html`, `claim-prize.html`, `odds-explained.html`, `glossary.html`, `scams.html` |
| Tools | `tools.html`, `tax-calculator.html`, `odds-calculator.html`, `scam-checker.html`, `simulator.html`, `number-generator.html`, `self-check.html` |
| Revenue | `winner-help.html` (3-step lead form), `partner.html`, `support.html`, `contests.html`, `careers.html` |
| Trust & legal | `about.html` (editorial policy), `contact.html`, `privacy.html`, `terms.html`, `disclaimer.html`, `404.html` |
| SEO / ads | `sitemap.xml`, `robots.txt`, `ads.txt`, JSON-LD on key pages, AdSense tag in every `<head>` |
| Assets | `assets/css/style.css`, `assets/js/app.js` (site-wide), `assets/js/tools.js` (calculators), `data/news.json` (fallback headlines) |
| Docs (not published) | `_docs/BUILD-PROMPT.md`, `_docs/RESEARCH.md`, `_docs/automation/update-news.yml` |

## Publish on GitHub Pages (free plan)

1. Repo **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
2. Branch **`main`**, folder **`/ (root)`** → **Save**. The site appears at the github.io address above within a minute or two.
3. Custom domain: enter `matkalottery.com` under **Custom domain** (GitHub creates a `CNAME` file), then at your registrar add A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` and a `www` CNAME to `webworksa1.github.io`. Tick **Enforce HTTPS** once the certificate is issued.

All links are relative, so the site works on both addresses.

## Forms (contact email stays hidden)

Every form posts by AJAX to FormSubmit. The destination address is stored only inside `assets/js/app.js`, reversed and base64-encoded in four parts, and decoded at the moment a form is sent. It is never written in HTML. If the service is unreachable, the visitor's email app opens with the message pre-filled.

**One-time step:** submit any form once on the live site; FormSubmit emails an activation link to the owner inbox. Click it and every form is live.

## Donations

The Support page works today with a pledge form. To add instant-pay buttons, edit `donate` in `assets/js/app.js`:

```js
donate: { paypal: 'https://paypal.me/yourname', upi: 'yourid@bank', bmc: 'https://buymeacoffee.com/yourname' }
```

## Self-updating parts

- **Live news**: Google News RSS via rss2json on every visit, with `data/news.json` as fallback.
- **Date-driven widgets**: today's Kerala weekly draw name, the current bumper season, scam alert of the day and myth of the day (all computed in IST).
- **Optional daily refresh**: copy `_docs/automation/update-news.yml` into `.github/workflows/` from the GitHub web editor to refresh `data/news.json` every day.

## Contests

Season 1 dates and prize amounts live in `contests.html`. Update them each season.

## AdSense checklist

- Connect the custom domain first (AdSense does not accept github.io subdomains).
- In AdSense: Sites → Add site → `matkalottery.com`; the `<head>` tag and `ads.txt` are already in place.
- Turn on Auto ads, and enable Google's consent message (Privacy & messaging) for EEA/UK visitors.
- Keep the no-gambling rule: never add results, tips, betting links or gambling advertisers.

## Editing

Plain HTML, CSS and JavaScript — no build step. Each page carries the same header and footer; when you change navigation or the footer, update every `.html` file.
