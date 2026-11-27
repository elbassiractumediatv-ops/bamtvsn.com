'use client';
import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
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
export default function AdvertisementUploadForm() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function handleSubmit(event) {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    const title = String(data.get('title') || '').trim();
    const file = data.get('media');
    const durationSeconds = Number.parseInt(String(data.get('duration_seconds') || '8'), 10);
    if (title.length < 2 || title.length > 120 || !(file instanceof File) || !ALLOWED[file.type] ||
        file.size < 1 || file.size > 50 * 1024 * 1024 || !(await hasValidSignature(file))) {
      setMessage('Fichier ou titre invalide. Formats acceptés : JPG, PNG, WEBP, GIF, MP4 et WebM (50 Mo maximum).');
      return;
    }
    if (file.type.startsWith('image/') && (!Number.isInteger(durationSeconds) || durationSeconds < 5 || durationSeconds > 60)) {
      setMessage('La durée des images doit être comprise entre 5 et 60 secondes.');
      return;
    }
    setBusy(true);
    setMessage('Envoi du média vers le stockage publicitaire…');
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
    const path = `playlist/${Date.now()}-${crypto.randomUUID()}.${ALLOWED[file.type]}`;
    const { error: uploadError } = await supabase.storage.from('publicites').upload(path, file, {
      contentType: file.type, cacheControl: '31536000', upsert: false,
    });
    if (uploadError) {
      setBusy(false);
      setMessage('Échec de l’envoi. Vérifiez votre connexion puis réessayez.');
      return;
    }
    const result = await saveAdvertisementAction({
      title, path, mimeType: file.type,
      mediaType: file.type.startsWith('video/') ? 'video' : 'image',
      durationSeconds: file.type.startsWith('image/') ? durationSeconds : 8,
    });
    if (!result?.ok) {
      await supabase.storage.from('publicites').remove([path]);
      setBusy(false);
      setMessage(result?.error === 'upload'
        ? 'Le fichier envoyé n’a pas pu être vérifié dans le stockage.'
        : 'Le média a été envoyé, mais son enregistrement a échoué. Réessayez.');
      return;
    }
    window.location.assign('/admin/publicites?created=1');
  }
  return (
    <form onSubmit={handleSubmit} className="admin-form admin-advertisement-form">
      <h2>Ajouter une publicité</h2>
      <label>Titre de la publicité
        <input name="title" type="text" minLength={2} maxLength={120} required placeholder="Ex. Offre spéciale de la semaine" />
      </label>
      <label>Fichier image ou vidéo
        <input name="media" type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm" required />
      </label>
      <label>Durée d’affichage des images (en secondes)
        <input name="duration_seconds" type="number" min="5" max="60" defaultValue="8" />
      </label>
      <p className="meta">Les vidéos démarrent automatiquement, sans son, puis la suivante démarre dès la fin. Les images restent affichées pendant la durée choisie. Formats : JPG, PNG, WEBP, GIF, MP4 et WebM. Taille maximale : 50 Mo.</p>
      {message && <p className="notice" role="status">{message}</p>}
      <button className="button" type="submit" disabled={busy}>{busy ? 'Envoi en cours…' : 'Ajouter à la playlist automatique'}</button>
    </form>
  );
}
