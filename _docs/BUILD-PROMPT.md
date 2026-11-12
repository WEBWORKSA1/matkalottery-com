# MatkaLottery.com — Phase-wise Build Prompt

Copy each phase into your AI builder in order. Each phase assumes the previous one is done and committed.

---

## The concept (read first)

**MatkaLottery.com = India's honest guide to lotteries, odds, prize tax, scams and the history of matka.**
It captures the huge "matka / lottery" search audience with content Google AdSense can actually monetize: education, calculators, scam defence and help for winners. It never publishes results, "guessing" charts, tips, or links to betting.

Why this and not a results site:
- Satta/matka is illegal everywhere in India (Public Gambling Act 1867 + state acts). A results/tips site facilitates an illegal activity, gets AdSense rejected and invites takedowns.
- Google's Publisher Restrictions limit ads on real-money gambling content, and India is not on the exempt-country list. Google states that *educational* material about gambling can show ads without restriction.
- The money is in the adjacent intents nobody serves well: prize tax (finance CPCs), claim procedure, scam warnings, odds maths, legal status, matka history (boosted by the 2024 Telugu film *Matka* and the 2026 series *Matka King*).
- Lead generation: a ₹1 crore Kerala winner keeps roughly ₹59 lakh after commission, tax, surcharge and cess. Winners need CAs, financial planners and lawyers fast — that is a sellable, high-value lead.

## Non-negotiables (apply to every phase)

1. **AdSense:** put this exact tag in the `<head>` of every page: `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6620975821265271" crossorigin="anonymous"></script>`. Rely on Auto ads; no empty ad boxes; never ask users to click ads. Add `ads.txt` with `google.com, pub-6620975821265271, DIRECT, f08c47fec0942fa0`.
2. **No gambling facilitation:** no results, predictions, "fix game", charts, panna/jodi tables, ticket sales, affiliate links to betting, or betting ads (also refuse such advertisers on the partner page).
3. **Top banner on every page:** "Contact, if you are interested in this website/domain name/Sponsorship/Advertisement/Partnership" linking to `https://web.works/contact`.
4. **One contact email, never displayed.** Use OWNER_EMAIL (supplied privately) only inside JavaScript, stored encoded (reversed + base64, split into parts) and decoded at runtime. Forms post to `https://formsubmit.co/ajax/<decoded email>`; fallback is a JS-built `mailto:` opened on click. The address must not appear in any HTML, sitemap, README or visible text.
5. **Static + free hosting:** plain HTML/CSS/JS, no build step, relative links only (site must work at `https://<user>.github.io/matkalottery-com/` and at `https://matkalottery.com/`), served from the `main` branch root on GitHub Pages.
6. **Trademark/copyright disclosure** in every footer and on a full Disclaimer page. Write all copy originally; no copied text, logos, film posters or photos of real people.
7. **Accuracy:** every legal/tax figure must be checked against current law (Income-tax Act 2025 renumbering from 1 April 2026; Online Gaming Act 2025). Show "not legal/tax advice" notes.

---

## Phase 1 — Foundation and design system

Build the shell: `assets/css/style.css`, `assets/js/app.js`, favicon, `_config.yml` (exclude repo docs), `robots.txt`, `ads.txt`, `404.html`.

Design direction ("the lottery ticket"):
- Palette: ink indigo `#1C1F5A`, ticket paper `#F2F5EF`, ticket magenta `#C81E63` (actions), security green `#0E6E55` (safe), marigold `#F2B705` (numbers/highlights), warning red `#B42318`.
- Type: **Anybody** (variable width) for headlines and serial-number style figures; **Hind** for body text (Latin + Devanagari, ready for Hindi pages).
- Signature element: a perforated ticket card (notched edges, dashed tear line, serial number) used for the hero calculator and live widgets. Everything else stays quiet: left-aligned text, 68ch line length, 1.5px ink borders, sentence-case labels.
- Quality floor: responsive to 320px, visible focus rings, skip link, `prefers-reduced-motion`, AA contrast.

Shared page chrome: top banner, header (logo, nav: Learn, Tools, Scam shield, News, Videos, Winner help; live site search), footer (Learn / Tools / Get involved columns, help numbers, disclosure). Cookie notice injected by JS.

