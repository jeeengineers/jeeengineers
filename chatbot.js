document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('chatbot-container');
    const toggle = document.getElementById('chatbot-toggle');
    const header = document.querySelector('.chatbot-header');
    const messagesContainer = document.getElementById('chatbot-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // Track conversation context
    let conversationContext = {
        lastTopic: null,
        askedContactInfo: false,
        greetingShown: false
    };

    // Knowledge base from your website content
    const knowledgeBase = {
        // General information
        "brick making machine": "Jee Engineers provides high-quality brick making machines that are built to last and designed for easy maintenance. Our machines help produce high-quality bricks efficiently.",

        // Maintenance information
        "maintenance": "Regular maintenance is key to ensuring the efficiency, longevity, and reliability of your brick-making machines. Proper maintenance includes: regular cleaning, lubricating moving parts, inspecting hydraulic systems, checking electrical components, monitoring mold condition, tightening bolts and fasteners, calibrating the machine, training operators, scheduling professional servicing, and keeping a maintenance log.",
        "maintenance importance": "Maintenance is important because it: 1) Improves efficiency by ensuring smooth operation and consistent brick quality, 2) Extends the lifespan of your machine by reducing wear and tear, 3) Prevents breakdowns by identifying and fixing issues early, 4) Saves costs by reducing repair expenses and production losses.",

        // Specific maintenance tasks
        "cleaning": "For regular cleaning: 1) Clean the hopper, molds, and conveyor belts after each production cycle, 2) Use compressed air or brushes to remove dust from hard-to-reach areas, 3) Ensure the mixing unit is free from residual material. Regular cleaning prevents dust, debris, and hardened material from clogging the machine and affecting its performance.",
        "lubrication": "For proper lubrication: 1) Identify all moving parts, such as pistons, rollers, and bearings, 2) Use the recommended lubricants as per the manufacturer's guidelines, 3) Lubricate the parts at regular intervals, especially after heavy use. Proper lubrication reduces friction and prevents wear and tear.",
        "hydraulic": "For hydraulic systems maintenance: 1) Check hydraulic oil levels regularly and top up if necessary, 2) Inspect hoses and seals for leaks or damage, 3) Replace hydraulic oil as per the manufacturer's recommended schedule. Hydraulic systems are critical for applying pressure during brick formation.",
        "electrical": "For electrical components maintenance: 1) Inspect wiring, switches, and control panels for signs of wear or damage, 2) Tighten loose connections and replace damaged components, 3) Ensure the machine is properly grounded to prevent electrical shocks. Electrical faults can lead to machine malfunctions or safety hazards.",
        "mold": "For mold maintenance: 1) Regularly inspect molds for cracks, warping, or wear, 2) Clean molds thoroughly after each use to prevent material buildup, 3) Replace molds if they show signs of significant wear. Damaged or worn-out molds can affect brick quality and dimensions.",
        "bolts": "For fastener maintenance: Periodically check and tighten all bolts, nuts, and fasteners. Use a torque wrench to ensure proper tightening without over-tightening. Vibrations during operation can loosen bolts and fasteners, leading to misalignment or damage.",
        "calibration": "For machine calibration: 1) Follow the manufacturer's instructions to calibrate the machine, 2) Check and adjust pressure settings, mold alignment, and mixing ratios as needed. Proper calibration ensures consistent brick size, shape, and density.",

        // Warning signs
        "signs": "Common signs your machine needs maintenance include: 1) Unusual noises or vibrations during operation, 2) Reduced brick quality or inconsistent dimensions, 3) Hydraulic oil leaks or low oil levels, 4) Overheating of the machine or motor, 5) Frequent breakdowns or production delays.",

        // Company information
        "contact": `<div class="contact-info">
          <div class="contact-header">Contact Jee Engineers</div>
          <div class="contact-item">
            <i class="bi bi-telephone-fill"></i>
            <span>Phone: <a href="tel:+919327491268">+91 9327491268</a></span>
          </div>
          <div class="contact-item">
            <i class="bi bi-whatsapp"></i>
            <span>WhatsApp: <a href="https://wa.me/919054520708">+91 9054520708</a></span>
          </div>
          <div class="contact-item">
            <i class="bi bi-envelope-fill"></i>
            <span>Email: <a href="mailto:jeeengineers@gmail.com">jeeengineers@gmail.com</a></span>
          </div>
          <div class="contact-item">
            <i class="bi bi-geo-alt-fill"></i>
            <span>Location: Ahmedabad, Gujarat, India</span>
          </div>
        </div>`,
        "company": "Jee Engineers aims to lead the way in providing innovative and high-quality solutions for the construction sector, empowering clients to achieve their goals efficiently and sustainably.",
        "services": "At Jee Engineers, we provide: 1) High-Quality Machines built to last and designed for easy maintenance, 2) Comprehensive Support including training, servicing, and spare parts, 3) Custom Solutions with machines tailored to your specific production needs.",

        // Fly ash bricks information
        "fly ash": "Fly ash bricks are an eco-friendly alternative to traditional clay bricks. They are made from fly ash, a byproduct of coal combustion, mixed with cement, sand, and water. Our machines are specially designed to produce high-quality fly ash bricks efficiently.",
        "advantages": "Advantages of fly ash bricks include: 1) Eco-friendly as they use industrial waste, 2) Higher strength and durability, 3) Better insulation properties, 4) Uniform size and shape, 5) Cost-effective production.",

        // Products
        "products": "Jee Engineers offers a range of brick making machines and equipment including fly ash brick making machines, pan mixers, conveyor systems, and more. Would you like specific information about any of these products?",
        "price": "The price of our brick making machines depends on the model, capacity, and specific requirements. For detailed pricing information, please contact our sales team at +91 9327491268 or send an email to jeeengineers@gmail.com.",

        // Greetings
        "greeting": "Hello! I'm your Jee Engineers assistant. How can I help you with brick making machines today?"
    };

    // Add this new section to the knowledgeBase object with related blog/page URLs
    const relatedPages = {
        "maintenance": [
            { title: "Maintenance Tips for Brick Making Machines", url: "maintenance-tips-brick-making-machines.html" },
            { title: "Fly Ash Brick Machine Working Principle", url: "fly-ash-brick-machine-working-principle.html" }
        ],
        "fly ash": [
            { title: "What is Fly Ash Bricks", url: "what-is-fly-ash-bricks.html" },
            { title: "How Fly Ash Bricks Are Made", url: "how-fly-ash-bricks-are-made.html" },
            { title: "Fly Ash Bricks vs Red Bricks", url: "Fly-Ash-Bricks-vs-Red-Bricks.html" },
            { title: "Sustainable Construction with Fly Ash Bricks", url: "sustainable-construction-with-fly-ash-bricks.html" }
        ],
        "working principle": [
            { title: "Fly Ash Brick Machine Working Principle", url: "fly-ash-brick-machine-working-principle.html" },
            { title: "How Fly Ash Bricks Are Made", url: "how-fly-ash-bricks-are-made.html" }
        ],
        "sustainable": [
            { title: "Sustainable Construction with Fly Ash Bricks", url: "sustainable-construction-with-fly-ash-bricks.html" },
            { title: "What is Fly Ash Bricks", url: "what-is-fly-ash-bricks.html" }
        ],
        "products": [
            { title: "Products", url: "products.html" },
            { title: "Fly Ash Brick Machine Working Principle", url: "fly-ash-brick-machine-working-principle.html" }
        ],
        "contact": [
            { title: "Contact Us", url: "contact.html" }
        ],
        "about": [
            { title: "About Us", url: "about.html" }
        ]
    };

    // Quick reply suggestions based on context
    const quickReplies = {
        "default": ["Maintenance Tips", "Contact Info", "About Fly Ash Bricks", "Products"],
        "maintenance": ["Hydraulic Systems", "Cleaning Tips", "Warning Signs", "Lubrication"],
        "fly ash": ["Advantages", "How They're Made", "Vs Red Bricks", "Pricing"],
        "products": ["Machine Types", "Pricing", "Customization", "Contact Sales"]
    };

    // Toggle chatbot open/closed
    function toggleChatbot() {
        container.classList.toggle('chatbot-closed');
        container.classList.toggle('chatbot-open');

        // If opening and greeting not shown, show greeting
        if (container.classList.contains('chatbot-open') && !conversationContext.greetingShown) {
            setTimeout(() => {
                appendMessage(knowledgeBase.greeting, 'bot');
                appendQuickReplies(quickReplies.default);
                conversationContext.greetingShown = true;
            }, 300);
        }
    }

    toggle.addEventListener('click', toggleChatbot);
    header.addEventListener('click', function (e) {
        if (e.target !== toggle) {
            toggleChatbot();
        }
    });

    // Process user message
    function processMessage() {
        const userMessage = userInput.value.trim();
        if (userMessage === '') return;

        // Display user message
        appendMessage(userMessage, 'user');
        userInput.value = '';

        // Show typing indicator
        showTypingIndicator();

        // Process and respond with delay to simulate thinking
        setTimeout(() => {
            hideTypingIndicator();
            const response = generateResponse(userMessage);

            // Get related pages based on user message
            const relatedLinks = getRelatedPages(userMessage);

            // Append the main response
            appendMessage(response.message, 'bot');

            // If there are related links, show them after a short delay
            if (relatedLinks.length > 0) {
                setTimeout(() => {
                    const linksHTML = createRelatedLinksHTML(relatedLinks);
                    appendMessage(linksHTML, 'bot');
                }, 800);
            }

            // Add quick replies if applicable
            if (response.topic) {
                const replies = quickReplies[response.topic] || quickReplies.default;
                appendQuickReplies(replies);
                conversationContext.lastTopic = response.topic;
            } else if (quickReplies[conversationContext.lastTopic]) {
                appendQuickReplies(quickReplies[conversationContext.lastTopic]);
            } else {
                appendQuickReplies(quickReplies.default);
            }

            // Suggest contact info if discussing products or services and not already asked
            if ((userMessage.toLowerCase().includes('product') ||
                userMessage.toLowerCase().includes('service') ||
                userMessage.toLowerCase().includes('price') ||
                userMessage.toLowerCase().includes('cost')) &&
                !conversationContext.askedContactInfo) {
                setTimeout(() => {
                    appendMessage("Would you like our contact information to learn more?", 'bot');
                    appendQuickReplies(["Yes, please", "No, thanks"]);
                    conversationContext.askedContactInfo = true;
                }, 1000);
            }
        }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
    }

    // Show typing indicator
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('typing-indicator');
        typingIndicator.id = 'typing-indicator';
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        messagesContainer.appendChild(typingIndicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Generate response based on knowledge base
    function generateResponse(message) {
        message = message.toLowerCase();
        let response = {
            message: "",
            topic: null
        };

        // Check for greetings
        if (message.match(/^(hi|hello|hey|greetings|howdy)/i)) {
            response.message = "Hello! How can I help you with brick making machines today?";
            return response;
        }

        // Check for thank you
        if (message.match(/thank you|thanks|thank/i)) {
            response.message = "You're welcome! Is there anything else I can help you with?";
            return response;
        }

        // Check for yes/no to contact info question
        if (conversationContext.askedContactInfo) {
            if (message.match(/^(yes|yeah|yep|sure|ok|okay)/i)) {
                response.message = knowledgeBase.contact;
                conversationContext.askedContactInfo = false;
                return response;
            } else if (message.match(/^(no|nope|nah)/i)) {
                response.message = "No problem! Let me know if you have any other questions.";
                conversationContext.askedContactInfo = false;
                return response;
            }
        }

        // Check for matches in knowledge base
        for (const [key, value] of Object.entries(knowledgeBase)) {
            if (message.includes(key)) {
                response.message = value;

                // Set topic for quick replies
                if (key === "maintenance" || message.includes("maintain")) {
                    response.topic = "maintenance";
                } else if (key === "fly ash" || message.includes("fly ash")) {
                    response.topic = "fly ash";
                } else if (key === "products" || message.includes("product") || message.includes("machine")) {
                    response.topic = "products";
                }

                return response;
            }
        }

        // Check for general categories
        if (message.includes('clean') || message.includes('dust') || message.includes('debris')) {
            response.message = knowledgeBase.cleaning;
            response.topic = "maintenance";
            return response;
        }

        if (message.includes('oil') || message.includes('pressure') || message.includes('fluid') || message.includes('hydraulic')) {
            response.message = knowledgeBase.hydraulic;
            response.topic = "maintenance";
            return response;
        }

        if (message.includes('wire') || message.includes('power') || message.includes('switch') || message.includes('electric')) {
            response.message = knowledgeBase.electrical;
            response.topic = "maintenance";
            return response;
        }

        if (message.includes('problem') || message.includes('issue') || message.includes('not working') || message.includes('broken')) {
            response.message = knowledgeBase.signs;
            response.topic = "maintenance";
            return response;
        }

        if (message.includes('about') || message.includes('who')) {
            response.message = knowledgeBase.company;
            return response;
        }

        if (message.includes('phone') || message.includes('email') || message.includes('reach') || message.includes('call') || message.includes('contact')) {
            response.message = knowledgeBase.contact;
            return response;
        }

        // Default response if no match
        response.message = "I can help you with information about brick making machines, maintenance tips, warning signs, or contact information for Jee Engineers. Could you please specify what you'd like to know about?";
        return response;
    }

    // Append message to chat
    function appendMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message');

        // Check if the message is HTML content
        if (message.startsWith('<div') || message.startsWith('<p') || message.startsWith('<span')) {
            messageElement.innerHTML = message;
        } else {
            messageElement.textContent = message;
        }

        // Add timestamp (optional)
        const now = new Date();
        const timeString = now.getHours().toString().padStart(2, '0') + ':' +
            now.getMinutes().toString().padStart(2, '0');

        // Only add timestamp for non-HTML messages
        if (!message.startsWith('<div') && !message.startsWith('<p') && !message.startsWith('<span')) {
            const timeElement = document.createElement('span');
            timeElement.classList.add('message-time');
            timeElement.textContent = timeString;
            messageElement.appendChild(timeElement);
        }

        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Append quick reply buttons
    function appendQuickReplies(replies) {
        // Remove any existing quick replies
        const existingReplies = document.querySelector('.quick-replies');
        if (existingReplies) {
            existingReplies.remove();
        }

        const repliesContainer = document.createElement('div');
        repliesContainer.classList.add('quick-replies');

        replies.forEach(reply => {
            const button = document.createElement('button');
            button.classList.add('quick-reply-btn');
            button.textContent = reply;
            button.addEventListener('click', function () {
                userInput.value = reply;
                processMessage();
            });
            repliesContainer.appendChild(button);
        });

        messagesContainer.appendChild(repliesContainer);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Event listeners
    sendButton.addEventListener('click', processMessage);
    userInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            processMessage();
        }
    });

    // Initialize as closed
    container.classList.add('chatbot-closed');

    // Add this function to suggest related pages
    function getRelatedPages(userMessage) {
        const message = userMessage.toLowerCase();
        let relatedLinks = [];

        // Check each keyword for matches
        for (const [keyword, pages] of Object.entries(relatedPages)) {
            if (message.includes(keyword)) {
                // Add pages related to this keyword (avoid duplicates)
                pages.forEach(page => {
                    if (!relatedLinks.some(link => link.url === page.url)) {
                        relatedLinks.push(page);
                    }
                });
            }
        }

        // Limit to 3 most relevant links
        return relatedLinks.slice(0, 3);
    }

    // Updated function to create HTML for related links
    function createRelatedLinksHTML(links) {
        if (links.length === 0) return '';

        let html = '<div class="related-links">';
        html += '<div class="related-links-header">Related Pages</div>';
        html += '<ul>';

        links.forEach(link => {
            html += `<li><a href="${link.url}" target="_blank">${link.title}</a></li>`;
        });

        html += '</ul></div>';
        return html;
    }
}); 