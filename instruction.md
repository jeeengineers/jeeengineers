JEE ENGINEERS WEBSITE - SITE-WIDE FIX CHECKLIST
For pages: About Us, Contact Us, Products, Blog (and any other inner pages)
=================================================================

INSTRUCTIONS FOR EACH PAGE: Apply every item below. Skip an item only if it
does not apply to that specific page (noted where relevant).


SECTION 1: HEAD / META TAGS (every page)
-----------------------------------------
1. Give every page its own unique <title> tag. Do not reuse the homepage
   title. Keep it under 60 characters, include the page topic + brand name.
   Example for About page: "About Jee Engineers | Fly Ash Brick Machine
   Manufacturer, Ahmedabad"
   Example for Contact page: "Contact Jee Engineers | Fly Ash Brick Machine
   Manufacturer, Ahmedabad"
   Example for Products page: "Fly Ash Brick & Concrete Block Machines |
   Jee Engineers Products"
   Example for Blog page: "Blog | Jee Engineers - Fly Ash Brick Machine
   Insights"

2. Give every page its own unique meta description (150-160 characters).
   Do not copy the homepage description word for word.

3. Update the <link rel="canonical"> tag on every page to match that
   page's own URL, not the homepage.
   Example: <link rel="canonical" href="https://jeeengineers.com/about" />

4. Add <meta name="robots" content="index, follow" /> to every page (copy
   from homepage).

5. Update og:title, og:description, og:url on every page to match that
   page's own content and URL (do not leave homepage values).

6. Update twitter:title and twitter:description on every page to match
   that page's own content.

7. Add og:image:width="1200" and og:image:height="630" on every page
   (reuse hero-img.png or a page-specific image if available).

8. Add <meta name="theme-color" content="#0d47a1" /> to every page (copy
   from homepage).

9. Keep favicon links, manifest link, and Google Fonts/Font Awesome/
   Bootstrap Icons links identical across all pages (copy from homepage
   head exactly).

10. Add the same font-loading fix used on homepage: load Google Fonts with
    media="print" onload="this.media='all'" instead of a plain blocking
    stylesheet link.

11. Add resource preloads in <head> on every page (not at the bottom of
    the file, not outside </html>):
    <link rel="preload" href="css/bootstrap.min.css" as="style">
    <link rel="preload" href="css/style.css" as="style">
    <link rel="preload" href="js/main.js" as="script">


SECTION 2: SCHEMA / STRUCTURED DATA (every page)
--------------------------------------------------
12. Add the same LocalBusiness JSON-LD block used on the homepage to every
    page (copy exactly, same name/address/phone/sameAs).

13. Add the same WebSite JSON-LD block (with SearchAction) to every page.

14. Add a BreadcrumbList JSON-LD block to every page, but update it to
    reflect that page's actual position in the site, not just "Home".
    Example for About page:
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://jeeengineers.com/" },
        { "@type": "ListItem", "position": 2, "name": "About", "item": "https://jeeengineers.com/about" }
      ]
    }
    Do the same pattern for Contact, Products, and Blog (Home -> Contact,
    Home -> Products, Home -> Blog). If Blog has individual post pages,
    those should go Home -> Blog -> Post Title.

15. FAQ schema: only add FAQPage JSON-LD on pages that actually contain
    an FAQ section. If About/Contact/Products/Blog don't have FAQs, skip
    this. If there is a dedicated FAQ page, add the FAQPage JSON-LD there
    using the same 8-question format as the homepage.

16. Product schema: on the Products page specifically, add Product JSON-LD
    for each individual product (not just an ItemList like the homepage,
    but full Product entries with name, description, and image if
    possible). Example:
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Fly Ash Brick Making Machine",
      "description": "short description here",
      "image": "https://jeeengineers.com/img/product-image.jpg",
      "url": "https://jeeengineers.com/fly-ash-bricks-machine"
    }
    Repeat for each product. Do not reuse the same URL for two different
    products (this was a bug on the homepage - check and fix there too).

