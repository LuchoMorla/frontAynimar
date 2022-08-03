import React from 'react';
import Link from 'next/link';
import { useAuth } from '@hooks/useAuth';
import styles from '@styles/Menu.module.scss';

const Menu = () => {
	const auth = useAuth();
	return (
		<div className={styles.Menu}>
			<ul>
				<li>
					<Link href="/" className="title">Mis Ordenes</Link>
				</li>
				<li>
					<Link href="/mi_cuenta">Mi Cuenta</Link>
				</li>
				<li>
					<Link href='/login' >Iniciar Sesión</Link>
				</li>
				<li>
					<button onClick={() => auth.logout()} >Cerrar Sesión</button>
				</li>
			</ul>
		</div>
	);
};

export default Menu;
