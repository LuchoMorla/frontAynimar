import React, { useState } from 'react';
import axios from 'axios';
import endPoints from '@services/api';
import { useRouter } from "next/router";
import { createCustomerByRecycler } from '@services/api/entities/customers';
import Client from '@components/Client';

const clientProfile = () => {
  const [client, setClient] = useState('vacio');
  const router = useRouter(); 

  const clientData = async () => {
    const { data: fetch } = await axios.get(endPoints.profile.clientData);
    setClient(fetch);
    return fetch;
  };
  if (client == 'vacio') {
    clientData()
    .catch((error) => {
      if (error.response?.status === 401) {
        window.alert('Probablemente necesites iniciar sesion de nuevo');
      } else if (error.response) {
        console.log('Algo salio mal: ' + error.response.status);
      }
    });
  }
  if(client == null) {
    const ejecutar = async () => {
      await createCustomerByRecycler()
    }
    ejecutar()
      .then(() => {
        router.push('/mi_cuenta/cliente');
      })
      .catch((error) => {
        if (error.response) {
          window.alert('cbci => Algo salio mal: ' + error.response.status + ' presiona aceptar mientras lo arreglamos, si no sé soluciona despues de refrescar la pagina recuerda que puedes contactarnos ;).');
          router.reload(window.location.pathname);
        }
      });
  }

  return <Client client={client} />;
};
export default clientProfile;