17. Blog page: if blog posts exist as individual pages, add Article or
    BlogPosting JSON-LD schema on each individual post page (not the blog
    listing page), including headline, image, datePublished, and author.

18. Contact page: add a ContactPage or extend LocalBusiness schema with
    openingHours if you have business hours, and a geo coordinate
    (latitude/longitude) if available, so Google Maps/local search can
    use it.


SECTION 3: HEADINGS (every page)
-----------------------------------
19. Each page must have exactly ONE <h1> tag. Check every page for
    duplicate <h1> tags (this was found and fixed on the homepage in the
    Feature section - check if a similar "Why Choose Us" or repeated
    section exists on other pages and change extra <h1> tags to <h2>).

20. Make sure heading order is logical: h1 then h2 then h3, no skipping
    levels, no h3 before h2 on the same page.


SECTION 4: IMAGES (every page)
---------------------------------
21. Every <img> tag must have a descriptive, unique alt attribute
    describing what is actually in that image (not generic repeated text
    like "Fly Ash Bricks Making Machine" on every single image).

22. Every <img> tag must have explicit width and height attributes to
    prevent layout shift.

23. Any image that is not visible on first load (below the fold) should
    have loading="lazy". Images visible immediately in the hero/top of
    page should NOT have lazy loading.


SECTION 5: LINKS (every page)
--------------------------------
24. Every external link (social media icons, any link to a different
    domain) must have target="_blank" rel="noopener noreferrer".

25. Phone numbers must be clickable: <a href="tel:+919327491268">
26. WhatsApp numbers must be clickable: <a href="https://wa.me/919054520708">
27. Email addresses must be clickable: <a href="mailto:jeeengineers@gmail.com">
    Apply this wherever phone/WhatsApp/email appear on any page (footer,
    Contact page body, header if present).

28. Check every internal link (products, services, "View Details" etc.)
    actually points to the correct, unique page. Do not let two different
    product names link to the same URL unless they truly are the same
    page.


SECTION 6: SCRIPTS / PERFORMANCE (every page)
-------------------------------------------------
29. Load jQuery and Bootstrap bundle JS with the defer attribute:
    <script src="...jquery.min.js" defer></script>
    <script src="...bootstrap.bundle.min.js" defer></script>

30. Load js/main.js with the defer attribute as well:
    <script src="js/main.js" defer></script>
    After adding defer, test the page to confirm no JavaScript errors
    appear in the browser console (dropdown menus, accordions, animations,
    back-to-top button should all still work).

31. Do not place any <link rel="preload"> tags after the closing </html>
    tag. All preload tags belong inside <head>.


SECTION 7: FOOTER (every page)
---------------------------------
32. Use the exact same footer HTML across all pages (copy from homepage)
    so navigation, contact info, and social links are consistent
    everywhere, including the clickable phone/WhatsApp/email links and the
    rel="noopener noreferrer" attributes on social icons.

33. On the current page in the footer's "Quick Links"/"Popular Link"
    section, do not link back to itself as a plain anchor if the site
    supports marking the current page (optional nice-to-have, not
    critical).


SECTION 8: PAGE-SPECIFIC NOTES
----------------------------------
ABOUT PAGE:
- Make sure the main page heading (h1) is unique to About, not a repeat
  of the homepage h1 ("Your Fly Ash Brick Machine Experts").

CONTACT PAGE:
- Add a Contact form if not present, and make sure form fields have
  proper <label> tags for accessibility.
- Add the LocalBusiness schema with openingHours and geo coordinates here
  in particular, since this is the most relevant page for that data.

PRODUCTS PAGE:
- Each product should ideally have its own dedicated URL/page with full
  Product schema (name, image, description) as noted in item 16.
- Make sure "View Details" buttons do not point to duplicate URLs.

BLOG PAGE:
- Blog listing page needs unique title/meta as noted above.
- Each individual blog post page needs its own title, meta description,
  canonical URL, and Article/BlogPosting schema (item 17).
- Add a BreadcrumbList on each post: Home -> Blog -> Post Title.


END OF CHECKLIST