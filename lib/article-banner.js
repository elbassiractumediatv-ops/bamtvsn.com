function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
}
function short(value, max) {
  const text = String(value ?? '');
  return text.length > max ? text.slice(0, max - 1) + '…' : text;
}
export function articleBanner(article) {
  const title = short(article.title || 'Actualité', 68);
  const category = short(article.category?.name || 'ACTUALITÉ DU JOUR', 28).toLocaleUpperCase('fr-FR');
  const date = article.published_at ? new Date(article.published_at) : new Date();
  const day = new Intl.DateTimeFormat('fr-FR', { day: '2-digit' }).format(date);
  const dateLabel = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(date).toLocaleUpperCase('fr-FR');
  const lines = title.match(/.{1,31}(?:\s|$)/g)?.slice(0, 3).map(s => s.trim()) || [title];
  const text = lines.map((line, i) => `<text x="64" y="${310 + i * 58}" fill="#fff" font-family="Arial,sans-serif" font-size="43" font-weight="900">${esc(line)}</text>`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#052d21"/><stop offset=".58" stop-color="#08743e"/><stop offset="1" stop-color="#031a16"/></linearGradient><linearGradient id="gold"><stop stop-color="#9b6b19"/><stop offset=".5" stop-color="#ffe18a"/><stop offset="1" stop-color="#b88625"/></linearGradient><linearGradient id="red"><stop stop-color="#f04438"/><stop offset="1" stop-color="#a80c19"/></linearGradient><pattern id="p" width="70" height="70" patternUnits="userSpaceOnUse"><path d="M35 2 68 35 35 68 2 35Z M35 17 53 35 35 53 17 35Z" fill="none" stroke="#e2c879" stroke-opacity=".12" stroke-width="2"/></pattern></defs>
  <rect width="1200" height="675" fill="url(#bg)"/><rect width="1200" height="675" fill="url(#p)"/><circle cx="930" cy="330" r="330" fill="#37ad53" opacity=".13"/>
  <g transform="translate(48 34)"><rect width="62" height="62" rx="12" fill="#d82c36"/><text x="31" y="42" text-anchor="middle" fill="#fff" font-family="Arial" font-size="30" font-weight="900">B</text><text x="78" y="31" fill="#fff" font-family="Arial" font-size="29" font-weight="900">BAM TV <tspan fill="#ff5555">SN</tspan></text><text x="79" y="51" fill="#d7e8df" font-family="Arial" font-size="10" font-weight="600" letter-spacing="1">L’INFORMATION AU CŒUR DE NOS COMMUNAUTÉS</text></g>
  <path d="M0 142H850L790 205H0Z" fill="url(#red)" stroke="url(#gold)" stroke-width="3"/><text x="62" y="183" fill="#fff" font-family="Arial" font-size="24" font-weight="800" letter-spacing="2">${esc(category)}</text>
  <text x="58" y="275" fill="#f4d783" font-family="Arial" font-size="20" font-weight="700" letter-spacing="3">L’ACTUALITÉ EN CONTINU</text>${text}
  <text x="1030" y="500" text-anchor="middle" fill="#fff" opacity=".08" font-family="Arial" font-size="230" font-weight="900">${esc(day)}</text>
  <path d="M0 585Q450 620 1200 555V675H0Z" fill="#031a14" opacity=".96"/><path d="M0 585Q450 620 1200 555" fill="none" stroke="url(#gold)" stroke-width="5"/>
  <text x="55" y="633" fill="#fff" font-family="Arial" font-size="19" font-weight="700">${esc(dateLabel)} · DAKAR</text><text x="1145" y="634" text-anchor="end" fill="#d9c17b" font-family="Arial" font-size="18" font-weight="800">BAMTVSN.COM</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
