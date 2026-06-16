import React, { useContext } from 'react';
import Link from 'next/link';
import { useAuth } from '@hooks/useAuth';
import AppContext from '@context/AppContext';
import styles from '@styles/Menu.module.scss';

const Menu = () => {
  const auth = useAuth();
  const { toggleMenu } = useContext(AppContext);

  const close = () => toggleMenu();

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      '¿Estás seguro de que deseas eliminar tu cuenta?\n\nEsta acción es permanente y no se puede deshacer. Todos tus datos, órdenes e historial de reciclaje serán eliminados.'
    );
    if (!confirmed) return;
    // TODO: call DELETE /api/v1/users/:id once the backend endpoint exists
    alert('Solicitud recibida. Nuestro equipo procesará la eliminación en 48 horas.');
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
