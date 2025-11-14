// Sample archive data - In a real application, this would come from a database or API
const archiveData = [
    {
        id: 1,
        name: "Gears of War 1 Concept Art",
        category: "images",
        description: "Original concept art from the first Gears of War game, featuring character designs and environment sketches.",
        fileType: "ZIP",
        size: "45 MB",
        date: "2024-01-15"
    },
    {
        id: 2,
        name: "Gears 5 Strategy Guide",
        category: "documents",
        description: "Complete strategy guide for Gears 5 campaign, including all collectibles and achievement walkthroughs.",
        fileType: "PDF",
        size: "12 MB",
        date: "2024-02-20"
    },
    {
        id: 3,
        name: "Gears of War E3 2006 Trailer",
        category: "videos",
        description: "Historic E3 2006 gameplay reveal trailer that introduced the world to Gears of War.",
        fileType: "MP4",
        size: "250 MB",
        date: "2024-01-10"
    },
    {
        id: 4,
        name: "Gridlock Multiplayer Map",
        category: "maps",
        description: "Detailed breakdown and history of the iconic Gridlock multiplayer map across all Gears games.",
        fileType: "PDF",
        size: "8 MB",
        date: "2024-03-05"
    },
    {
        id: 5,
        name: "Custom Character Skins Pack",
        category: "mods",
        description: "Community-created character skin modifications for Gears of War PC versions.",
        fileType: "ZIP",
        size: "120 MB",
        date: "2024-02-28"
    },
    {
        id: 6,
        name: "Gears of War Original Soundtrack",
        category: "soundtracks",
        description: "Original game soundtrack composed by Kevin Riepl, featuring the iconic Mad World cover.",
        fileType: "MP3",
        size: "85 MB",
        date: "2024-01-25"
    },
    {
        id: 7,
        name: "Marcus Fenix Character Renders",
        category: "images",
        description: "High-resolution 3D renders of Marcus Fenix from various Gears of War titles.",
        fileType: "PNG",
        size: "30 MB",
        date: "2024-03-10"
    },
    {
        id: 8,
        name: "Gears Tactics Complete Guide",
        category: "documents",
        description: "Comprehensive guide for Gears Tactics, covering all missions, units, and tactical strategies.",
        fileType: "PDF",
        size: "15 MB",
        date: "2024-02-15"
    },
    {
        id: 9,
        name: "Gears 4 Campaign Playthrough",
        category: "videos",
        description: "Full campaign playthrough of Gears of War 4 with developer commentary.",
        fileType: "MP4",
        size: "1.2 GB",
        date: "2024-01-30"
    },
    {
        id: 10,
        name: "Canals Map Pack Documentation",
        category: "maps",
        description: "Design documents and behind-the-scenes info on the Canals map from Gears of War 2.",
        fileType: "PDF",
        size: "10 MB",
        date: "2024-03-01"
    },
    {
        id: 11,
        name: "Enhanced Graphics Mod",
        category: "mods",
        description: "Graphics enhancement modification for Gears of War Ultimate Edition on PC.",
        fileType: "ZIP",
        size: "200 MB",
        date: "2024-02-10"
    },
    {
        id: 12,
        name: "Gears 5 Official Score",
        category: "soundtracks",
        description: "Complete musical score from Gears 5 by Ramin Djawadi.",
        fileType: "FLAC",
        size: "150 MB",
        date: "2024-02-05"
    }
];

// State management
let currentFilter = 'all';
let currentSearch = '';
let filteredData = [...archiveData];

// DOM elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const categoryFilter = document.getElementById('categoryFilter');
const archiveGrid = document.getElementById('archiveGrid');
const noResults = document.getElementById('noResults');
const totalFilesEl = document.getElementById('totalFiles');
const filteredFilesEl = document.getElementById('filteredFiles');

// Initialize the page
function init() {
    updateStats();
    renderArchive(archiveData);
    attachEventListeners();
}

// Attach event listeners
function attachEventListeners() {
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
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
            item.description.toLowerCase().includes(currentSearch) ||
            item.category.toLowerCase().includes(currentSearch);
        
        return categoryMatch && searchMatch;
    });
    
    renderArchive(filteredData);
    updateFilteredCount();
}

// Render archive items
function renderArchive(data) {
    if (data.length === 0) {
        archiveGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    archiveGrid.style.display = 'grid';
    noResults.style.display = 'none';
    
    archiveGrid.innerHTML = data.map(item => `
        <div class="archive-item" data-id="${item.id}">
            <span class="category-badge category-${item.category}">${item.category}</span>
            <h3>${item.name}</h3>
            <div class="file-info">
                <strong>${item.fileType}</strong> • ${item.size} • ${item.date}
            </div>
            <p class="description">${item.description}</p>
        </div>
    `).join('');
    
    // Add click handlers to archive items
    document.querySelectorAll('.archive-item').forEach(item => {
        item.addEventListener('click', () => {
            const itemId = item.getAttribute('data-id');
            handleItemClick(itemId);
        });
    });
}

// Handle item click
function handleItemClick(itemId) {
    const item = archiveData.find(i => i.id == itemId);
    if (item) {
        alert(`File: ${item.name}\n\nCategory: ${item.category}\nType: ${item.fileType}\nSize: ${item.size}\n\nDescription: ${item.description}\n\n(In a real implementation, this would download or display the file)`);
    }
}

// Update statistics
function updateStats() {
    totalFilesEl.textContent = archiveData.length;
    updateFilteredCount();
}

// Update filtered count
function updateFilteredCount() {
    filteredFilesEl.textContent = filteredData.length;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
