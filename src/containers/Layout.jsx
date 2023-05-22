import React from 'react';
import Header from '@components/Header';
import Footer from '@components/Footer';
import styles from '@styles/Layout.module.scss';

const Layout = ({ children }) => {
	return (
		<div className="Layout">
			<Header />
			<div className={styles.content}>
				{children}
			</div>		
			<Footer />
		</div>
	);
}

export default Layout;
