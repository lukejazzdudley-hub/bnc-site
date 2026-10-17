const origin = 'https://brandnamechanges.com';
const watch = `${origin}/cadence/type-beat-walkthrough/`;
const escapeXml = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');

export function addWatchVideo(sitemap, html) {
  const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(match => JSON.parse(match[1]));
  const video = schemas.find(schema => schema['@type'] === 'VideoObject');
  if (!video) throw new Error('Watch page requires visible video metadata.');
  for (const value of [video.contentUrl, video.thumbnailUrl?.[0]]) {
    if (new URL(value).origin !== origin) throw new Error('Use the locally hosted watch video and thumbnail.');
  }
  if (!video.name || !video.description || !video.uploadDate) throw new Error('Incomplete watch metadata.');
  const videoBlock = `<video:video><video:thumbnail_loc>${escapeXml(video.thumbnailUrl[0])}</video:thumbnail_loc><video:title>${escapeXml(video.name)}</video:title><video:description>${escapeXml(video.description)}</video:description><video:content_loc>${escapeXml(video.contentUrl)}</video:content_loc><video:publication_date>${escapeXml(video.uploadDate)}</video:publication_date></video:video>`;
  const target = new RegExp(`(<url>\\s*<loc>${watch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</loc>)([\\s\\S]*?)(</url>)`);
  if (!target.test(sitemap)) throw new Error('Watch URL missing from sitemap.');
  const namespaced = sitemap.includes('xmlns:video=') ? sitemap : sitemap.replace('<urlset ', '<urlset xmlns:video="http://www.google.com/schemas/sitemap-video/1.1" ');
  return namespaced.replace(target, (_, start, rest, end) => `${start}${rest.replace(/<video:video>[\s\S]*?<\/video:video>/g, '')}${videoBlock}${end}`);
}
