import React from 'react';
import endPoints from '@services/api/index'
import useFetch from '@hooks/useGetProducts';
import WasteItem from '@components/WasteItem';
import styles from '@styles/ProductList.module.scss';


const WasteList = () => {
	const PRODUCT_LIMIT = 10;
	const PRODUCT_OFFSET = 0;

	const wastes = useFetch(endPoints.wastes.getProducts(PRODUCT_LIMIT, PRODUCT_OFFSET));
    console.log(wastes);
	return (
		<section className={styles["main-container"]}>
			<div className={styles.ProductList}>
				{wastes.map(product => (
					<WasteItem product={product} key={product.id} />
				))}
			</div>
		</section>
	);
}

export default WasteList;