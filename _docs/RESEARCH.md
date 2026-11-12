# Research notes and decision record

## Decision

Build an educational + tools + scam-defence site, not a results/tips site.

| Option | Traffic potential | AdSense outcome | Legal risk | Verdict |
|---|---|---|---|---|
| Satta/matka results & tips | Very high | Restricted/rejected (real-money gambling content; India not exempt) | High (illegal activity in all states) | Reject |
| Legal state lottery results aggregator | High, crowded | Thin-content risk, low RPM | Low | Weak |
| **Education, tax/odds tools, scam defence, winner help** | Medium-high, underserved | Educational gambling content can show ads unrestricted; finance/tax pages earn higher CPCs | Low | **Build** |

Supporting facts gathered:
- Matka began as betting on New York–Bombay cotton rates; Worli matka started 1962; peak monthly betting exceeded ₹500 crore in the 1980s–90s (Wikipedia: Matka gambling).
- India's gambling market is estimated at about US$60 billion a year, roughly half illegal (Wikipedia: Gambling in India).
- Online money games were banned by the Promotion and Regulation of Online Gaming Act, 2025 (assent 22 Aug 2025).
- Lottery prizes: 30% tax + surcharge + 4% cess; Kerala deducts 10% agent commission first; TDS above ₹10,000 (now Section 393(3) of the Income-tax Act 2025).
- Thiruvonam bumper turnover was about ₹375 crore in 2025 (Kerala Kaumudi) — large, recurring winner population.
- Scam pressure: national coverage in 2026 reports most scam victims recover nothing (Livemint survey, Oct 2026).

Revenue model (planning assumptions to replace with real data after launch):
- Display ads via AdSense Auto ads on all pages; tax/claim pages carry the highest-value intent.
- Lead generation: winner leads to CA/financial-planner/lawyer partners on a per-lead or retainer basis; scam-victim leads to legal-aid partners.
- Sponsorships: tool sponsorship, bank/fintech fraud-awareness campaigns, newsletter.
- Donations and contest sponsors.

## Sites studied (39)

Lottery operators and result publishers: lottery.net, lotteryusa.com, lotterypost.com, powerball.com, megamillions.com, national-lottery.co.uk, lotto.net, euro-millions.com, calottery.com, lottery.com, olg.ca, lotterywest.wa.gov.au, nylottery.ny.gov, texaslottery.com, lottery.ie, thelotter.com, loteriasyapuestas.es, keralalotteries.net, lotterysambad.com, lotteryextreme.com, lottostrategies.com, smartluck.com.

Maths and tools: omnicalculator.com (lottery odds), random.org, lotterycodex.com.

Responsible gambling and help: ncpgambling.org, gambleaware.org, gamcare.org.uk, responsiblegambling.org, gamblingtherapy.org, gamblersanonymous.org.

Scam and government: consumer.ftc.gov (prize scams), sancharsaathi.gov.in (Chakshu).

Reference and policy: Wikipedia (Matka gambling, Ratan Khatri, Kerala State Lotteries, Gambling/Lotteries in India), Google AdSense eligibility, Google Publisher Restrictions (online gambling).

## Features adopted

- Result-card and countdown patterns → reused for honest widgets (today's Kerala draw name, bumper season) that link only to the official site.
- "Check your numbers", quick-pick and odds pages → odds calculator, random generator with honest framing.
- Payout/annuity calculators → India prize tax calculator.
- Scam pages (FTC, lotteryusa, calottery, Texas "player protection") → Scam shield + interactive message checker.
- Self-assessment, spend calculator, help numbers (GambleAware, GamCare, RGC, Gambling Therapy, GA) → self-check quiz, lifetime simulator, India helplines.
- Good-causes counters (National Lottery, Lotterywest, Lottery.ie) → transparent use-of-funds bars on the Support page.
- Trust signals (licence badges, disclaimers, 18+) → disclosure footer, editorial policy, no-fee promises.
- Mega-menus, skip links, search, cookie notice, multilingual → header search, accessibility, Hindi-ready fonts.
