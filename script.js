// API configuration
const API_BASE = window.location.origin;

// State for file system navigation
let archiveData = [];
let currentPath = '';

// File type icons
const fileIcons = {
    images: '🖼️',
    videos: '🎬',
    documents: '📄',
    maps: '🗺️',
    mods: '⚙️',
    soundtracks: '🎵',
    folder: '📁'
};

// State management
let currentFilter = 'all';
let currentSearch = '';
let filteredData = [...archiveData];

// DOM elements
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const fileGrid = document.getElementById('fileGrid');
const noResults = document.getElementById('noResults');
const fileCountEl = document.getElementById('fileCount');

// Fetch files from API
async function fetchFiles(path = '') {
    try {
        const response = await fetch(`${API_BASE}/api/files?path=${encodeURIComponent(path)}`);
        const data = await response.json();
        
        if (data.success) {
            archiveData = data.items;
            currentPath = data.currentPath;
            applyFilters();
            updateBreadcrumbs();
        } else {
            console.error('Error fetching files:', data.error);
            archiveData = [];
            renderFiles([]);
            updateFileCount();
        }
    } catch (error) {
        console.error('Error fetching files:', error);
        archiveData = [];
        renderFiles([]);
        updateFileCount();
    }
}

// Update breadcrumb navigation
function updateBreadcrumbs() {
    const pathParts = currentPath ? currentPath.split('/').filter(p => p) : [];
    const breadcrumbContainer = document.getElementById('breadcrumb');
    
    if (!breadcrumbContainer) return;
    
    let breadcrumbHTML = '<span class="breadcrumb-item" data-path="">🏠 Archive</span>';
    
    let accumulatedPath = '';
    for (const part of pathParts) {
        accumulatedPath += (accumulatedPath ? '/' : '') + part;
        breadcrumbHTML += ` <span class="breadcrumb-separator">›</span> <span class="breadcrumb-item" data-path="${accumulatedPath}">${part}</span>`;
    }
    
    breadcrumbContainer.innerHTML = breadcrumbHTML;
    
    // Add click handlers to breadcrumb items
    document.querySelectorAll('.breadcrumb-item').forEach(item => {
        item.addEventListener('click', () => {
            const path = item.getAttribute('data-path');
            navigateToPath(path);
        });
    });
}

// Navigate to a path
function navigateToPath(path) {
    fetchFiles(path);
}

// Initialize the page
function init() {
    attachEventListeners();
    fetchFiles(); // Fetch files from API
}

// Attach event listeners
function attachEventListeners() {
    searchInput.addEventListener('input', handleSearch);
    categoryFilter.addEventListener('change', handleCategoryFilter);
}

// Handle search
function handleSearch() {
    currentSearch = searchInput.value.toLowerCase().trim();
    applyFilters();
}

// Handle category filter
function handleCategoryFilter() {
    currentFilter = categoryFilter.value;
    applyFilters();
}

// Apply all filters
function applyFilters() {
    filteredData = archiveData.filter(item => {
        // Category filter
        const categoryMatch = currentFilter === 'all' || item.category === currentFilter;
        
        // Search filter
        const searchMatch = currentSearch === '' || 
            item.name.toLowerCase().includes(currentSearch) ||
            item.description.toLowerCase().includes(currentSearch);
        
        return categoryMatch && searchMatch;
    });
    
    renderFiles(filteredData);
    updateFileCount();
}

// Get thumbnail class and check if file has preview
function getFileClasses(category) {
    const hasPreview = category === 'images' || category === 'videos';
    return {
        thumbnailClass: `file-thumbnail type-${category}${hasPreview ? ' has-preview' : ''}`,
        hasPreview
    };
}

// Render files
function renderFiles(data) {
    if (data.length === 0) {
        fileGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    fileGrid.style.display = 'grid';
    noResults.style.display = 'none';
    
    fileGrid.innerHTML = data.map(item => {
        const { thumbnailClass } = getFileClasses(item.category);
        const icon = fileIcons[item.category] || '📁';
        
        return `
            <div class="file-item" data-type="${item.type}" data-path="${item.path}">
                <div class="${thumbnailClass}">
                    <div class="file-icon">${icon}</div>
                </div>
                <div class="file-name">${item.name}</div>
                <div class="file-info">${item.fileType || item.type} • ${item.size}</div>
            </div>
        `;
    }).join('');
    
    // Add click handlers to file items
    document.querySelectorAll('.file-item').forEach(item => {
        item.addEventListener('click', () => {
            const itemType = item.getAttribute('data-type');
            const itemPath = item.getAttribute('data-path');
            handleItemClick(itemType, itemPath);
        });
    });
}

// Handle item click (file or folder)
function handleItemClick(itemType, itemPath) {
    if (itemType === 'folder') {
        // Navigate into the folder
        navigateToPath(itemPath);
    } else {
        // Handle file click - show info
        const item = archiveData.find(i => i.path === itemPath);
        if (item) {
            alert(`${item.name}\n\nType: ${item.fileType || 'File'}\nSize: ${item.size}\nDate: ${item.date}\nPath: ${item.path}\n\n(In a real implementation, this would open or download the file)`);
        }
    }
}

// Update file count
function updateFileCount() {
    const count = filteredData.length;
    fileCountEl.textContent = `${count} item${count !== 1 ? 's' : ''}`;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
