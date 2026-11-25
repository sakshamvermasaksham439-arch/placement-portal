export const API_URL = 'http://localhost:5000/api/v1';
export async function api(path, { method = 'GET', body, isForm = false } = {}) {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body && !isForm) headers['Content-Type'] = 'application/json';
  const res = await fetch(API_URL + path, { method, headers, body: body ? (isForm ? body : JSON.stringify(body)) : undefined });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && !location.pathname.endsWith('login.html')) { localStorage.clear(); location.href = 'login.html'; }
  if (!res.ok) throw new Error(data.errors?.[0]?.msg || data.message || 'Something went wrong');
  return data;
}
export const user = () => JSON.parse(localStorage.getItem('user') || 'null');
export const logout = () => { localStorage.clear(); location.href = 'login.html'; };
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export function requireAuth(role) {
  const u = user();
  if (!u || !localStorage.getItem('token')) location.href = 'login.html';
  else if (role && u.role !== role) location.href = 'dashboard.html';
  return u;
}
export function navbar(u) {
  const links = { student: ['Jobs|dashboard.html', 'Resume|resume.html'], recruiter: ['My Jobs|dashboard.html'], alumni: ['Referrals|dashboard.html'], admin: ['Overview|dashboard.html'] }[u.role];
  document.body.insertAdjacentHTML('afterbegin', `<nav><strong>Placement Portal</strong>${links.map(l => { const [t, h] = l.split('|'); return `<a href="${h}">${t}</a>`; }).join('')}<span style="flex:1"></span><span>${esc(u.name)} (${u.role})</span><button id="lo">Logout</button></nav>`);
  document.getElementById('lo').onclick = logout;
}
