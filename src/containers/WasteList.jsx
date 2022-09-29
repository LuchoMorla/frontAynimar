import React from 'react';
import endPoints from '@services/api/index';
import useFetchWastes from '@hooks/useGetWastes';
import WasteItem from '@components/WasteItem';
import deepCopy from '@middleware/deepClone';
import styles from '@styles/ProductList.module.scss';


const WasteList = () => {
	const PRODUCT_LIMIT = 10;
	const PRODUCT_OFFSET = 0;

	const wastes = useFetchWastes(endPoints.wastes.getProducts(PRODUCT_LIMIT, PRODUCT_OFFSET));
	const wastesToFix = deepCopy(wastes);
	wastesToFix.forEach((o) => o.price = o.price / 100);
	return (
		<section className={styles["main-container"]}>
			<div className={styles.ProductList}>
				{wastesToFix.map(waste => (
					<WasteItem waste={waste} key={waste.id} />
				))}
			</div>
		</section>
	);
}

export default WasteList;