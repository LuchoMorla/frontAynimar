import React, { useState, useEffect } from 'react';
import axios from 'axios';
import endPoints from '@services/api';
import { useRouter } from "next/router";
import { createCustomerByRecycler } from '@services/api/entities/customers';
import Client from '@components/Client';
import { toast } from 'react-toastify';

const clientProfile = ({ onProfileStatusChange }) => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const clientData = async () => {
    try {
      const { data: fetch } = await axios.get(endPoints.profile.clientData);
      setClient(fetch);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.warning('Probablemente necesites iniciar sesión de nuevo');
      } else if (error.response?.status === 404) {
        // Customer profile doesn't exist yet — create it
        try {
          await createCustomerByRecycler();
          router.push('/mi_cuenta/cliente');
        } catch (createError) {
          toast.error('No se pudo crear tu perfil. Por favor recarga la página.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    clientData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <p style={{ color: '#6b7280', fontSize: '14px' }}>Cargando datos de envío…</p>;

  return <Client client={client} onCompletenessChange={onProfileStatusChange} onUpdateSuccess={clientData} />;
};
export default clientProfile;
