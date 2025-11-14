# gearsarchive.github.io

A file explorer web application for browsing the Gears of War archive located at `/root/archive`.

## Features

- **File System Explorer**: Browse files and folders from `/root/archive` directory
- **Nested Navigation**: Support for subdirectories with breadcrumb navigation
- **File Type Detection**: Automatic categorization of files by extension (images, videos, documents, maps, mods, soundtracks)
- **Search**: Filter files by name
- **Category Filter**: Filter files by type category
- **Responsive Design**: Works on desktop and mobile devices

## Requirements

- Node.js (v12 or higher)
- Access to `/root/archive` directory (may require sudo)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Contestant0star/gearsarchive.github.io.git
cd gearsarchive.github.io
```

2. Install dependencies:
```bash
npm install
```

3. Ensure the `/root/archive` directory exists and contains files:
```bash
sudo mkdir -p /root/archive
# Add your files to /root/archive
```

## Running the Application

Start the server (requires sudo to access `/root/archive`):

```bash
sudo npm start
```

Or:

```bash
sudo node server.js
```

The application will be available at: `http://localhost:3000`

## Usage

1. **Browse Folders**: Click on any folder to navigate into it
2. **Breadcrumb Navigation**: Click on any path segment in the breadcrumb to navigate back
3. **View Files**: Click on files to see their details
4. **Search**: Use the search box to filter files by name
5. **Filter by Category**: Use the dropdown to show only specific file types

## Project Structure

- `index.html` - Main HTML page
- `script.js` - Frontend JavaScript for UI and navigation
- `styles.css` - Styling for the application
- `server.js` - Node.js/Express backend server for file system access
- `package.json` - Project dependencies and scripts

## API Endpoints

- `GET /api/files?path=<path>` - Returns files and folders for the specified path
  - Returns: `{ items: [], currentPath: string, success: boolean }`

## File Categories

Files are automatically categorized based on their extension:
- **Images**: .jpg, .jpeg, .png, .gif, .bmp, .svg, .webp, .ico
- **Videos**: .mp4, .avi, .mkv, .mov, .wmv, .flv, .webm
- **Documents**: .pdf, .doc, .docx, .txt, .rtf, .odt
- **Soundtracks**: .mp3, .wav, .flac, .aac, .ogg, .m4a
- **Maps**: .map, .bsp
- **Mods**: .mod, .dll, .exe, .zip, .rar, .7z, .tar, .gz

## Security

The server includes path validation to prevent directory traversal attacks and ensures all file access is restricted to the `/root/archive` directory.

## License

This project is open source and available for the Gears of War community.
