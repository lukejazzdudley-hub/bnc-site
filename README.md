# Brand Name Changes — website

Static marketing + legal site for **Brand Name Changes Ltd** and its app **Cadence**.
Zero build step — plain HTML/CSS/JS. Deploys to **Cloudflare Pages**.

```
index.html      → /            BNC company landing (= App Store Marketing URL)
cadence.html    → /cadence     Cadence product page
privacy.html    → /privacy     Privacy Policy   (App Store: required)
terms.html      → /terms       Terms of Service
support.html    → /support     Support + FAQ    (App Store: required)
404.html        → fallback
styles.css, site.js
```

Cloudflare Pages serves clean URLs automatically (`privacy.html` → `/privacy`).

---

## 1. Preview locally
```bash
cd ~/Developer/bnc-site
python3 -m http.server 8000      # then open http://localhost:8000
# (locally use /privacy.html etc.; clean URLs work once on Cloudflare Pages)
```

## 2. Register the domain — brandnamechanges.com
Easiest path (registrar + DNS + host all in Cloudflare):
1. Create a free account at https://dash.cloudflare.com
2. **Domain Registration → Register Domains** → search `brandnamechanges.com` → buy (~£8–10/yr, at cost).
   - If you'd rather use Porkbun/Namecheap, that's fine — you'll just point the domain's
     nameservers at Cloudflare when prompted in step 4.

## 3. Deploy to Cloudflare Pages
**Option A — direct upload (fastest, no git):**
1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Upload assets**.
2. Drag the whole `bnc-site` folder in. Name the project `bnc-site`. Deploy.

**Option B — git (auto-deploys on every push):**
1. Push this folder to a GitHub repo (see step 6).
2. Cloudflare → **Pages → Connect to Git** → pick the repo.
3. Build command: *(none)*. Build output directory: `/`. Deploy.

You'll get a free `bnc-site.pages.dev` URL immediately to test.

## 4. Attach the custom domain
1. In the Pages project → **Custom domains → Set up a domain** → `brandnamechanges.com`
   (and `www.brandnamechanges.com`).
2. If the domain is registered in Cloudflare, DNS is configured automatically.
   Otherwise, add the CNAME records Cloudflare shows you at your registrar.
3. SSL is automatic. Within minutes:
   - https://brandnamechanges.com/privacy
   - https://brandnamechanges.com/terms
   - https://brandnamechanges.com/support  ← these are what App Store review needs.

## 5. Point App Store Connect at the live URLs
In App Store Connect → your app → **App Information** / version page:
- **Privacy Policy URL:** `https://brandnamechanges.com/privacy`
- **Support URL:** `https://brandnamechanges.com/support`
- **Marketing URL (optional):** `https://brandnamechanges.com`

These already match what's baked into the app metadata, so nothing in the app changes.

## 6. (Optional) put it in git
```bash
cd ~/Developer/bnc-site
git init && git add -A && git commit -m "feat: Brand Name Changes site + Cadence pages"
# create a repo on GitHub, then:
# git remote add origin git@github.com:<you>/bnc-site.git && git push -u origin main
```

---

## Before you go live — finish these TODOs
Grep the project for `CONFIRM` and `TODO`:
- **Legal entity:** the footer/privacy/terms say *Brand Name Changes Ltd*. Replace with your
  exact registered name + company number + registered office to match your DUNS / Apple
  enrolment. (Search: `CONFIRM`)
- **App Store link:** the “Download” buttons on `cadence.html` point at `#`. Replace with your
  App Store URL once the app is live. (Search: `TODO`)
- **Screenshots:** `cadence.html` has 3 placeholder device frames — drop in real App Store
  screenshots (portrait PNG/JPG) when ready.
- **Governing law:** `terms.html` assumes England & Wales — adjust if your entity is elsewhere.
```bash
grep -rn "CONFIRM\|TODO" .
```
