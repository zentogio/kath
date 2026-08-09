# Backlink Profile Audit — kath-ebon.vercel.app

**Data source tier:** Tier 0 (Common Crawl + verification crawler only). No Moz API key or Bing Webmaster API key configured (`backlinks_auth.py --check` confirms `moz.available: false`, `bing.available: false`). DA/PA, referring-domain counts, spam score, anchor text, and link velocity are **not available** at this tier and are not estimated below.

---

## Finding 1: No backlink authority data exists for this domain — expected for a pre-launch site, not a red flag

**Severity:** Info

**Description:**
Common Crawl's domain-level web graph has no record of `kath-ebon.vercel.app` at all. The domain returns `in_crawl: false` and `in_rankings: false`, meaning PageRank, PageRank rank, harmonic centrality, and harmonic centrality rank are all `null` — not zero, `null` (no data point exists to score).

Per the validator's standard interpretation: **a domain absent from Common Crawl must not be read as "low authority."** It means Common Crawl has not crawled/indexed the domain yet, consistent with a small, pre-launch, low-traffic site that likely has few or no inbound links pointing at it from anywhere on the web yet.

Separately, homepage verification confirms the site itself is live and functioning:
- `GET https://kath-ebon.vercel.app/` → `200 OK`, served by Vercel, built with Astro v7.1.6 (per `<meta name="generator">`), title "Home — Studio Kath".
- No known/candidate backlinks were supplied for verification, so `verify_backlinks.py` was not run — there is currently no known inbound link to check.

