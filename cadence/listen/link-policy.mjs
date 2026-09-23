export function tokenFromHash(hash) {
  const token = new URLSearchParams(hash.replace(/^#/, '')).get('token');
  return token && /^[A-Za-z0-9_-]{43}$/.test(token) ? token : null;
}
export function verifiedPlaybackURL(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'goupfxfloriqtucppmbx.supabase.co'
      && url.pathname.startsWith('/storage/v1/object/sign/listening-audio/') ? url.href : null;
  } catch { return null; }
}
