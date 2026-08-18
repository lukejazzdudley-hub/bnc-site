# Brand Name Changes — website

Static marketing + legal site for **Brand Name Changes Ltd** and its app **Cadence**.
Zero build step — plain HTML/CSS/JS. The production site is served by
**GitHub Pages** from this repository.

```
index.html      → /            BNC company landing (= App Store Marketing URL)
cadence.html    → /cadence     Cadence product page
privacy.html    → /privacy     Privacy Policy   (App Store: required)
terms.html      → /terms       Terms of Service
support.html    → /support     Support + FAQ    (App Store: required)
404.html        → fallback
styles.css, site.js
```

GitHub Pages serves the production clean URLs (`privacy.html` → `/privacy`).

---

## 1. Preview locally
```bash
cd ~/Developer/bnc-site
python3 -m http.server 8000      # then open http://localhost:8000
# (locally use /privacy.html etc.; production uses the clean GitHub Pages URLs)
```

## 2. Deploy

Push a reviewed commit to `master`. GitHub Pages publishes the static files at
`brandnamechanges.com`; there is no package install or build command. Confirm the
custom-domain and HTTPS settings remain enabled in the repository's Pages
settings, then verify:

1. `https://brandnamechanges.com/cadence`
2. `https://brandnamechanges.com/privacy`
3. `https://brandnamechanges.com/terms`
4. `https://brandnamechanges.com/support`

The live response should identify GitHub Pages and return HTTP 200 for each URL.

## 3. Store-console URLs

Keep these exact URLs in both store consoles:

- https://brandnamechanges.com/privacy
- https://brandnamechanges.com/terms
- https://brandnamechanges.com/support  ← these are what App Store review needs.
- https://brandnamechanges.com/delete-account

---

## Before you go live — finish these TODOs
Grep the project for `CONFIRM` and `TODO`:
- **Legal entity:** the footer/privacy/terms say *Brand Name Changes Ltd*. Replace with your
  exact registered name + company number + registered office to match your DUNS / Apple
  enrolment. (Search: `CONFIRM`)
- **Store links:** `cadence.html` currently links to the public TestFlight beta and
  Google Play testing enrolment. Replace them with the public store listings only
  after each listing is live.
- **Product media:** the current gallery uses authentic app captures. Replace it
  with the final signed-candidate screenshot set after physical acceptance; never
  substitute invented interface artwork.
- **Governing law:** `terms.html` assumes England & Wales — adjust if your entity is elsewhere.
```bash
grep -rn "CONFIRM\|TODO" .
```
