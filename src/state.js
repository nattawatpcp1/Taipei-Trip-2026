export const KEY = 'taipei-trip:v5.4';
export function dateInTaipei(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
}
export function initialDay(days, now = new Date()) {
  const today = dateInTaipei(now);
  return days.find(d => d.id === today)?.id || (today > days.at(-1).id ? days.at(-1).id : days[0].id);
}
export function amount(value) {
  const n = Number(value); return Number.isFinite(n) && n >= 0 ? n : 0;
}
export function totals(expenses, fx, limit) {
  const total = Object.values(expenses).reduce((sum,v) => sum + amount(v),0);
  return {total, thb:total * amount(fx), remaining:amount(limit)-total};
}
export function load(storage, fallback) {
  try { const v=JSON.parse(storage.getItem(KEY)); return v && typeof v==='object' && !Array.isArray(v) ? {...fallback,...v} : fallback; }
  catch {return fallback;}
}
export function save(storage, state) {
  try {storage.setItem(KEY, JSON.stringify(state)); return true;} catch {return false;}
}
