import Link from 'next/link';
import styles from '@styles/NavMenu.module.scss';

const NavMenu = () => {
    return(
        <>
		<div className={styles.Menu}>
			<ul>
				<li>
					<Link href="/">Home</Link>
				</li>
				<li>
					<Link href="/recycling">Reciclar</Link>
				</li>
				<li>
					<Link href="/store">Tienda</Link>
				</li>
				<li>
					<Link href="/como-funciona" style={{ color: '#4900E4', fontWeight: '800' }}>¿Cómo funciona?</Link>
				</li>
				<li>
					<Link href="/contact">Contactanos</Link>
				</li>
				<li>
					<Link href="/blog">Blog</Link>
				</li>
				<li>
              		<Link href="/aboutUs">Sobre nosotros</Link>
            	</li>
			</ul>
		</div>
        </>
    );
};
export default NavMenu;