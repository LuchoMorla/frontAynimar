import Head from 'next/head';
import FormProduct from '@components/FormProduct';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import endPoints from '@services/api';

export default function ProductStand() {
  const [product, setProduct] = useState({});
  const router = useRouter();

  useEffect(() => {
    const { id } = router.query;
      // hacemos una validacion que devuelva un return vacio en caso de que la ruta no esté disponible, así nos evitamos un error 400
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
  </>

  );
}