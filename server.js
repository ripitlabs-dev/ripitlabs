const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.webp': 'image/webp',
  '.txt':  'text/plain',
  '.xml':  'application/xml; charset=utf-8',
  '.pdf':  'application/pdf',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

http.createServer((req, res) => {
  // 2026-10-16: ignore ?query (asset cache-busting like ?v=1) and keep lookups inside this folder
  let urlPath = (req.url || '/').split('?')[0].split('#')[0];
  try { urlPath = decodeURIComponent(urlPath); } catch (e) {}
  const ext = path.extname(urlPath).toLowerCase();
  const filePath = path.join(__dirname, urlPath === '/' ? 'index.html' : urlPath);
  const inside = filePath.startsWith(__dirname + path.sep);

  if (ext && MIME[ext] && inside && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.writeHead(200, {'Content-Type': MIME[ext]});
    fs.createReadStream(filePath).pipe(res);
  } else {
    const html = fs.readFileSync(path.join(__dirname, 'index.html'));
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(html);
  }
}).listen(process.env.PORT || 8080, '0.0.0.0', () => console.log('ripitlabs serving on ' + (process.env.PORT || 8080)));
