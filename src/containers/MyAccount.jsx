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

      <div className={styles['danger-zone']}>
        <h2 className={styles['danger-title']}>Zona de peligro</h2>

        {deleteStep === 0 && (
          <>
            <p className={styles['danger-text']}>
              Eliminar tu cuenta es una acción permanente e irreversible. Se borrarán todos tus datos, órdenes e historial de reciclaje.
            </p>
            <button className={styles['btn-delete-idle']} onClick={handleDeleteRequest}>
              Eliminar mi cuenta
            </button>
          </>
        )}

        {(deleteStep === 1 || deleteStep === 2) && (
          <>
            <p className={styles['danger-text-alert']}>
              ¿Confirmas que deseas eliminar permanentemente tu cuenta?
            </p>
            <p className={styles['danger-text-sub']}>
              Esta acción no se puede deshacer. Perderás todos tus datos, órdenes e historial de reciclaje asociados a esta cuenta.
            </p>
            {deleteError && (
              <p className={styles['danger-error']}>{deleteError}</p>
            )}
            <div className={styles['danger-actions']}>
              <button
                className={styles['btn-cancel']}
                onClick={handleCancelDelete}
                disabled={deleteStep === 2}
              >
                Cancelar
              </button>
              <button
                className={styles['btn-delete']}
                onClick={handleConfirmDelete}
                disabled={deleteStep === 2}
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
