import { tokenFromHash, verifiedPlaybackURL } from './link-policy.mjs';
const token = tokenFromHash(location.hash);
const status = document.querySelector('#status');
const audio = document.querySelector('#audio');
const preview = document.querySelector('#preview');
const open = document.querySelector('#open');
let busy = false;
async function resolve() {
  const response = await fetch('https://goupfxfloriqtucppmbx.supabase.co/functions/v1/listening-share', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operation: 'resolve', token }), referrerPolicy: 'no-referrer', cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error('Unavailable');
  const item = await response.json();
  const url = verifiedPlaybackURL(item.playbackUrl);
  if (!url || typeof item.title !== 'string') throw new Error('Unavailable');
  return { ...item, url };
}
async function load() {
  if (!token) { status.textContent = 'This link is incomplete. Ask the artist to send it again.'; return; }
  try {
    const item = await resolve();
    document.querySelector('#title').textContent = item.title || 'Untitled';
    document.querySelector('#credit').textContent = item.creator_username ? `Shared by @${item.creator_username}` : 'Shared by its creator';
    status.textContent = 'Listen to this shared version, or keep it in your Cadence collection.';
    open.href = `cadence://listen/#token=${encodeURIComponent(token)}`;
    open.hidden = false; preview.hidden = false;
  } catch { status.textContent = 'This song is unavailable right now. Its link may have been revoked. Try again later or ask the artist for a new link.'; }
}
preview.addEventListener('click', async () => {
  if (busy) return;
  busy = true; preview.disabled = true; status.textContent = 'Preparing your preview…';
  try {
    // Resolve at the explicit play action, not from a potentially expired page-load URL.
    const item = await resolve(); audio.src = item.url; audio.hidden = false;
    await audio.play(); preview.hidden = true; status.textContent = 'Shared listening version';
  } catch { status.textContent = 'Could not start playback. Try again or open the song in Cadence.'; }
  finally { busy = false; preview.disabled = false; }
});
audio.addEventListener('play', () => document.body.classList.add('playing'));
audio.addEventListener('pause', () => document.body.classList.remove('playing'));
audio.addEventListener('ended', () => document.body.classList.remove('playing'));
audio.addEventListener('error', () => { document.body.classList.remove('playing'); preview.hidden = false; preview.textContent = 'Retry playback'; status.textContent = 'Playback is unavailable. Try again for a fresh listening link.'; });
void load();
