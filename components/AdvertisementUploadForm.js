'use client';
import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Upload } from 'tus-js-client';
import { saveAdvertisementAction } from '@/app/admin/actions';

const ALLOWED = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif',
  'video/mp4': 'mp4', 'video/webm': 'webm',
};

async function hasValidSignature(file) {
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const ascii = (start, end) => String.fromCharCode(...bytes.slice(start, end));
  if (file.type === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (file.type === 'image/png') return [137,80,78,71,13,10,26,10].every((v, i) => bytes[i] === v);
  if (file.type === 'image/webp') return ascii(0,4) === 'RIFF' && ascii(8,12) === 'WEBP';
  if (file.type === 'image/gif') return ['GIF87a','GIF89a'].includes(ascii(0,6));
  if (file.type === 'video/mp4') return ascii(4,8) === 'ftyp';
  if (file.type === 'video/webm') return bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3;
  return false;
}

function explainUploadError(error) {
  const status = error?.originalResponse?.getStatus?.();
  const body = error?.originalResponse?.getBody?.() || '';
  const detail = `${error?.message || ''} ${body}`.toLowerCase();
  if (status === 401 || status === 403 || /jwt|unauthorized|permission|row.level|access denied/.test(detail)) return 'Session administrateur expirée ou autorisation de stockage refusée. Déconnectez-vous, reconnectez-vous puis réessayez.';
  if (status === 413 || /too large|entitytoolarge|payload too large/.test(detail)) return 'Le fichier dépasse la limite de 50 Mo. Réduisez sa taille puis réessayez.';
  if (status === 404 || /nosuchbucket|bucket not found/.test(detail)) return 'Le stockage publicitaire est introuvable. Contactez l’administrateur technique.';
  if (status === 0 || /network|failed to fetch|timeout|connection/.test(detail)) return 'Connexion interrompue pendant l’envoi. Gardez cette page ouverte et relancez l’envoi : le transfert reprend si le navigateur a conservé la session.';
  return `Échec du transfert (${status ? `HTTP ${status}` : 'réseau'}). ${error?.message || 'Vérifiez votre connexion et réessayez.'}`;
}

function uploadResumable({ file, path, supabaseUrl, publishableKey, accessToken, onProgress }) {
  const projectRef = new URL(supabaseUrl).hostname.split('.')[0];
  const endpoint = `https://${projectRef}.storage.supabase.co/storage/v1/upload/resumable`;
  return new Promise((resolve, reject) => {
    const upload = new Upload(file, {
      endpoint, retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: { apikey: publishableKey, authorization: `Bearer ${accessToken}` },
      uploadDataDuringCreation: true, removeFingerprintOnSuccess: true, chunkSize: 6 * 1024 * 1024,
      metadata: { bucketName: 'publicites', objectName: path, contentType: file.type, cacheControl: '31536000' },
      onError: reject,
      onProgress(bytesUploaded, bytesTotal) { onProgress(Math.round((bytesUploaded / bytesTotal) * 100)); },
      onSuccess: resolve,
    });
    upload.findPreviousUploads().then((previousUploads) => {
      if (previousUploads.length) upload.resumeFromPreviousUpload(previousUploads[0]);
      upload.start();
    }).catch(reject);
  });
}

export default function AdvertisementUploadForm() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);

  async function handleSubmit(event) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const title = String(data.get('title') || '').trim();
    const whatsappPhone = String(data.get('whatsapp_phone') || '').replace(/[^0-9]/g, '');
    const file = data.get('media');
    const durationSeconds = Number.parseInt(String(data.get('duration_seconds') || '8'), 10);

    if (title.length < 2 || title.length > 120 || !(file instanceof File) || !ALLOWED[file.type] ||
        file.size < 1 || file.size > 50 * 1024 * 1024 || !(await hasValidSignature(file))) {
      setMessage('Fichier ou titre invalide. Formats acceptés : JPG, PNG, WEBP, GIF, MP4 et WebM (50 Mo maximum).');
      return;
    }
    if (whatsappPhone && !/^\d{8,15}$/.test(whatsappPhone)) {
      setMessage('Le numéro WhatsApp doit contenir 8 à 15 chiffres avec indicatif pays, par exemple 2217XXXXXXXX.');
      return;
    }
    if (file.type.startsWith('image/') && (!Number.isInteger(durationSeconds) || durationSeconds < 5 || durationSeconds > 60)) {
      setMessage('La durée des images doit être comprise entre 5 et 60 secondes.');
      return;
    }

    setBusy(true); setProgress(0); setMessage('Connexion sécurisée au stockage publicitaire…');
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
      if (!supabaseUrl || !publishableKey) throw new Error('Configuration publique Supabase absente sur le site.');
      const supabase = createBrowserClient(supabaseUrl, publishableKey);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.access_token) throw new Error('Session administrateur absente. Reconnectez-vous à l’administration.');
      const path = `playlist/${Date.now()}-${crypto.randomUUID()}.${ALLOWED[file.type]}`;
      setMessage('Envoi sécurisé en cours… 0 %');
      await uploadResumable({
        file, path, supabaseUrl, publishableKey, accessToken: session.access_token,
        onProgress(value) { setProgress(value); setMessage(`Envoi sécurisé en cours… ${value} %`); },
      });
      setMessage('Vérification et ajout à la playlist…');
      const result = await saveAdvertisementAction({
        title, path, mimeType: file.type,
        mediaType: file.type.startsWith('video/') ? 'video' : 'image',
        durationSeconds: file.type.startsWith('image/') ? durationSeconds : 8,
        whatsappPhone: whatsappPhone || null,
      });
      if (!result?.ok) {
        await supabase.storage.from('publicites').remove([path]);
        throw new Error(result?.error === 'upload'
          ? 'Le transfert est terminé, mais le fichier n’est pas visible dans le stockage. Vérifiez les droits administrateur.'
          : 'Le transfert est terminé, mais l’enregistrement dans la playlist a échoué.');
      }
      window.location.assign('/admin/publicites?created=1');
    } catch (error) {
      setMessage(explainUploadError(error)); setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form admin-advertisement-form">
      <h2>Ajouter une publicité</h2>
      <label>Titre de la publicité<input name="title" type="text" minLength={2} maxLength={120} required placeholder="Ex. Offre spéciale de la semaine" /></label>
      <label>Fichier image ou vidéo<input name="media" type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm" required disabled={busy} /></label>
      <label>Numéro WhatsApp de l’annonceur (avec indicatif pays)
        <input name="whatsapp_phone" type="tel" inputMode="numeric" pattern="[0-9+ ()-]{8,20}" placeholder="Ex. 221785376461" disabled={busy} />
      </label>
      <label>Durée d’affichage des images (en secondes)<input name="duration_seconds" type="number" min="5" max="60" defaultValue="8" disabled={busy} /></label>
      <p className="meta">La publicité apparaît automatiquement sur l’accueil et sur la page Publicité. Les vidéos démarrent sans son et la suivante prend le relais à la fin. Le bouton WhatsApp ouvre directement le contact de cette annonce. Formats : JPG, PNG, WEBP, GIF, MP4 et WebM. Taille maximale : 50 Mo.</p>
      {busy && <progress value={progress} max="100" aria-label="Progression de l’envoi" />}
      {message && <p className="notice" role="status">{message}</p>}
      <button className="button" type="submit" disabled={busy}>{busy ? 'Envoi en cours…' : 'Ajouter à la playlist automatique'}</button>
    </form>
  );
}
