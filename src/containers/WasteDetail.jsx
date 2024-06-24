import React from 'react';
import ProductInfo from '@components/ProductInfo';
import styles from '@styles/ProductDetail.scss';
import close from '@icons/icon_close.png'

const ProductDetail = () => {
	return (
		<aside className={styles.ProductDetail}>
			<div className={styles["ProductDetail-close"]}>
				<img src={close} alt="close" />
			</div>
			<ProductInfo />
		</aside>
	);
}

export default ProductDetail;