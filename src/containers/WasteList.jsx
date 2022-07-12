/* import React from 'react';
import ProductItem from '@components/ProductItem';
import useGetProducts from '@hooks/useGetProducts';
import styles from '@styles/ProductList.module.scss';

const API = 'http://localhost:8080/api/v1/wastes';

const WasteList = () => {
	const wastes = useGetProducts(API);

	return (
		<section className={styles["main-container"]}>
			<div className={styles.ProductList}>
				{wastes.map(waste => (
					<ProductItem Product={waste} key={waste.id} />
				))}
			</div>
		</section>
	);
}

export default WasteList; */