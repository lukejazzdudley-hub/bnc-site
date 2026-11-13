import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const homeStyles = ['styles.css', 'tactile.css', 'work-with-us/studio.css', 'work-with-us/experience.css'];
export const homeFonts = ['9b6f5ff45b27', '5f3d6ad60f29', '60c06664b5a9'];
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
export function buildHomePerformance(root = projectRoot) {
  const read = file => readFileSync(path.join(root, file));
  let html = read('index.html').toString();
  // Keep the entire existing cascade, including media/focus/no-JS states. No runtime CSS loader.
  const css = homeStyles.map(file => `/* ${file} */\n${read(file)}`).join('\n');
  if (/<\/style/i.test(css)) throw new Error('CSS cannot contain an HTML style terminator');
  const styles = `<!-- HOME-STYLES:START --><style id="home-styles" data-source-sha256="${digest(css)}">\n${css}\n</style><!-- HOME-STYLES:END -->`;
  if (html.includes('<!-- HOME-STYLES:START -->')) {
    html = html.replace(/<!-- HOME-STYLES:START -->[\s\S]*?<!-- HOME-STYLES:END -->/, styles);
  } else {
    const links = /  <link rel="stylesheet" href="(?:\/?styles\.css|\/?tactile\.css|\/work-with-us\/(?:studio|experience)\.css(?:\?[^"<>]+)?)" \/>\n/g;
    if ([...html.matchAll(links)].length !== 4) throw new Error('Expected the four original homepage stylesheets');
    html = html.replace(links, '').replace('  <script type="module"', `  ${styles}\n  <script type="module"`);
  }
  // These three faces are all used in the initial viewport. Avoid the unused italic face.
  html = html.replace(/\s*<link rel="preload" href="\/assets\/fonts\/[a-f0-9]{12}\.woff2"[^>]*>/g, '');
  const preloads = homeFonts.map(hash => `<link rel="preload" href="/assets/fonts/${hash}.woff2" as="font" type="font/woff2" crossorigin>`).join('\n');
  html = html.replace('<!-- HOME-STYLES:START -->', `${preloads}\n<!-- HOME-STYLES:START -->`);
  const assets = [];
  for (const source of ['site.js', 'work-with-us/experience.mjs', 'assets/studio/harbour-wine-768.webp', 'assets/studio/harbour-wine.webp']) {
    const bytes = read(source), hash = digest(bytes), ext = path.extname(source);
    const file = `assets/immutable/${path.basename(source, ext)}.${hash.slice(0, 12)}${ext}`;
    mkdirSync(path.join(root, 'assets/immutable'), { recursive: true });
    writeFileSync(path.join(root, file), bytes);
    assets.push({ source, url: `/${file}`, sha256: hash, bytes: bytes.length });
  }
  const [site, experience, small, large] = assets;
  html = html.replace(/(<script type="module" src=")(?:\/work-with-us\/experience\.mjs|\/assets\/immutable\/experience\.[a-f0-9]{12}\.mjs)("><\/script>)/, `$1${experience.url}$2`);
  html = html.replace(/(<script src=")(?:site\.js(?:\?[^"<>]+)?|\/assets\/immutable\/site\.[a-f0-9]{12}\.js)(" defer><\/script>)/, `$1${site.url}$2`);
  html = html.replace(/\/assets\/(?:studio\/harbour-wine-768|immutable\/harbour-wine-768\.[a-f0-9]{12})\.webp/g, small.url);
  html = html.replace(/\/assets\/(?:studio\/harbour-wine|immutable\/harbour-wine\.[a-f0-9]{12})\.webp/g, large.url);
  // The other pages keep sharing the original sources. Existing immutable files stay available.
  for (const name of [...homeFonts, '6ee678c33f38']) {
    const file = `assets/fonts/${name}.woff2`, bytes = read(file), hash = digest(bytes);
    if (!hash.startsWith(name)) throw new Error(`Font filename is not content-addressed: ${file}`);
    assets.push({ source: file, url: `/${file}`, sha256: hash, bytes: bytes.length });
  }
  if (!html.includes(site.url) || !html.includes(experience.url)) throw new Error('Missing homepage script entry');
  writeFileSync(path.join(root, 'index.html'), html);
  mkdirSync(path.join(root, 'content'), { recursive: true });
  writeFileSync(path.join(root, 'content/home-assets.json'), JSON.stringify({ cssSha256: digest(css), assets }, null, 2) + '\n');
  return { cssBytes: Buffer.byteLength(css), immutableAssets: assets.length };
}
if (path.resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) console.log(buildHomePerformance());
