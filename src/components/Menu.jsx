import React, { useContext } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Cookie from 'js-cookie';
import { useAuth } from '@hooks/useAuth';
import AppContext from '@context/AppContext';
import endPoints from '@services/api';
import styles from '@styles/Menu.module.scss';

const Menu = () => {
  const auth = useAuth();
  const { toggleMenu } = useContext(AppContext);

  const close = () => toggleMenu();

  const handleDeleteAccount = async () => {
    const confirmed1 = window.confirm(
      '¿Estás seguro de que deseas eliminar tu cuenta?\n\nEsta acción es permanente y no se puede deshacer. Todos tus datos, órdenes e historial de reciclaje serán eliminados.'
    );
    if (!confirmed1) return;

    const confirmed2 = window.confirm(
      'CONFIRMACIÓN FINAL\n\n¿Realmente deseas eliminar tu cuenta de Aynimar de forma permanente? No habrá ninguna manera de recuperarla.'
    );
    if (!confirmed2) return;

    try {
      await axios.delete(endPoints.users.deleteUser(auth.user?.sub), {
        headers: { Authorization: `Bearer ${Cookie.get('token')}` },
      });
    } catch (err) {
      console.error('[Menu] Error al eliminar cuenta:', err?.response?.data ?? err.message);
    }
    auth.logout();
  };

  return (
    <div className={styles.Menu}>
      <button className={styles.closeButton} onClick={close} aria-label="Cerrar menú">
        ✕
      </button>
      <ul>
        <li>
          <Link href="/mi_cuenta/orders" onClick={close}>Mis Órdenes</Link>
        </li>
        <li>
          <Link href="/mi_cuenta" onClick={close}>Mi Cuenta</Link>
        </li>
        <li>
          <button onClick={() => { close(); auth.logout(); }}>Cerrar Sesión</button>
        </li>
        <li>
          <button onClick={handleDeleteAccount}>Eliminar Cuenta</button>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
