import React, { useEffect, useState } from 'react';
import endPoints from '@services/api/index';
import useFetchProducts from '@hooks/useGetProducts';
import ProductItem from '@components/ProductItem';
import Paginacion from '@common/Paginacion';
import styles from '@styles/ProductList.module.scss';

const ProductList = () => {
  const PRODUCT_LIMIT = 16;
  const [products, setProducts] = useState([]);
  const [PRODUCT_OFFSET, setOffsetProducts] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await useFetchProducts(
        endPoints.products.getProducts(PRODUCT_LIMIT, PRODUCT_OFFSET)
      );
      setProducts(response.products);
      setTotalProducts(response.total);
    };

    fetchProducts();
  }, [PRODUCT_OFFSET]);

  return (
    <section className={styles['main-container']}>
      <div className={styles.ProductList}>
        {products.map((product) => (
          <ProductItem product={product} key={product.id} />
        ))}
      </div>
      {totalProducts > 0 && (
        <Paginacion
          totalItems={totalProducts}
          itemsPerPage={PRODUCT_LIMIT}
          setOffset={setOffsetProducts}
          neighbours={3}
        />
      )}
    </section>
  );
};

export default ProductList;