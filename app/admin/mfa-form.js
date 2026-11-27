'use client';

import { useActionState } from 'react';
import { enrollAdminTotp, verifyAdminTotp } from './mfa-actions';

function VerifyForm({ factors }) {
  const [state, action, pending] = useActionState(verifyAdminTotp, null);
  return (
    <form action={action} className="admin-form">
      {factors.length === 1
        ? <input type="hidden" name="factorId" value={factors[0].id} />
        : <label>Application d’authentification
            <select name="factorId">
              {factors.map(factor => <option key={factor.id} value={factor.id}>{factor.name}</option>)}
            </select>
          </label>}
      <label>Code à six chiffres
        <input name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required />
      </label>
      {state?.error && <p role="alert">{state.error}</p>}
      <button className="button" disabled={pending}>Vérifier le code</button>
    </form>
  );
}

export function AdminMfa({ factors }) {
  const [setup, enroll, pending] = useActionState(enrollAdminTotp, null);
  if (factors.length) return <VerifyForm factors={factors} />;

  if (setup?.qrCode) {
    return (
      <>
        <p>Scannez ce QR code avec votre application d’authentification, puis saisissez le code affiché.</p>
        <img src={setup.qrCode} width={200} height={200} alt="QR code de configuration de la double authentification" />
        <VerifyForm factors={[{ id: setup.factorId }]} />
      </>
    );
  }

  return (
    <form action={enroll} className="admin-form">
      <p>Associez votre compte BAM TV SN à une application d’authentification.</p>
      {setup?.error && <p role="alert">{setup.error}</p>}
      <button className="button" disabled={pending}>Configurer la double authentification</button>
    </form>
  );
}
