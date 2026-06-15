import React from 'react';
import Header from '@components/Header';
import Footer from '@components/Footer';
import DeliveryAnnouncement from '@components/DeliveryAnnouncement';
import AyniNutria from '@components/AyniNutria';
import styles from '@styles/Layout.module.scss';

const Layout = ({ children }) => {
	return (
		<div className={styles.container}>
			<Header />
			<main className={styles.content}>
				{children}
			</main>
			<DeliveryAnnouncement />
			<Footer className={styles.footer} />
			<AyniNutria />
		</div>
	);
};

export default Layout;

