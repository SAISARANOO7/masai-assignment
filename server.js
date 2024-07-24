const http = require('http');
const fs = require('fs');
const path = require('path');

// Icons for directories and files
const icons = {
  folder: '📁',
  file: '📄'
};

// Generate HTML content for directory listing
function generateDirectoryListing(dirPath, relativeUrl) {
  const files = fs.readdirSync(dirPath);
  let html = '<html><head><title>Directory Listing</title></head><body>';
  html += `<h1>Directory listing for ${relativeUrl}</h1>`;
  html += '<ul>';

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const isDirectory = fs.statSync(fullPath).isDirectory();
    const icon = isDirectory ? icons.folder : icons.file;
    const href = path.join(relativeUrl, file);

    html += `<li>${icon} <a href="${href}">${file}</a></li>`;
  });

  html += '</ul></body></html>';
  return html;
}

// Create an HTTP server
const server = http.createServer((req, res) => {
  const relativeUrl = decodeURIComponent(req.url);
  const localPath = path.join(__dirname, relativeUrl);

  if (fs.existsSync(localPath)) {
    const stats = fs.statSync(localPath);

    if (stats.isDirectory()) {
      const html = generateDirectoryListing(localPath, relativeUrl);
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(html);
    } else if (stats.isFile()) {
      const fileStream = fs.createReadStream(localPath);
      res.writeHead(200, {'Content-Type': 'application/octet-stream'});
      fileStream.pipe(res);
    }
  } else {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end('<h1>404 Not Found</h1>');
  }
});

// Start the server on port 3000
const port = 3000;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
