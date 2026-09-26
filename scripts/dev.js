// ローカル確認用サーバー。src/ の平文HTMLを優先して配信し、無ければルートのファイル（style.css, assets/）を配信する。
// 使い方: node scripts/dev.js  →  http://localhost:8000/
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' };

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const candidates = [path.join(root, 'src', p), path.join(root, p)].filter(f => f.startsWith(root));
  const file = candidates.find(f => fs.existsSync(f) && fs.statSync(f).isFile());
  if (!file) { res.writeHead(404); return res.end('Not found'); }
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(8000, () => console.log('http://localhost:8000/'));
