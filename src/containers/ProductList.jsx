import React, { useState } from 'react';
import endPoints from '@services/api/index';
import useGetProducts from '@hooks/useGetProducts';
import ProductItem from '@components/ProductItem';
import Paginacion from '@common/Paginacion';
import styles from '@styles/ProductList.module.scss';

const ProductList = () => {
	const PRODUCT_LIMIT = 16;
/* 	const PRODUCT_OFFSET = 0; */
	const [offsetProducts, setOffsetProducts] = useState(0);

	const products = useGetProducts(endPoints.products.getProducts(PRODUCT_LIMIT, offsetProducts), offsetProducts);
	const totalProducts = useGetProducts(endPoints.products.getProducts(10000000, 0)).length;/* 
	const totalProducts = useGetProducts(endPoints.products.getProducts(10000000,0)).length; */
	/* let totalProducts = products.length; */
	return (
		<section className={styles["main-container"]}>
			<div className={styles.ProductList}>
				{products.map(product => (
					<ProductItem product={product} key={product.id} />
				))}
			</div>
			{totalProducts > 0 && 
				<Paginacion
					totalItems={totalProducts}
					itemsPerPage={PRODUCT_LIMIT}
					setOffset={setOffsetProducts} 
					neighbours={3}>
				</Paginacion>}
		</section>
	);
}

export default ProductList;