import React from 'react';
import endPoints from '@services/api/index';
import useFetchProducts from '@hooks/useGetProducts';
import ProductItem from '@components/ProductItem';
import styles from '@styles/ProductList.module.scss';

const ProductList = () => {
	const PRODUCT_LIMIT = 10;
	const PRODUCT_OFFSET = 0;

	const products = useFetchProducts(endPoints.products.getProducts(PRODUCT_LIMIT, PRODUCT_OFFSET));

	return (
		<section className={styles["main-container"]}>
			<div className={styles.ProductList}>
				{products.map(product => (
					<ProductItem product={product} key={product.id} />
				))}
			</div>
		</section>
	);
}

export default ProductList;