**Evidence:**
- `claude-seo run backlinks_auth.py --check --json` → tier 0, `moz.available: false`, `bing.available: false`, `commoncrawl.available: true`, `verify.available: true`.
- `claude-seo run commoncrawl_graph.py kath-ebon.vercel.app --json`:
  ```json
  {
    "domain": "kath-ebon.vercel.app",
    "in_crawl": false,
    "in_rankings": false,
    "pagerank": null,
    "pagerank_rank": null,
    "harmonic_centrality": null,
    "harmonic_centrality_rank": null,
    "n_hosts": null,
    "note": "Domain not found in Common Crawl data. It may be too new, too small, or not yet crawled."
  }
  ```
  Common Crawl release used: `cc-main-2026-jan-feb-mar` (quarterly web graph; source: https://commoncrawl.org/web-graphs).
- `claude-seo run render_page.py https://kath-ebon.vercel.app/ --mode never --json` → `status_code: 200`, `Server: Vercel`, `Last-Modified: Sun, 02 Aug 2026 16:39:18 GMT`, confirming the site is live and recently deployed.
- Report data validated via `claude-seo run validate_backlink_report.py --report report_data.json --json` → `status: PASS` (one `info`-level note reiterating the "absent from CC ≠ low authority" interpretation guardrail, already applied above).

**Recommendation:**
No action needed on the backlink profile itself right now — there is nothing to remediate, only a data gap consistent with the site's age. Do not chase a numeric "authority score" at this stage; there isn't enough underlying data to produce one honestly (see Finding 3, Backlink Health Score: INSUFFICIENT DATA). Once the site has been live and promoted for a period (weeks to months) and/or migrates to a custom domain, re-run this check — Common Crawl updates its web graph quarterly.

---

## Finding 2: Site is on a `*.vercel.app` preview/deployment subdomain — any backlinks earned now will not transfer to a future custom domain

**Severity:** High

**Description:**
`kath-ebon.vercel.app` is a Vercel-assigned deployment subdomain, not a custom domain owned by the business. This matters specifically for link building strategy: any external links, citations, directory listings, press mentions, or social profile links pointing at `kath-ebon.vercel.app` today will point at a URL that is expected to be abandoned once "Studio Kath" moves to its own domain (e.g. `studiokath.com` or similar). Unless every one of those links is later found and manually updated (rarely realistic — most third parties never update a link once published), the authority/equity from that link building effort will be stranded on a domain the business no longer uses, rather than accruing to the real brand domain.

This is a sequencing issue, not a backlink-quality issue: the risk isn't that the current subdomain has "bad" links, it's that investing outreach/PR/directory-submission effort before the domain migration effectively discounts that effort by close to 100% once the migration happens (a subsequent 301 redirect from the old Vercel subdomain to the new domain can recover some of that equity, but only for links Google has already crawled and associated with the site by migration time — and Vercel preview subdomains are also more likely to be deprioritized or reused/reassigned as a shared platform namespace than a domain the business fully controls).

**Evidence:**
- `render_page.py` confirms the live production URL is `https://kath-ebon.vercel.app/`, served directly by Vercel's edge network (`Server: Vercel`, `X-Vercel-Cache: HIT`, `X-Vercel-Id: sin1::...`) with no custom domain / CNAME in front of it.
- No custom domain (e.g. a `.com`/`.co.th` apex) is referenced anywhere in the render output, headers, or site metadata reviewed.
- Common Crawl has no record of the domain at all (Finding 1), meaning no third-party links have been discovered yet — i.e., this is the correct moment to make this change, before any external link equity accumulates on the wrong hostname.

**Recommendation:**
Prioritize migrating to a custom domain (a `.com`, or a Thailand-relevant TLD such as `.co.th`/`.in.th` if geographically relevant to the Bangkok-based brand) **before** beginning any deliberate link-building, PR outreach, directory submissions, or influencer/press collaboration for Studio Kath. Concretely:
1. Register and configure the production domain in Vercel's project settings (Vercel supports this natively — the `*.vercel.app` URL can remain as a fallback/preview alias).
2. Set the custom domain as primary and 301-redirect the `*.vercel.app` URL to it (Vercel does this automatically for the assigned subdomain once a custom domain is attached).
3. Update `astro.config.mjs`'s `site` property to the new domain (also needed for the sitemap fix flagged in the sitemap audit — see `sitemap.md` Finding 2) so canonical URLs, sitemap entries, and structured data all resolve to the permanent domain.
4. Only after the domain is live should any backlink acquisition (directory listings, press, social bio links, guest posts, marketplace/Etsy-style profile links, etc.) begin, so all earned link equity accrues to the permanent domain from day one.

This is not a duplicate of the technical/crawlability audit — flagging here specifically because it changes the ROI calculus of any backlink-building work recommended from this audit. For crawlability/canonicalization mechanics of the domain migration itself, see `/seo technical <url>`.

---

## Finding 3: Backlink Health Score — INSUFFICIENT DATA

**Severity:** Info

**Description:**
Per the confidence-weighted scoring model (referring domains, domain quality distribution, anchor text naturalness, toxic link ratio, link velocity, follow/nofollow ratio, geographic relevance), a Tier 0 free-source-only check has usable data for **0 of 7** scoring factors:

| Factor | Weight | Data available? |
|---|---|---|
| Referring domain count | 20% | No — requires Moz or DataForSEO |
| Domain quality distribution | 20% | No — requires Moz or DataForSEO |
| Anchor text naturalness | 15% | No — requires Moz, Bing, or DataForSEO |
| Toxic link ratio | 20% | No — requires Moz spam score or DataForSEO |
| Link velocity trend | 10% | No — DataForSEO only |
| Follow/nofollow ratio | 5% | No — requires Bing or DataForSEO |
| Geographic relevance | 10% | No — requires Bing or DataForSEO |

Common Crawl PageRank/harmonic centrality (the one Tier-0 metric) also returned `null` because the domain isn't in the crawl at all (Finding 1), so even that single available signal has no value to report this cycle.

**Evidence:**
- Automated validation via `validate_backlink_report.py` explicitly flags: producing a numeric score with fewer than 4/7 factors populated is misleading and must be reported as INSUFFICIENT DATA instead — confirmed no numeric score is reported here.

**Recommendation:**
Do not treat "INSUFFICIENT DATA" as a negative signal — it is the expected, honest state for a pre-launch site with no configured paid data sources. To get a real score:
- Add a free Moz API key (`https://moz.com/products/api`, 2,500 rows/month free) to unlock DA/PA, spam score, and referring-domain counts (Tier 1).
- Register the (future custom) domain with Bing Webmaster Tools for inbound-link and geographic data (Tier 2) — note this only works for domains the business controls in a verified Bing Webmaster property, not arbitrary competitor domains.
- For the highest-fidelity, single-pass view (referring domains, toxic ratio, link velocity, anchor text), install the DataForSEO extension (`./extensions/dataforseo/install.sh`) once budget allows (Tier 3).
- Re-run this check after the domain migration recommended in Finding 2 and after any deliberate link-building activity, using the permanent domain rather than `kath-ebon.vercel.app`.
