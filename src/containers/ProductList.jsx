import React from 'react';
import endPoints from '@services/api/index';
import useFetchProducts from '@hooks/useGetProducts';
import ProductItem from '@components/ProductItem';
import deepClone from '@middleware/deepClone';
import styles from '@styles/ProductList.module.scss';

const ProductList = () => {
	const PRODUCT_LIMIT = 10;
	const PRODUCT_OFFSET = 0;

	const products = useFetchProducts(endPoints.products.getProducts(PRODUCT_LIMIT, PRODUCT_OFFSET));
	const productsToFix = deepClone(products);
	productsToFix.forEach((o) => o.price = o.price / 100);
	return (
		<section className={styles["main-container"]}>
			<div className={styles.ProductList}>
				{productsToFix.map(product => (
					<ProductItem product={product} key={product.id} />
				))}
			</div>
		</section>
	);
}

export default ProductList;
