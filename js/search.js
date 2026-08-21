// Dynamic Glassmorphic Search Functionality for Jee Engineers Website
class StaticSiteSearch {
  constructor() {
    this.searchIndex = [];
    this.searchModal = null;
    this.searchInput = null;
    this.searchResults = null;
    this.searchTimeout = null;
    this.minSearchLength = 2;
    this.maxResults = 12;

    this.sitePages = [
      // Primary Pages
      { path: 'index', title: 'Home - Jee Engineers Ahmedabad', category: 'Core Page', description: 'Manufacturer of Fly Ash Brick Making Machines, Paver Block Machines, and Concrete Block Equipment in India.' },
      { path: 'about', title: 'About Jee Engineers', category: 'Company', description: 'Leading manufacturer of high-quality fly ash brick machines with over 15+ years of engineering excellence.' },
      { path: 'products', title: 'Brick & Block Making Machines', category: 'Products', description: 'Explore semi-automatic, fully automatic, and hydraulic fly ash brick making machines.' },
      { path: 'blog', title: 'Fly Ash Brick Industry Blog & Guides', category: 'Blog', description: 'Technical guides, plant setup tutorials, cost evaluations, and machinery maintenance tips.' },
      { path: 'contact', title: 'Contact Jee Engineers', category: 'Contact', description: 'Get in touch for machinery inquiries, quotation requests, on-site technical support, and plant consultation.' },
      { path: 'faq', title: 'Fly Ash Brick Machine FAQs', category: 'Support', description: 'Answers to common questions about machine capacity, power requirements, raw materials, and warranty.' },
      { path: 'help', title: 'Help & Support Center', category: 'Support', description: 'User manuals, troubleshooting guides, technical support, and emergency operator assistance.' },
      { path: 'privacy', title: 'Privacy Policy', category: 'Legal', description: 'Learn how Jee Engineers collects, protects, and manages user data and privacy.' },
      { path: 'terms-and-conditions', title: 'Terms & Conditions', category: 'Legal', description: 'Commercial terms and conditions governing machine inquiries and website usage.' },
      { path: 'cookies', title: 'Cookie Policy', category: 'Legal', description: 'Information about how cookies and tracking technologies are used on jeeengineers.com.' },

      // Machinery & Technology Pages
      { path: 'fly-ash-bricks-machine', title: 'Fly Ash Brick Making Machine', category: 'Machinery', description: 'High-density hydraulic compaction fly ash brick making machines for commercial plants.' },
      { path: 'fly-ash-bricks-machine2', title: 'Automatic Fly Ash Brick Machine', category: 'Machinery', description: 'Automatic brick production plant with conveyor feeder, pan mixer, and hydraulic press unit.' },
      { path: 'fly-ash-bricks-machine-3', title: 'Fully Automatic Hydraulic Brick Plant', category: 'Machinery', description: 'Heavy-duty hydraulic fly ash brick plant designed for 10,000+ brick output per day.' },
      { path: 'choosing-brick-making-machine', title: 'How to Choose the Right Brick Making Machine', category: 'Guide', description: 'Comparison guide for semi-automatic vs fully automatic hydraulic fly ash brick machines.' },
      { path: 'hydraulic-vs-vibro-compaction-technology', title: 'Hydraulic vs Vibro Compaction Technology', category: 'Technology', description: 'Technical analysis of hydraulic pressure vs vibro-compaction for brick & block strength.' },
      { path: 'paver-block-technology', title: 'Paver Block & Concrete Block Technology', category: 'Technology', description: 'Advanced machinery for manufacturing interlocking paver blocks, hollow blocks, and solid concrete blocks.' },
      { path: 'custom-mould-options', title: 'Custom Mould Options for Brick Machines', category: 'Accessories', description: 'Precision-engineered hardened steel moulds for standard bricks, paver blocks, and customized hollow blocks.' },
      { path: 'key-machine-components-explained', title: 'Key Components of Brick Making Machinery', category: 'Technical', description: 'Detailed breakdown of hydraulic power pack, pan mixer, feeder, control panel, and mould assembly.' },

      // Business & Plant Setup Guides
      { path: 'how-to-start-fly-ash-brick-business', title: 'How to Start a Fly Ash Brick Business', category: 'Business Guide', description: 'Comprehensive guide covering land requirements, raw material sourcing, capital investment, and ROI.' },
      { path: 'how-to-start-fly-ash-brick-plant', title: 'Step-by-Step Fly Ash Brick Plant Setup', category: 'Business Guide', description: 'Practical plant layout, electrical wiring, water supply, and labor requirements for setting up a brick plant.' },
      { path: 'fly-ash-brick-plant-setup-guide', title: 'Fly Ash Brick Plant Setup & Installation Guide', category: 'Business Guide', description: 'Complete roadmap for setting up a commercial fly ash brick manufacturing facility.' },
      { path: 'cost-of-fly-ash-brick-making-machines', title: 'Cost Evaluation of Fly Ash Brick Machines', category: 'Financial', description: 'Detailed cost breakdown including machine price, operational expenses, power consumption, and profit margins.' },
      { path: 'market-expansion-fly-ash-bricks', title: 'Market Expansion Strategies for Brick Plants', category: 'Business Guide', description: 'B2B builder partnerships, government tenders, regional distribution, and product diversification.' },
      { path: 'government-policies-on-fly-ash-utilization', title: 'Government Policies & Subsidies on Fly Ash Use', category: 'Regulations', description: 'MoEFCC mandates, GST benefits, and subsidies promoting fly ash utilization in construction.' },
      { path: 'case-study-small-business-production', title: 'Case Study: Small Business Brick Production', category: 'Case Study', description: 'Real-world case study of a successful small-scale fly ash brick plant in India.' },

      // Technical & Maintenance Guides
      { path: 'what-is-fly-ash', title: 'What is Fly Ash? Raw Material Guide', category: 'Raw Materials', description: 'Chemical composition, fly ash quality grades, and binder ratios for optimal brick strength.' },
      { path: 'what-is-fly-ash-bricks', title: 'What are Fly Ash Bricks? Overview & Specs', category: 'Guide', description: 'Complete technical overview of fly ash brick properties, compressive strength, and advantages.' },
      { path: 'How-Fly-Ash-Bricks-Are-Made', title: 'How Fly Ash Bricks Are Made: Step-by-Step', category: 'Process', description: 'Raw material mixing, compaction pressing, curing, and quality testing process.' },
      { path: 'fly-ash-bricks-machine-making-principle', title: 'Working Principle of Fly Ash Brick Machines', category: 'Technical', description: 'Hydraulic pressure and vibration mechanism principles explained.' },
      { path: 'material-innovations-enhanced-brick-properties', title: 'Material Innovations for Brick Strength', category: 'Research', description: 'Using lime-fly ash ratios, silica fume, GGBS slag, and polymer additives for higher strength.' },
      { path: 'advantages-of-fly-ash-bricks', title: 'Key Advantages of Fly Ash Bricks', category: 'Guide', description: 'Lower water absorption, uniform shape, eco-friendliness, and thermal insulation benefits.' },
      { path: 'Fly-Ash-Bricks-vs-Red-Bricks', title: 'Fly Ash Bricks vs Red Clay Bricks', category: 'Comparison', description: 'In-depth comparison of strength, cost per brick, environmental impact, and weight.' },
      { path: 'sustainable-construction-with-fly-ash-bricks', title: 'Sustainable Construction Practices', category: 'Sustainability', description: 'How eco-friendly fly ash bricks reduce carbon footprint and qualify for green building points.' },
      { path: 'the-future-of-sustainable-contruction', title: 'The Future of Sustainable Construction', category: 'Sustainability', description: 'Trends in green building materials and sustainable masonry solutions.' },
      { path: 'the-future-of-fly-ash-bricks', title: 'The Future of Fly Ash Bricks in India', category: 'Industry Trends', description: 'Market growth, infrastructure demand, and future prospects of the fly ash brick sector.' },
      { path: 'maintenance-tips-for-brick-making-machines', title: 'Essential Maintenance Tips for Brick Machines', category: 'Maintenance', description: 'Daily lubrication, hydraulic oil checks, sensor calibration, and mould care.' },
      { path: 'troubleshooting-fly-ash-brick-machines', title: 'Troubleshooting Fly Ash Brick Machines', category: 'Troubleshooting', description: 'Fixing brick cracking, low compressive strength, hydraulic cylinder leaks, and feeder jams.' },
      { path: 'troubleshooting-brick-making-machines', title: 'General Machine Troubleshooting Guide', category: 'Troubleshooting', description: 'Diagnosing electrical, mechanical, and hydraulic faults in brick making plants.' },
      { path: 'innovations-in-brick-making-technology', title: 'Innovations in Brick Making Technology', category: 'Innovation', description: 'PLC automation, auto-stacking robots, and smart sensors in modern brick plants.' }
    ];
  }

