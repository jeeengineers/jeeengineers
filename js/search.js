// Search functionality for static HTML site
class StaticSiteSearch {
    constructor() {
        this.searchIndex = [];
        this.searchModal = null;
        this.searchInput = null;
        this.searchResults = null;
        this.searchTimeout = null;
        this.minSearchLength = 2;
        this.maxResults = 10;
        this.searchableContent = [
            { selector: 'h1', weight: 10 },
            { selector: 'h2', weight: 8 },
            { selector: 'h3', weight: 6 },
            { selector: 'h4', weight: 4 },
            { selector: 'p', weight: 2 },
            { selector: 'a', weight: 3 }
        ];
    }

    // Initialize the search functionality
    init() {
        // Initialize search modal
        this.initSearchModal();

        // Index the current page content
        this.indexPageContent();

        // Add event listeners
        this.addEventListeners();
    }

    // Initialize search modal
    initSearchModal() {
        const modalElement = document.getElementById('searchModal');

        if (modalElement) {
            this.searchModal = new bootstrap.Modal(modalElement);
            this.searchInput = document.getElementById('searchInput');
            this.searchResults = document.querySelector('.search-results');
        } else {
            console.error('Search modal element not found');
        }
    }

    // Index the current page content
    indexPageContent() {
        this.searchIndex = [];

        // Define page titles and URLs for important pages
        const pages = [
            { path: 'index.html', title: 'Home' },
            { path: 'about.html', title: 'About Us' },
            { path: 'products.html', title: 'Our Products' },
            { path: 'blog.html', title: 'Blog' },
            { path: 'contact.html', title: 'Contact Us' },
            { path: 'faq.html', title: 'FAQ' },
            { path: 'cookies.html', title: 'Cookies' },
            { path: 'help.html', title: 'Help' },
            { path: 'privacy.html', title: 'Privacy Policy' },
            { path: 'terms-and-conditions.html', title: 'Terms & Conditions' },

            // Blog posts
            { path: 'the-future-of-sustainable-contruction.html', title: 'The Future of Sustainable Construction: How Fly Ash Bricks Are Leading the Way' },
            { path: 'Fly-Ash-Bricks-vs-Red-Bricks.html', title: 'Fly Ash Bricks vs Red Bricks: A Comprehensive Comparison' },
            { path: 'cost-of-fly-ash-brick-making-machines.html', title: 'Understanding the Cost of Fly Ash Brick Making Machines' },
            { path: 'maintenance-tips-for-brick-making-machines.html', title: 'Essential Maintenance Tips for Brick Making Machines' },
            { path: 'fly-ash-bricks-machine-making-principle.html', title: 'Understanding the Making Principle of Fly Ash Bricks Machines' },
            { path: 'advantages-of-fly-ash-bricks.html', title: 'Key Advantages of Using Fly Ash Bricks in Construction' },
            { path: 'How-Fly-Ash-Bricks-Are-Made.html', title: 'How Fly Ash Bricks Are Made: A Step-by-Step Guide' },
            { path: 'what-is-fly-ash.html', title: 'What is Fly Ash? Understanding the Raw Material' },
            { path: 'sustainable-construction-with-fly-ash-bricks.html', title: 'Sustainable Construction with Fly Ash Bricks' },
            { path: 'what-is-fly-ash-bricks.html', title: 'What is Fly Ash Bricks? A Complete Overview' },

            // Additional blog posts from directory listing
            { path: 'fly-ash-bricks-machine-making-process.html', title: 'Fly Ash Bricks Machine Making Process' },
            { path: 'fly-ash-bricks-machine.html', title: 'Fly Ash Bricks Machine' },
            { path: 'fly-ash-bricks-machine2.html', title: 'Fly Ash Bricks Machine - Version 2' },
            { path: 'fly-ash-bricks-machine-3.html', title: 'Fly Ash Bricks Machine - Version 3' },

            // Add more pages as needed
        ];

        // First, index the current page content
        this.searchableContent.forEach(({ selector, weight }) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                const text = element.textContent.trim();

                if (text && text.length > 0) {
                    // Find nearest link if the element is not itself a link
                    let url = window.location.pathname;
                    let linkElement = element.closest('a');

                    if (linkElement && linkElement.href) {
                        url = new URL(linkElement.href).pathname;
                    }

                    this.searchIndex.push({
                        text,
                        element,
                        weight,
                        url: url
                    });
                }
            });
        });

        // Add explicit entries for known pages to ensure they show up in search
        pages.forEach(page => {
            this.searchIndex.push({
                text: page.title,
                element: null,
                weight: 10,
                url: page.path
            });
        });
    }

    // Add event listeners
    addEventListeners() {
        if (!this.searchInput) {
            console.error('Search input not found. Cannot add event listeners.');
            return;
        }

        // Search input event
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 300);
        });

        // Enter key in search input
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch(e.target.value);
            }
        });

        // Search button inside modal
        const searchButton = document.querySelector('#searchModal .btn-light');
        if (searchButton) {
            searchButton.addEventListener('click', () => {
                this.performSearch(this.searchInput.value);
            });
        }
    }

    // Perform the search
    performSearch(query) {
        if (!query || query.length < this.minSearchLength) {
            this.searchResults.innerHTML = '';
            return;
        }

        const results = this.searchIndex
            .map(item => {
                const score = this.calculateScore(item.text, query) * item.weight;
                return { ...item, score };
            })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, this.maxResults);

        this.displayResults(results, query);
    }

    // Calculate search score
    calculateScore(text, query) {
        const textLower = text.toLowerCase();
        const queryLower = query.toLowerCase();

        // Exact match
        if (textLower === queryLower) return 1;

        // Starts with
        if (textLower.startsWith(queryLower)) return 0.8;

        // Contains
        if (textLower.includes(queryLower)) return 0.6;

        // Word match
        const queryWords = queryLower.split(' ');
        const textWords = textLower.split(' ');
        const wordMatchCount = queryWords.filter(word =>
            textWords.some(textWord => textWord.includes(word))
        ).length;

        return wordMatchCount / queryWords.length;
    }

    // Display search results
    displayResults(results, query) {
        if (!this.searchResults) {
            console.error('Search results container not found. Cannot display results.');
            return;
        }

        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="text-center text-white">
                    <p>No results found for "${query}"</p>
                </div>
            `;
            return;
        }

        const resultsHTML = results.map(result => `
            <div class="search-result-item mb-3">
                <a href="${result.url}" class="text-decoration-none text-white" onclick="document.getElementById('searchModal').querySelector('.btn-close').click();">
                    <div class="p-3 bg-white bg-opacity-10 rounded">
                        <h5 class="mb-2">${this.highlightText(result.text, query)}</h5>
                        <small class="text-white-50">${result.url}</small>
                    </div>
                </a>
            </div>
        `).join('');

        this.searchResults.innerHTML = resultsHTML;

        // Add click event handlers to all result links
        document.querySelectorAll('.search-result-item a').forEach(link => {
            link.addEventListener('click', (e) => {
                // Don't prevent default, let the link work normally
                // But close the modal before navigating
                if (this.searchModal) {
                    this.searchModal.hide();
                }
            });
        });
    }

    // Highlight matching text
    highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // Open search modal
    openSearch() {
        if (!this.searchModal) {
            console.error('Search modal not found. Cannot open search.');
            return;
        }

        this.searchModal.show();

        if (this.searchInput) {
            this.searchInput.focus();
        }
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        const search = new StaticSiteSearch();
        search.init();

        // Add click event to search button
        const searchButton = document.querySelector('[data-bs-target="#searchModal"]');
        if (searchButton) {
            searchButton.addEventListener('click', (e) => {
                e.preventDefault();
                search.openSearch();
            });
        } else {
            console.warn('Search button not found. Search can still be triggered programmatically.');
        }

        // Debug function to check if search is working
        window.testSearch = function (query) {
            search.openSearch();
            if (search.searchInput) {
                search.searchInput.value = query;
                search.performSearch(query);
            }
        };

        console.log("Search functionality initialized successfully!");
    } catch (error) {
        console.error('Error initializing search:', error);
    }
}); 