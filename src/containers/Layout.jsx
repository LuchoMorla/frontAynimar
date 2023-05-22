import React from 'react';
import Header from '@components/Header';
import Footer from '@components/Footer';
import styles from '@styles/Layout.module.scss';

const Layout = ({ children }) => {
	return (
		<div className={styles.container}>
			<Header />
			<main className={styles.content}>
				{children}
			</main>		
			<Footer className={styles.footer} />
		</div>
	);
}

export default Layout;
