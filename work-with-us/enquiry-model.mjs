export const needOptions = ['Website', 'Booking or ordering', 'Payments', 'CRM or internal tool', 'Automation or AI', 'Something else'];
export function validateEnquiry(data) {
 /** @type {Record<string,string>} */
 const errors = {};
 for (const [key, label, max] of [['name','your name',120], ['business','your business name',160], ['message','a message',4000]]) {
  const text = typeof data[key] === 'string' ? data[key].trim() : '';
  if (!text || text.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text)) errors[key] = `Enter ${label} (${max} characters maximum).`;
 }
 if (typeof data.email !== 'string' || data.email.length > 254 || !/^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/.test(data.email)) errors.email = 'Enter a valid email address.';
 if (!Array.isArray(data.needs) || !data.needs.length || data.needs.length > needOptions.length || data.needs.some(need => !needOptions.includes(need))) errors.needs = 'Choose at least one thing you need.';
 if (data.website) {
  try {
   const url = new URL(data.website);
   if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || data.website.length > 500) throw new Error('invalid_url');
  } catch { errors.website = 'Enter a full website address, starting with https://, or leave it blank.'; }
 }
 return errors;
}
export function readEnquiry(form) {
 return {...Object.fromEntries(form.entries()), needs: form.getAll('needs')};
}
