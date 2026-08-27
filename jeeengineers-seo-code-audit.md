# Jee Engineers — SEO Code Audit & Fixes

Scope: reviewed Home, About, and 3 blog articles in full (rendered HTML). Products,
Contact, and FAQ pages weren't directly accessible to my crawler in this session, so
those sections give you the same template pattern to apply — ask your developer to
confirm against the live source.

---

## 0. Site-wide issues (fix once, apply everywhere)

### 0.1 www SSL error — urgent
`https://www.jeeengineers.com` throws a server/SSL error right now. `https://jeeengineers.com`
(no www) works. Fix the DNS/SSL config for the www subdomain, or better — pick **one**
canonical domain and 301-redirect the other permanently. Your own pages already set
`canonical: https://jeeengineers.com/...` (non-www), so make non-www the official
version and redirect www → non-www everywhere: Google Search Console, Google Business
Profile, social bios, and any backlinks.

### 0.2 Inconsistent URL format
Compare these real URLs from your site:
```
https://jeeengineers.com/what-is-fly-ash-bricks        ✅ clean, lowercase, hyphenated
https://jeeengineers.com/about                          ✅ clean
https://jeeengineers.com/How-Fly-Ash-Bricks-Are-Made.html  ❌ PascalCase + .html
```
Pick the clean pattern (lowercase-with-hyphens, no extension) as the standard, rename
the outlier, and 301-redirect the old `.html` URL to the new one so you don't lose any
indexing or links pointing at it.

### 0.3 No structured data (schema.org) detected
None of the pages I could inspect expose JSON-LD schema. This is the single biggest
lever for getting the expandable-sitelinks / rich-snippet look you asked about. Add the
blocks below inside `<head>` (or via your CMS's custom-code/head-injection field) on the
relevant pages.

---

## 1. Homepage (`/` or `/index`)

**Current:** Title, meta description, OG/Twitter tags are all present and unique — good, leave as is.

**Add — Organization + WebSite schema** (this is what teaches Google your brand identity, logo, and social profiles — required groundwork for sitelinks):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Jee Engineers",
  "url": "https://jeeengineers.com/",
  "logo": "https://jeeengineers.com/img/Jee-Engineers_logo.webp",
  "description": "Manufacturer of hydraulic fly ash brick making machines and concrete block making machines in Ahmedabad, India.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Naroda Nikol Road",
    "addressLocality": "Ahmedabad",
    "addressRegion": "Gujarat",
    "addressCountry": "IN"
  },
  "telephone": "+91-9327491268",
  "sameAs": [
    "https://www.facebook.com/jeeengineers",
    "https://x.com/jeeengineers",
    "https://www.instagram.com/jeeengineers"
  ]
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Jee Engineers",
  "url": "https://jeeengineers.com/",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://jeeengineers.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>
```
Drop the `SearchAction` block if you don't actually have a working on-site search page —
a broken search action can do more harm than good. Also drop the Reddit/Tumblr links
from `sameAs` (and from the visible footer) — that Reddit profile isn't a Jee
Engineers-branded account and shouldn't be tied to your entity data.

**Add — FAQPage schema.** Your homepage already has 8 written FAQs (What are fly ash
bricks…, Are fly ash bricks cost-effective…, etc.) — this content is sitting right
there unused for schema. This is your fastest win for a visible rich result:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What are fly ash bricks, and why are they preferred in construction?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Fly ash bricks are eco-friendly bricks made from fly ash, a waste product from coal combustion. They are preferred for their durability, strength, and environmentally friendly properties."
      }
    },
    {
      "@type": "Question",
      "name": "What are the advantages of using fly ash bricks over traditional clay bricks?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Fly ash bricks offer reduced water absorption, higher compressive strength, and better insulation properties compared to traditional clay bricks."
      }
    }
    // ...repeat this Question/Answer pattern for the remaining 6 FAQs already on the page
  ]
}
</script>
```

**H1 check:** Your H1 is "Your Fly Ash Brick Machine Experts" — good, keyword-relevant, keep it.

---

## 2. About page (`/about`)

**Issue:** H1 is "Building a Greener Future with Innovation" — on-brand, but doesn't
contain your core keyword ("fly ash brick machine" / "Jee Engineers"). Since About pages
carry real weight for entity disambiguation (remember, there's an unrelated "Jee
Engineers" kitchen-appliance company in Noida), tighten this to something like:

```html
<h1>About Jee Engineers — Fly Ash Brick Machine Manufacturer in Ahmedabad</h1>
```

**Add — AboutPage + Person schema** for founder credibility (you already have this copy
written: "Founded by Jayesh Panchal... 18+ years... 500+ clients"):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "mainEntity": {
    "@type": "Organization",
    "name": "Jee Engineers",
    "foundingDate": "2022",
    "founder": {
      "@type": "Person",
      "name": "Jayesh Panchal"
    },
    "numberOfEmployees": "10-50",
    "areaServed": "IN"
  }
}
</script>
```

**Add — FAQPage schema** for the About page's own FAQ block ("Who owns Jee Engineers…",
"Where is Jee Engineers located…" etc.) — same pattern as Section 1, different
questions. You have 4 FAQs here specifically about the company/location, which are
exactly the kind of query that helps disambiguate you from the Noida appliance company.

**Add — BreadcrumbList schema:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://jeeengineers.com/"},
    {"@type": "ListItem", "position": 2, "name": "About", "item": "https://jeeengineers.com/about"}
  ]
}
</script>
```

