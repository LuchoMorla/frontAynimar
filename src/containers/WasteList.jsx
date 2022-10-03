import React from 'react';
import endPoints from '@services/api/index'
import useFetchWastes from '@hooks/useGetWastes';
import WasteItem from '@components/WasteItem';
import styles from '@styles/ProductList.module.scss';


const WasteList = () => {
	const PRODUCT_LIMIT = 10;
	const PRODUCT_OFFSET = 0;

	const wastes = useFetchWastes(endPoints.wastes.getProducts(PRODUCT_LIMIT, PRODUCT_OFFSET));

	return (
		<section className={styles["main-container"]}>
			<div className={styles.ProductList}>
				{wastes.map(waste => (
					<WasteItem waste={waste} key={waste.id} />
				))}
			</div>
		</section>
	);
}

export default WasteList;