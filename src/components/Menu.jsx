import React, { useContext } from 'react';
import Link from 'next/link';
import { useAuth } from '@hooks/useAuth';
import AppContext from '@context/AppContext';
import styles from '@styles/Menu.module.scss';

const Menu = () => {
  const auth = useAuth();
  const { toggleMenu } = useContext(AppContext);

  const close = () => toggleMenu();

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
      </ul>
    </div>
  );
};

export default Menu;
