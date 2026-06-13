import Head from 'next/head';
import FormProduct from '@components/FormProduct';
import ProductReviews from '@components/ProductReviews';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import endPoints from '@services/api';

export default function ProductStand() {
  const [product, setProduct] = useState({});
  const router = useRouter();

  useEffect(() => {
    const { id } = router.query;
    if (!router.isReady) return;
    async function getProduct() {
      const response = await axios.get(endPoints.products.getProduct(id));
      setProduct(response.data);
    }
    getProduct();
  }, [router?.isReady]);

  return (
    <>
      <Head>
        <title>Aynimar | {product.name}</title>
      </Head>
      <FormProduct product={product} />
      {product.id && (
        <ProductReviews productId={product.id} businessId={product.businessId ?? null} />
      )}
    </>
  );
}