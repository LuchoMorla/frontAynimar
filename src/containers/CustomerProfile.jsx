import React, { useState } from 'react';
import axios from 'axios';
import endPoints from '@services/api';
import Client from '@components/Client';

const clientProfile = () => {
  const [client, setClient] = useState('vacio');

  const clientData = async () => {
    const { data: fetch } = await axios.get(endPoints.profile.clientData);
    setClient(fetch);
    return fetch;
  };
  if (client == 'vacio') {
    clientData().catch((error) => {
      if (error.response?.status === 401) {
        alert('Probablemente necesites iniciar sesion de nuevo');
      } else if (error.response) {
        console.log('Algo salio mal: ' + error.response.status);
      }
    });
  }

  return <Client client={client} />;
};
export default clientProfile;
