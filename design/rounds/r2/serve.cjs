// One static server process for all three round 2 builds.
// It also answers Netlify Image CDN URLs (/.netlify/images?url=...) with the source file, which plain static servers can't.
// usage: node serve.cjs <dist-dir>:<port> [<dist-dir>:<port> ...]
const http = require('http'), fs = require('fs'), path = require('path');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml' };

for (const arg of process.argv.slice(2)) {
  const i = arg.lastIndexOf(':');
  const root = path.resolve(arg.slice(0, i)), port = +arg.slice(i + 1);
  http.createServer((req, res) => {
    const u = new URL(req.url, 'http://localhost');
    const p = u.pathname === '/.netlify/images' ? '/' + (u.searchParams.get('url') || '').replace(/^\//, '') : decodeURIComponent(u.pathname);
    let f = path.join(root, p);
    if (f !== root && !f.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f) && fs.existsSync(f + '.html')) f += '.html';
    if (!fs.existsSync(f)) {
      const nf = path.join(root, '404.html');
      res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
      return fs.existsSync(nf) ? fs.createReadStream(nf).pipe(res) : res.end('not found');
    }
    res.writeHead(200, { 'content-type': types[path.extname(f).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  }).on('error', (e) => {
    console.error(e.code === 'EADDRINUSE' ? `Port ${port} is already in use. Stop whatever is on it and run again.` : e.message);
    process.exit(1);
  }).listen(port, () => console.log(`  http://localhost:${port}  ${path.basename(root)}`));
}