## Phase 2 — Core content (Learn hub)

Write original, sourced long-form guides (700–1,200 words each, FAQ + Article schema):
- History of matka (cotton-rate betting, Kalyanji Bhagat 1962, Ratan Khatri, decline, cinema)
- Is matka legal? (State subject, Public Gambling Act 1867, state acts, Lotteries (Regulation) Act 1998, Online Gaming Act 2025)
- State lotteries in India (who runs them, Kerala's weekly schedule and bumpers, how to verify a result)
- Lottery tax in India (30% + surcharge + 4% cess, TDS, Kerala 10% agent commission, worked examples, new section numbers)
- How to claim a prize safely
- Odds explained (combinations, expected value, gambler's fallacy, myths)
- Glossary
- Scam shield (scam types, red flags, what to do in the first hour: 1930, cybercrime.gov.in, Sanchar Saathi Chakshu)

## Phase 3 — Interactive tools

All client-side, no data leaves the browser:
1. Prize tax calculator (commission %, regime toggle, surcharge tiers, cess, net amount, CA-check CTA)
2. Odds calculator (k-from-n lotto with matches + bonus pool using BigInt; raffle-style "tickets printed" mode; expected value)
3. Scam message checker (paste text → weighted red-flag scoring → verdict, reasons, next steps, WhatsApp share)
4. Lifetime simulator (ticket spend over years, Monte-Carlo of 1,000 lifetimes, canvas chart)
5. Random number generator (crypto RNG, with an honest "this can't improve odds" note)
6. Self-check quiz (9 questions, bands, Tele-MANAS 14416 / iCall resources)

## Phase 4 — Revenue engine

- **Winner & victim help (lead gen):** 3-step form (need → details → contact), live take-home estimate, trust promises (no fees, never ask for OTP), lead scoring in the subject line. Mini lead forms on home, tax and claim pages.
- **Advertise & partner:** audience, placements (tool sponsorship, scam-awareness campaigns, newsletter, CA/lawyer lead partner programme, CSR), refused categories, inquiry form, link to web.works/contact.
- **Support us (donations):** tiers, use-of-funds split (operations, promotion & marketing, hiring, contests & prizes), pledge form; optional PayPal/UPI/Buy Me a Coffee links via config.
- **Contests:** free, skill-judged only (no random draws): scam-awareness reel, probability puzzle, myth-buster essay; rules, judging, prizes, entry form.
- **Careers:** writers, translators, video creators, fact-checker, moderator, partnerships (commission); application form.

## Phase 5 — Automation and freshness

- Live news: fetch Google News RSS through rss2json for India lottery/scam/gaming-law queries; fall back to `data/news.json`.
- Date-driven widgets: today's Kerala draw name, the current bumper season, scam alert of the day, myth of the day.
- Optional GitHub Action (see `_docs/automation`) that refreshes `data/news.json` daily.

## Phase 6 — SEO, performance, AdSense readiness QA

- Unique titles/descriptions, canonical to `https://matkalottery.com/`, Organization/WebSite/FAQ/Article schema, `sitemap.xml`.
- Required pages: About (with editorial policy), Contact, Privacy (Google cookies + opt-out), Terms, Disclaimer.
- Check: no broken links, no exposed email, AdSense tag on every page, no gambling outbound links, mobile layout, Lighthouse ≥ 90.

## Phase 7 — Launch

1. Push to `WEBWORKSA1/matkalottery-com` on `main`.
2. Settings → Pages → Deploy from branch → `main` / root.
3. Custom domain: add `matkalottery.com` in Pages settings (creates `CNAME`), set DNS A records to 185.199.108.153, .109.153, .110.153, .111.153 and `www` CNAME to `webworksa1.github.io`, enable HTTPS.
4. Submit one test form and click FormSubmit's activation email.
5. Add the site in AdSense, enable the Google CMP for EEA/UK visitors, request review.

## Phase 8 — Growth roadmap

Hindi, Marathi, Malayalam and Bengali versions; weekly scam-alert newsletter; a YouTube channel built from the guides; state-by-state claim guides; "verify a Kerala ticket safely" explainer; press outreach to fact-checkers and cyber cells; sponsor-funded contest seasons.
