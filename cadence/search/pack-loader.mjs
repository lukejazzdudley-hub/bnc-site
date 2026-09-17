const CACHE = 'cadence-public-rhymes-v1';
const MAX_PACK_BYTES = 16000000;

export function validatePack(pack, expectedId) {
  if (!pack || pack.id !== expectedId || !Array.isArray(pack.entries) ||
      !pack.entries.length || pack.entries.length > 300000) throw new Error('Invalid language pack');
  for (const entry of pack.entries) {
    if (!Array.isArray(entry) || entry.length !== 2 || typeof entry[0] !== 'string' ||
        typeof entry[1] !== 'string' || entry[0].length > 100 || entry[1].length > 500 ||
        !/^[A-Z0-9 ]+$/.test(entry[1])) throw new Error('Invalid pronunciation');
  }
  if (!Array.isArray(pack.phrases) || pack.phrases.length > 10000 ||
      pack.phrases.some(p => typeof p !== 'string' || p.length > 100)) throw new Error('Invalid phrase bank');
  if (pack.id === 'en' && (!pack.frequencies || typeof pack.frequencies !== 'object' || Array.isArray(pack.frequencies) ||
      Object.values(pack.frequencies).some(v => !Number.isFinite(v) || v < 0 || v > 9) ||
      pack.entries.some(([word]) => !Object.hasOwn(pack.frequencies, word.replace(/\(\d+\)$/, ''))))) throw new Error('Invalid frequency data');
  return pack;
}

export async function verifyResponse(response, descriptor, id) {
  if (!response.ok) throw new Error('Pack download failed');
  const advertised = Number(response.headers.get('content-length'));
  if (advertised > MAX_PACK_BYTES) throw new Error('Pack too large');
  const reader = response.body.getReader();
  const chunks = []; let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > MAX_PACK_BYTES) { await reader.cancel(); throw new Error('Pack too large'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(length); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(b => b.toString(16).padStart(2, '0')).join('');
  if (hash !== descriptor.sha256) throw new Error('Pack integrity mismatch');
  return validatePack(JSON.parse(new TextDecoder().decode(bytes)), id);
}

export async function loadPack(descriptor, id) {
  if (!descriptor || !/^[a-f0-9]{64}$/.test(descriptor.sha256)) throw new Error('Unreleased pack');
  const url = new URL(descriptor.url, self.location.href);
  // A manifest cannot silently send downloads to arbitrary third parties.
  if (url.origin !== self.location.origin) throw new Error('Unapproved pack host');
  url.searchParams.set('v', descriptor.sha256);
  let cache;
  try { cache = await caches.open(CACHE); } catch { /* Private browsing: network-only is supported. */ }
  let cached;
  try { cached = cache && await cache.match(url.href); }
  catch { cache = null; /* Storage unavailable: use verified network response. */ }
  if (cached) {
    try { return await verifyResponse(cached, descriptor, id); }
    catch {
      try { await cache.delete(url.href); }
      catch { cache = null; /* Corrupt storage must not block network recovery. */ }
    }
  }
  const response = await fetch(url.href, { signal: AbortSignal.timeout(15000) });
  const copy = response.clone();
  const pack = await verifyResponse(response, descriptor, id);
  if (cache) {
    try {
      await cache.put(url.href, copy);
      const keys = await cache.keys();
      for (const key of keys.slice(0, Math.max(0, keys.length - 3))) await cache.delete(key);
    } catch { /* Verified searches still work if browser storage is full. */ }
  }
  return pack;
}