---

## 3. Product pages (`/fly-ash-bricks-machine`, `/fly-ash-bricks-machine2`,
`/fly-ash-bricks-machine-3`, `/automatic-fly-ash-bricks-machine`)

I couldn't load these directly this session, but the homepage lists real specs for
each model (JEE-FA-15, JEE-HYD-08, JEE-CBM-06, JEE-PM-500, JEE-BC-25) — that data
belongs in **Product schema** on each machine's own page, not just as homepage table
rows. Template (adjust per model):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Automatic Fly Ash Brick Machine — JEE-FA-15",
  "image": "https://jeeengineers.com/img/hero-img.webp",
  "description": "Fully automated PLC-controlled hydraulic press delivering 12,000–18,000 bricks/day, 160–200 tons hydraulic pressure, 32.5 HP connected power.",
  "brand": {
    "@type": "Brand",
    "name": "Jee Engineers"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://jeeengineers.com/fly-ash-bricks-machine",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Jee Engineers"
    }
  }
}
</script>
```
If you don't want to publish exact prices, you can omit `price` from `Offer` — but keep
`priceCurrency` and `availability`, or use `"@type": "AggregateOffer"` with a price range
instead. Also add BreadcrumbList schema on each (Home → Products → [Machine Name]),
same pattern as Section 2.

Also — check each product page's `<title>` and meta description are unique per model
(not just reusing the homepage copy). Each should target the specific model name plus
"fly ash brick machine Ahmedabad."

---

## 4. Blog articles (`/what-is-fly-ash-bricks`, `/what-is-fly-ash`,
`/How-Fly-Ash-Bricks-Are-Made.html` → rename per Section 0.2)

**Title/H1 mismatch:** On `/what-is-fly-ash-bricks`, the `<title>` tag reads
"What is Fly Ash Bricks? Guide | Jee Engineers" but the on-page H1 reads "Why Fly Ash
Bricks Are The Best Choice For Construction Projects." These are about different
angles of the same topic — pick one framing and align both so Google (and readers)
get a consistent signal about what the page is actually about.

**Add — Article schema** (you already have `meta-og:type: article` set, but no
matching JSON-LD):
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Why Fly Ash Bricks Are The Best Choice For Construction Projects",
  "image": "https://jeeengineers.com/img/Why-Fly-Ash-Bricks-Are-The-Best-Choice-For-Construction-Projects.webp",
  "author": {"@type": "Organization", "name": "Jee Engineers"},
  "publisher": {
    "@type": "Organization",
    "name": "Jee Engineers",
    "logo": {"@type": "ImageObject", "url": "https://jeeengineers.com/img/Jee-Engineers_logo.webp"}
  },
  "mainEntityOfPage": "https://jeeengineers.com/what-is-fly-ash-bricks"
}
</script>
```
Add a real `datePublished` and `dateModified` if your CMS tracks them — right now there's
no visible publish date on the page itself, which is worth adding for readers too, not
just schema.

**Add — BreadcrumbList schema**, matching the breadcrumb text already visible on the
page (Home / Blog / [Article Title]) — same JSON-LD pattern as Section 2, three levels
deep for blog posts.

Apply this same Article + Breadcrumb pattern to every blog post, including the two I
could only see via search snippet (`/what-is-fly-ash`, `/How-Fly-Ash-Bricks-Are-Made`).

---

## 5. Contact, FAQ, Products (listing) pages

I wasn't able to load these directly, but apply the same baseline to each:
- Unique `<title>` and meta description (don't just reuse the homepage's)
- BreadcrumbList schema
- On `/faq` specifically: **FAQPage schema** wrapping every question on that page —
  this is likely your single richest page for schema since it's 100% Q&A content
- On `/products`: **ItemList schema** listing all machine models with links to each
  product page, so Google understands it as a catalog page, not just marketing copy

---

## Priority order

2. Add Organization + WebSite schema to homepage
3. Add FAQPage schema to homepage, About, and /faq (fastest visible win)
4. Add BreadcrumbList schema sitewide
5. Add Product schema to the 4 machine pages
6. Add Article schema to blog posts
7. Clean up the one non-standard URL and redirect it
8. Fix the About page H1 and the blog title/H1 mismatch
