// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const customerId = urlParams.get('id');

// DOM Elements
const appContainer = document.querySelector('.app-container');
const loadingIndicator = document.getElementById('loading-indicator');
const errorContainer = document.getElementById('error-container');
const errorMessage = document.getElementById('error-message');

// Page elements
const elements = {
    coupleNames: document.querySelector('.couple-names'),
    togetherDate: document.getElementById('together-date'),
    loveMessage: document.getElementById('love-message-content'),
    memoryContainer: document.getElementById('memory-container'),
    finalNote: document.getElementById('final-note-content'),
    signatureName: document.getElementById('signature-name'),
    pages: document.querySelectorAll('.page'),
    indicators: document.querySelectorAll('.indicator')
};

// Page navigation state
let currentPage = 'page-cover';

// Default data in case of loading/error
const defaultData = {
    theme: {
        primaryColor: '#ff6b6b',
        secondaryColor: '#ff8e8e',
        backgroundColor: '#fff9f9',
        textColor: '#333',
        lightText: '#666'
    },
    couple: {
        name1: 'Your Name',
        name2: "Partner's Name",
        togetherDate: '2020-01-01'
    },
    message: "This is a default message in case the customer data fails to load.",
    memories: [
        {
            date: "January 1, 2020",
            title: "First Date",
            description: "Our very first date together."
        }
    ],
    finalNote: "This is a default final note.",
    signature: "Your Name"
};

// Show loading indicator
function showLoading() {
    loadingIndicator.style.display = 'flex';
    appContainer.style.display = 'none';
    errorContainer.style.display = 'none';
}

// Show error message
function showError(message) {
    loadingIndicator.style.display = 'none';
    appContainer.style.display = 'none';
    errorContainer.style.display = 'flex';
    errorMessage.textContent = message;
}

// Show app content
function showApp() {
    loadingIndicator.style.display = 'none';
    errorContainer.style.display = 'none';
    appContainer.style.display = 'block';
}

// Apply theme colors
function applyTheme(theme) {
    document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
    document.documentElement.style.setProperty('--background-color', theme.backgroundColor);
    document.documentElement.style.setProperty('--text-color', theme.textColor);
    document.documentElement.style.setProperty('--light-text', theme.lightText);
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Update page content
function updateContent(data) {
    const { couple, message, memories, finalNote, signature } = data;
    
    // Update couple names
    elements.coupleNames.textContent = `${couple.name1} & ${couple.name2}`;
    
    // Update together date
    elements.togetherDate.textContent = formatDate(couple.togetherDate).split(' ').slice(0, 3).join(' ');
    
    // Update love message
    elements.loveMessage.innerHTML = message.replace(/\n/g, '<br>');
    
    // Update memories
    elements.memoryContainer.innerHTML = memories.map(memory => `
        <div class="memory-item">
            <div class="memory-date">${memory.date}</div>
            <h3 class="memory-title">${memory.title}</h3>
            <p class="memory-description">${memory.description}</p>
        </div>
    `).join('');
    
    // Update final note and signature
    elements.finalNote.innerHTML = finalNote.replace(/\n/g, '<br>');
    elements.signatureName.textContent = signature;
}

// Initialize page navigation
function initNavigation() {
    // Navigation buttons
    document.querySelectorAll('.nav-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const targetPage = e.currentTarget.getAttribute('data-target');
            navigateToPage(targetPage);
        });
    });
    
    // Indicator clicks
    document.querySelectorAll('.indicator').forEach(indicator => {
        indicator.addEventListener('click', (e) => {
            const targetPage = e.currentTarget.getAttribute('data-target');
            navigateToPage(targetPage);
        });
    });
}

// Navigate to specific page
function navigateToPage(pageId) {
    // Hide current page
    document.getElementById(currentPage).classList.remove('active');
    document.querySelector(`.indicator[data-target="${currentPage}"]`).classList.remove('active');
    
    // Show new page
    document.getElementById(pageId).classList.add('active');
    document.querySelector(`.indicator[data-target="${pageId}"]`).classList.add('active');
    
    // Update current page
    currentPage = pageId;
}

// Load customer data
async function loadCustomerData(id) {
    showLoading();
    
    try {
        // Try to load the customer data
        const response = await fetch(`../customers/${id}/data.json`);
        
        if (!response.ok) {
            throw new Error('Customer not found');
        }
        
        const data = await response.json();
        
        // Apply theme
        applyTheme(data.theme);
        
        // Update content
        updateContent(data);
        
        // Initialize page navigation
        initNavigation();
        
        // Show the app
        showApp();
    } catch (error) {
        console.error('Error loading customer data:', error);
        showError('Error: Could not load customer data. Please check the ID and try again.');
    }
}

// Check for customer ID
if (!customerId) {
    showError('Error: Missing customer ID. Please include a valid ID in the URL (e.g., index.html?id=your-id)');
} else {
    loadCustomerData(customerId);
}