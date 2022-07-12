import React from 'react';
import Link from 'next/link';
import styles from '@styles/Menu.module.scss';

const Menu = () => {
	return (
		<div className={styles.Menu}>
			<ul>
				<li>
					<Link href="/" className="title">Mis Ordenes</Link>
				</li>
				<li>
					<Link href="/">Mi Cuenta</Link>
				</li>
				<li>
					<Link href=''>Iniciar Sesión</Link>
				</li>
				<li>
					<Link href="/">Cerrar Sesión</Link>
				</li>
			</ul>
		</div>
	);
};

export default Menu;
