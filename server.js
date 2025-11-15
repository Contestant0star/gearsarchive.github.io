const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ARCHIVE_ROOT = process.env.ARCHIVE_ROOT || path.join(__dirname, 'archive');

// Enable CORS for frontend
app.use(cors());

// Rate limiter for API endpoints
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

// Rate limiter for static files (more permissive)
const staticLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 300, // Limit each IP to 300 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

// Serve only specific static files, not the entire directory
app.get('/', staticLimiter, (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index.html', staticLimiter, (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/script.js', staticLimiter, (req, res) => {
    res.sendFile(path.join(__dirname, 'script.js'));
});

app.get('/styles.css', staticLimiter, (req, res) => {
    res.sendFile(path.join(__dirname, 'styles.css'));
});

// Helper function to get file size
function getFileSize(filePath) {
    try {
        const stats = fs.statSync(filePath);
        const bytes = stats.size;
        
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    } catch (error) {
        return 'Unknown';
    }
}

// Helper function to get file category based on extension
function getFileCategory(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    
    const categories = {
        images: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp', '.ico'],
        videos: ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm'],
        documents: ['.pdf', '.doc', '.docx', '.txt', '.rtf', '.odt'],
        soundtracks: ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'],
        mods: ['.mod', '.dll', '.exe'],
        maps: ['.map', '.bsp']
    };
    
    for (const [category, extensions] of Object.entries(categories)) {
        if (extensions.includes(ext)) {
            return category;
        }
    }
    
    // Check for archives
    if (['.zip', '.rar', '.7z', '.tar', '.gz'].includes(ext)) {
        return 'mods'; // Treat archives as mods for now
    }
    
    return 'documents'; // Default category
}

// API endpoint to list files and directories (with rate limiting)
app.get('/api/files', apiLimiter, (req, res) => {
    const requestedPath = req.query.path || '';
    const fullPath = path.join(ARCHIVE_ROOT, requestedPath);
    
    // Security check: ensure we're not accessing outside the archive root
    const resolvedPath = path.resolve(fullPath);
    const resolvedRoot = path.resolve(ARCHIVE_ROOT);
    
    if (!resolvedPath.startsWith(resolvedRoot)) {
        return res.status(403).json({ error: 'Access denied' });
    }
    
    // Check if archive directory exists
    if (!fs.existsSync(ARCHIVE_ROOT)) {
        return res.status(404).json({ 
            error: 'Archive directory not found',
            path: ARCHIVE_ROOT,
            items: [],
            currentPath: requestedPath
        });
    }
    
    // Check if requested path exists
    if (!fs.existsSync(fullPath)) {
        return res.status(404).json({ 
            error: 'Path not found',
            items: [],
            currentPath: requestedPath
        });
    }
    
    try {
        const items = [];
        const entries = fs.readdirSync(fullPath, { withFileTypes: true });
        
        for (const entry of entries) {
            const itemPath = path.join(fullPath, entry.name);
            const relativePath = path.join(requestedPath, entry.name);
            
            if (entry.isDirectory()) {
                items.push({
                    name: entry.name,
                    type: 'folder',
                    category: 'folder',
                    path: relativePath,
                    size: '-',
                    date: fs.statSync(itemPath).mtime.toISOString().split('T')[0]
                });
            } else if (entry.isFile()) {
                const category = getFileCategory(entry.name);
                const fileType = path.extname(entry.name).substring(1).toUpperCase() || 'FILE';
                
                items.push({
                    name: entry.name,
                    type: 'file',
                    category: category,
                    fileType: fileType,
                    path: relativePath,
                    size: getFileSize(itemPath),
                    date: fs.statSync(itemPath).mtime.toISOString().split('T')[0]
                });
            }
        }
        
        // Sort: folders first, then files, both alphabetically
        items.sort((a, b) => {
            if (a.type !== b.type) {
                return a.type === 'folder' ? -1 : 1;
            }
            return a.name.localeCompare(b.name);
        });
        
        res.json({
            items: items,
            currentPath: requestedPath,
            success: true
        });
        
    } catch (error) {
        res.status(500).json({ 
            error: 'Error reading directory',
            message: error.message,
            items: [],
            currentPath: requestedPath
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Archive root: ${ARCHIVE_ROOT}`);
    
    // Check if archive directory exists
    if (!fs.existsSync(ARCHIVE_ROOT)) {
        console.warn(`Warning: Archive directory "${ARCHIVE_ROOT}" does not exist!`);
        console.warn('Please create it or update ARCHIVE_ROOT in server.js');
    }
});
