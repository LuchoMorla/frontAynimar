import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Cookie from 'js-cookie';
import { useAuth } from '@hooks/useAuth';
import endPoints from '@services/api';
import styles from '@styles/MyAccounts.module.scss';

const MyAccount = () => {
  const auth = useAuth();
  const [deleteStep, setDeleteStep] = useState(0); // 0=idle, 1=confirm, 2=deleting
  const [deleteError, setDeleteError] = useState(null);

  const handleDeleteRequest  = () => { setDeleteStep(1); setDeleteError(null); };
  const handleCancelDelete   = () => { setDeleteStep(0); setDeleteError(null); };

  const handleConfirmDelete = async () => {
    setDeleteStep(2);
    try {
      await axios.delete(endPoints.users.deleteUser(auth.user?.sub), {
        headers: { Authorization: `Bearer ${Cookie.get('token')}` },
      });
      auth.logout();
    } catch (err) {
      const msg = err?.response?.data?.message ?? 'Error al eliminar la cuenta. Intenta de nuevo o contacta a soporte.';
      setDeleteError(msg);
      setDeleteStep(1);
    }
  };

  return (
    <div className={styles['accounts-container']}>
      <h1 className={styles.title}>Mi Cuenta</h1>

      <div className={styles.accounts}>
        <Link href="/mi_cuenta/recycler">Mi Perfil de Reciprocidad al Medio Ambiente</Link>
        <Link href="/mi_cuenta/cliente">Perfil de compras</Link>
      </div>

      {/* ── Danger zone ─────────────────────────────────────────────────── */}
      <div style={{
        marginTop: '2.5rem',
        padding: '1.25rem',
        border: '1px solid #fca5a5',
        borderRadius: '10px',
        maxWidth: '480px',
        background: '#fff5f5',
      }}>
        <h2 style={{ color: '#dc2626', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>
          Zona de peligro
        </h2>

        {deleteStep === 0 && (
          <>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem', lineHeight: 1.5 }}>
              Eliminar tu cuenta es una acción permanente e irreversible. Se borrarán todos tus datos, órdenes e historial de reciclaje.
            </p>
            <button
              onClick={handleDeleteRequest}
              style={{ background: '#dc2626', color: 'white', padding: '0.5rem 1.25rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
            >
              Eliminar mi cuenta
            </button>
          </>
        )}

        {(deleteStep === 1 || deleteStep === 2) && (
          <>
            <p style={{ fontSize: '0.875rem', color: '#dc2626', fontWeight: 600, marginBottom: '0.4rem' }}>
              ¿Confirmas que deseas eliminar permanentemente tu cuenta?
            </p>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '1rem', lineHeight: 1.5 }}>
              Esta acción no se puede deshacer. Perderás todos tus datos, órdenes e historial de reciclaje asociados a esta cuenta.
            </p>
            {deleteError && (
              <p style={{ fontSize: '0.8rem', color: '#dc2626', marginBottom: '0.75rem' }}>{deleteError}</p>
            )}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleCancelDelete}
                disabled={deleteStep === 2}
                style={{ background: '#f3f4f6', color: '#374151', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '0.875rem', opacity: deleteStep === 2 ? 0.5 : 1 }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteStep === 2}
                style={{ background: '#dc2626', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, opacity: deleteStep === 2 ? 0.6 : 1 }}
              >
                {deleteStep === 2 ? 'Eliminando…' : 'Sí, eliminar mi cuenta'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyAccount;
