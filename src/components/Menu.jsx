import React, {useState} from 'react';
import Link from 'next/link';
import { useAuth } from '@hooks/useAuth';
import styles from '@styles/Menu.module.scss';

const Menu = () => {
	const auth = useAuth();
	const [isModalOpen, setIsModalOpen] = useState(true);

	const closeModal = () => {
		console.log('Cerrando el Modal');
		setIsModalOpen(false);
		// Aquí puedes agregar lógica adicional para cerrar el modal si es necesario
	  };

	return (
		<div className={styles.Menu} style={{ display: isModalOpen ? 'block' : 'none' }}>
			{/** Botón para cerrar el Modal en la pte. superior izq. */}
			<button className={styles.closeButton} onClick={closeModal}>
        		X
		    </button>

			<ul>
				<li>
					<Link href="/mi_cuenta/orders" className="title">Mis Ordenes</Link>
				</li>
				<li>
					<Link href="/mi_cuenta">Mi Cuenta</Link>
				</li>
{/* 				<li>
					<Link href='/login' >Iniciar Sesión</Link>
				</li> */}
				<li>
					<button onClick={() => auth.logout()} >Cerrar Sesión</button>
				</li>
			</ul>
		</div>
	);
};

export default Menu;