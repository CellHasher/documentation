/**
 * serve.js
 *
 * Minimal, dependency-free static file server for the built _book/ directory.
 * Run via `npm run serve` (after HonKit build + analytics injection).
 *
 * Usage:
 *   npm run serve                          # no analytics
 *   GTAG=G-XXXXXXXXXX npm run serve        # Linux / macOS
 *   set GTAG=G-XXXXXXXXXX && npm run serve # Windows CMD
 *   $env:GTAG="G-XXXXXXXXXX"; npm run serve# Windows PowerShell
 */

'use strict';

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT || '4000', 10);
const ROOT = path.join(__dirname, '..', '_book');

if (!fs.existsSync(ROOT)) {
  console.error('[serve] ERROR: _book/ not found. Run "npm run build" first.');
  process.exit(1);
}

const MIME_TYPES = {
  '.html' : 'text/html; charset=utf-8',
  '.css'  : 'text/css; charset=utf-8',
  '.js'   : 'application/javascript; charset=utf-8',
  '.json' : 'application/json; charset=utf-8',
  '.png'  : 'image/png',
  '.jpg'  : 'image/jpeg',
  '.jpeg' : 'image/jpeg',
  '.gif'  : 'image/gif',
  '.svg'  : 'image/svg+xml',
  '.webp' : 'image/webp',
  '.avif' : 'image/avif',
  '.ico'  : 'image/x-icon',
  '.woff' : 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf'  : 'font/ttf',
  '.eot'  : 'application/vnd.ms-fontobject',
};

function resolvePath(urlPath) {
  // Sanitise: strip query string, decode URI, prevent path traversal
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const safe    = path.normalize(decoded).replace(/^(\.\.(\/|\\|$))+/, '');
  let   target  = path.join(ROOT, safe);

  if (fs.existsSync(target)) {
    const stat = fs.statSync(target);
    if (stat.isDirectory()) {
      const index = path.join(target, 'index.html');
      return fs.existsSync(index) ? index : null;
    }
    return target;
  }

  // Try appending .html for extensionless URLs (e.g. /installing → installing.html)
  if (!path.extname(safe)) {
    const withHtml = target + '.html';
    if (fs.existsSync(withHtml)) return withHtml;
  }

  return null;
}

const server = http.createServer(function (req, res) {
  const filePath = resolvePath(req.url || '/');

  if (!filePath) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
    return;
  }

  const ext         = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, '127.0.0.1', function () {
  const gtag = (process.env.GTAG || '').trim();
  console.log('');
  console.log('  Cellhasher Docs  —  local preview');
  console.log('  http://localhost:' + PORT);
  console.log('');
  if (gtag) {
    console.log('  GA4 Measurement ID : ' + gtag);
  } else {
    console.log('  GA4 Measurement ID : (not set — consent popup active, GA4 will not load)');
  }
  console.log('');
  console.log('  Press Ctrl+C to stop.');
  console.log('');
});
