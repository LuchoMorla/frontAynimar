import FormWaste from '@components/FormWaste';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import endPoints from '@services/api';

export default function WasteStand() {
  const router = useRouter();
  const route = [];
  const [product, setProduct] = useState({});

  useEffect(() => {
    const { id } = router.query;
    // hacemos una validacion que devuelva un return vacio en caso de que la ruta no esté disponible, así nos evitamos un error 400
    if (!router.isReady) return route;

    async function getWaste() {
      const response = await axios.get(endPoints.wastes.getProduct(id));
      setProduct(response.data);
    }
    getWaste();
  }, [router?.isReady]);

  return <FormWaste product={product} />;
}