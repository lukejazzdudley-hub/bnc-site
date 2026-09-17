// Availability is an explicit release gate, not inferred from a public URL.
export const languages = [
  ['en', 'English'], ['es', 'Español'], ['fr', 'Français'],
  ['pt', 'Português (Brasil)'], ['pt-pt', 'Português (Portugal)'],
  ['de', 'Deutsch'], ['it', 'Italiano'], ['ru', 'Русский'],
  ['ar', 'العربية'], ['hi', 'हिन्दी'], ['ko', '한국어'],
  ['he', 'עברית'], ['ja', '日本語'], ['tr', 'Türkçe'],
  ['id', 'Bahasa Indonesia'], ['ms', 'Bahasa Melayu'], ['pl', 'Polski'],
  ['tl', 'Filipino'], ['vi', 'Tiếng Việt'], ['yo', 'Yorùbá'],
  ['pcm', 'Naijá'], ['pa', 'ਪੰਜਾਬੀ'], ['ur', 'اردو'],
  ['nl', 'Nederlands'], ['sv', 'Svenska'],
].map(([id, label]) => ({ id, label, available: id === 'en',
  reason: id === 'en' ? '' : 'Not available on the website yet: source-clearance and language-quality checks are pending.' }));

export function languageById(id) {
  return languages.find(language => language.id === id);
}