  // Initialize search functionality
  init() {
    this.initSearchModal();
    this.indexPageContent();
    this.addEventListeners();
    this.injectQuickTags();
  }

  // Initialize search modal UI elements
  initSearchModal() {
    const modalElement = document.getElementById('searchModal');
    if (modalElement) {
      this.searchModal = new bootstrap.Modal(modalElement);
      this.searchInput = document.getElementById('searchInput');
      this.searchResults = document.querySelector('.search-results');
    } else {
      console.warn('Search modal element not found on current page');
    }
  }

  // Inject quick tag pills under search input inside modal
  injectQuickTags() {
    const modalBody = document.querySelector('#searchModal .modal-body');
    if (!modalBody || document.querySelector('.search-quick-tags')) return;

    const quickTagsContainer = document.createElement('div');
    quickTagsContainer.className = 'search-quick-tags';
    quickTagsContainer.innerHTML = `
      <span class="search-tag-pill" data-query="Machine Price">Machine Price</span>
      <span class="search-tag-pill" data-query="Plant Setup">Plant Setup</span>
      <span class="search-tag-pill" data-query="Maintenance">Maintenance</span>
      <span class="search-tag-pill" data-query="Fly Ash Ratio">Fly Ash Ratio</span>
      <span class="search-tag-pill" data-query="Troubleshooting">Troubleshooting</span>
      <span class="search-tag-pill" data-query="Paver Block">Paver Block</span>
    `;

    const inputGroup = modalBody.querySelector('.input-group');
    if (inputGroup) {
      inputGroup.after(quickTagsContainer);
    } else {
      modalBody.prepend(quickTagsContainer);
    }

    // Add click listeners to quick tag pills
    quickTagsContainer.querySelectorAll('.search-tag-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const query = pill.getAttribute('data-query');
        if (this.searchInput) {
          this.searchInput.value = query;
          this.performSearch(query);
          this.searchInput.focus();
        }
      });
    });
  }

  // Index site pages & current page DOM elements
  indexPageContent() {
    this.searchIndex = [];

    // Add pre-defined comprehensive site catalog
    this.sitePages.forEach(page => {
      this.searchIndex.push({
        text: `${page.title} ${page.description} ${page.category}`,
        title: page.title,
        description: page.description,
        category: page.category,
        url: page.path,
        weight: 10
      });
    });

    // Also index headers and key text on current page DOM
    const selectors = [
      { selector: 'h1', weight: 8, cat: 'Page Header' },
      { selector: 'h2', selector: 'h2', weight: 6, cat: 'Section' },
      { selector: 'h3', weight: 5, cat: 'Topic' }
    ];

    selectors.forEach(({ selector, weight, cat }) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        const text = el.textContent.trim();
        if (text && text.length > 3) {
          let url = window.location.pathname.replace(/^\//, '').replace(/\.html$/, '');
          if (!url) url = 'index';

          let linkEl = el.closest('a');
          if (linkEl && linkEl.href) {
            url = new URL(linkEl.href).pathname.replace(/^\//, '').replace(/\.html$/, '');
          }

          this.searchIndex.push({
            text: text,
            title: text,
            description: `Section on current page: ${text}`,
            category: cat,
            url: url,
            weight: weight
          });
        }
      });
    });
  }

  // Add keyboard and click event listeners
  addEventListeners() {
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
          this.performSearch(e.target.value);
        }, 200);
      });

      this.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.performSearch(e.target.value);
        }
      });
    }

    const searchButtons = document.querySelectorAll('[data-bs-target="#searchModal"], #searchModalButton');
    searchButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openSearch();
      });
    });

    // Keyboard shortcut: Ctrl + K or Cmd + K to open search
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.openSearch();
      }
    });
  }

  // Perform search scoring and filtering
  performSearch(query) {
    if (!this.searchResults) return;

    const trimmedQuery = query ? query.trim() : '';

    if (!trimmedQuery || trimmedQuery.length < this.minSearchLength) {
      this.renderDefaultState();
      return;
    }

    const resultsMap = new Map();

    this.searchIndex.forEach(item => {
      const score = this.calculateScore(item.text, trimmedQuery) * item.weight;
      if (score > 0) {
        if (!resultsMap.has(item.url) || resultsMap.get(item.url).score < score) {
          resultsMap.set(item.url, { ...item, score });
        }
      }
    });

    const sortedResults = Array.from(resultsMap.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, this.maxResults);

    this.displayResults(sortedResults, trimmedQuery);
  }

  // Calculate search relevance score
  calculateScore(text, query) {
    const textLower = text.toLowerCase();
    const queryLower = query.toLowerCase();

    if (textLower === queryLower) return 2.0;
    if (textLower.startsWith(queryLower)) return 1.5;
    if (textLower.includes(queryLower)) return 1.0;

    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 1);
    if (queryWords.length === 0) return 0;

    let matchedWords = 0;
    queryWords.forEach(word => {
      if (textLower.includes(word)) matchedWords++;
    });

    return matchedWords > 0 ? (matchedWords / queryWords.length) * 0.8 : 0;
  }

  // Display default popular topics state before typing
  renderDefaultState() {
    this.searchResults.innerHTML = `
      <div class="text-center py-4">
        <p class="text-white-50 small mb-2"><i class="bi bi-search me-2"></i>Type any keyword to search products, guides, cost evaluations, and troubleshooting.</p>
        <div class="search-keyboard-hint">
          <span>Tip: Press <kbd>Ctrl</kbd> + <kbd>K</kbd> anywhere to trigger quick search</span>
        </div>
      </div>
    `;
  }

  // Display formatted search results
  displayResults(results, query) {
    if (results.length === 0) {
      this.searchResults.innerHTML = `
        <div class="text-center text-white py-5">
          <i class="bi bi-exclamation-circle text-info fs-1 d-block mb-3"></i>
          <h5 class="text-white mb-2">No matching topics found for "${query}"</h5>
          <p class="text-white-50 small mb-4">Try searching for "machine cost", "plant setup", "maintenance", or "fly ash ratio".</p>
          <a href="contact" class="btn btn-outline-light rounded-pill btn-sm px-4">Contact Sales Engineering Support</a>
        </div>
      `;
      return;
    }

    const resultsHTML = results.map(item => `
      <div class="search-result-item">
        <a href="${item.url}" class="search-result-card" onclick="if(window.bootstrapSearchModal) window.bootstrapSearchModal.hide();">
          <div class="d-flex align-items-center justify-content-between">
            <span class="search-result-category">${item.category}</span>
            <i class="bi bi-arrow-right-short text-info fs-4"></i>
          </div>
          <div class="search-result-title">${this.highlightText(item.title, query)}</div>
          <div class="search-result-snippet">${this.highlightText(item.description, query)}</div>
          <div class="search-result-url">
            <i class="bi bi-link-45deg"></i> https://jeeengineers.com/${item.url}
          </div>
        </a>
      </div>
    `).join('');

    this.searchResults.innerHTML = resultsHTML;
  }

  // Highlight matching keywords with <mark>
  highlightText(text, query) {
    if (!text) return '';
    if (!query) return text;
    try {
      const words = query.trim().split(/\s+/).filter(w => w.length > 1);
      if (words.length === 0) return text;
      const pattern = new RegExp(`(${words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
      return text.replace(pattern, '<mark>$1</mark>');
    } catch (e) {
      return text;
    }
  }

  // Open search modal programmatically
  openSearch() {
    if (this.searchModal) {
      this.searchModal.show();
      window.bootstrapSearchModal = this.searchModal;
      setTimeout(() => {
        if (this.searchInput) {
          this.searchInput.focus();
          if (!this.searchInput.value) {
            this.renderDefaultState();
          }
        }
      }, 250);
    }
  }
}

// Global initialization when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  try {
    const searchInstance = new StaticSiteSearch();
    searchInstance.init();
    window.jeeSearch = searchInstance;
    console.log("Jee Engineers Live Search system initialized successfully!");
  } catch (err) {
    console.error("Error initializing Jee Engineers search system:", err);
  }
});