// src/*.html（平文）をパスワードで暗号化し、ルートの *.html（公開用）を生成する。
// 使い方: SITE_PASSWORD=xxxx node scripts/build.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.join(__dirname, '..');
const password = process.env.SITE_PASSWORD;
if (!password) {
  console.error('SITE_PASSWORD を指定してください。例: SITE_PASSWORD=xxxx node scripts/build.js');
  process.exit(1);
}

const template = fs.readFileSync(path.join(__dirname, 'gate-template.html'), 'utf8');
const ITER = 600000;

function parse(html) {
  const head = html.match(/<head>([\s\S]*?)<\/head>/)[1];
  const bodyRaw = html.match(/<body>([\s\S]*)<\/body>/)[1];
  const scripts = [...bodyRaw.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  return {
    title: head.match(/<title>([\s\S]*?)<\/title>/)[1].trim(),
    headLinks: head.match(/<link[^>]*>/g) || [],
    body: '\n' + bodyRaw.replace(/<script>[\s\S]*?<\/script>/g, '').trim() + '\n',
    js: scripts.join('\n'),
  };
}

function encrypt(obj) {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = crypto.pbkdf2Sync(password, salt, ITER, 32, 'sha256');
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([cipher.update(JSON.stringify(obj), 'utf8'), cipher.final()]);
  const ct = Buffer.concat([enc, cipher.getAuthTag()]); // Web Crypto 形式（末尾に認証タグ）
  return { salt: salt.toString('base64'), iv: iv.toString('base64'), ct: ct.toString('base64'), iter: ITER };
}

const srcDir = path.join(root, 'src');
for (const file of fs.readdirSync(srcDir).filter(f => f.endsWith('.html'))) {
  const page = parse(fs.readFileSync(path.join(srcDir, file), 'utf8'));
  const out = template.replace('__ENC__', () => JSON.stringify(encrypt(page)));
  fs.writeFileSync(path.join(root, file), out);
  console.log('built', file);
}
