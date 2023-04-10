import React from 'react';
import Link from 'next/link';
import Script from 'next/script';
import styles from '@styles/Header.module.scss';

const Footer = () => {

	return (
		<>
		<nav className={styles.Nav}>
			<div className={styles['navbar-left']}>
				<ul>
					<li>
                        <div id="widgets"></div>
                        <Script src='https://www.hazvaca.com/project/widgets_code/s/red/3408'
                                type='text/javascript'></Script>
					</li>
					<li>
						<Link href="/recycling">Reciclar</Link>
					</li>
					<li>
						<Link href="/store">Tienda</Link>
					</li>
					<li>
						<Link href="/contact">Contactanos</Link>
					</li>
					<li>
						<Link href="/">Blog</Link>
					</li>
				</ul>
			</div>
			<div className={styles['navbar-right']}>
				<ul>
					<li>			
					</li>
					<li>
					</li>
					<li>
					</li>
				</ul>
			</div>
		</nav>
	</>
	);
};

export default Footer;