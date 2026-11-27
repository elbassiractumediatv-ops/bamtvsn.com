// Contrôle local en lecture seule. Node >= 22, aucune dépendance.
// Utiliser uniquement une clé publishable ou l'ancienne clé anon.
// node --env-file=.env.local scripts/check-supabase.mjs
const url = 'https://thevryhybiloqddnoeof.supabase.co';
const key = process.env.SUPABASE_PUBLISHABLE_KEY || '';
function isAnon(value) {
  if (value.startsWith('sb_publishable_')) return true;
  try { return JSON.parse(Buffer.from(value.split('.')[1], 'base64url').toString()).role === 'anon'; }
  catch { return false; }
}
if (!isAnon(key)) {
  console.error('Clé publique Supabase absente ou non reconnue. Les clés privilégiées sont interdites.');
  process.exit(1);
}
const targets = [
 ['articles','id,title,slug,status','status=eq.published'],
 ['videos','id,title,slug,status','status=eq.published'],
 ['categories','id,name,slug',''],
 ['emissions','id,title,slug','is_active=eq.true'],
 ['publicites','id,titre,duree','actif=eq.true'],
];
let failed = false;
for (const [table,columns,filter] of targets) {
  try {
    const endpoint = new URL('/rest/v1/'+table,url);
    endpoint.searchParams.set('select',columns);
    endpoint.searchParams.set('limit','1');
    if (filter) { const [field,value] = filter.split('='); endpoint.searchParams.set(field,value); }
    const headers = {apikey:key,Accept:'application/json',Prefer:'count=exact'};
    if (!key.startsWith('sb_publishable_')) headers.Authorization='Bearer '+key;
    const response = await fetch(endpoint,{method:'GET',headers,redirect:'error',signal:AbortSignal.timeout(15000)});
    if (!response.ok) { failed=true; console.error(table+': HTTP '+response.status); continue; }
    const data=await response.json();
    if(!Array.isArray(data)) throw new Error('Réponse non tabulaire');
    console.log(table+': OK — total visible '+(response.headers.get('content-range')?.split('/').pop() ?? 'inconnu'));
  } catch { failed=true; console.error(table+': échec de connexion ou réponse inattendue'); }
}
process.exitCode=failed?1:0;
