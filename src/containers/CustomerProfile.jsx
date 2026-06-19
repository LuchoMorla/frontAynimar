import React, { useState, useEffect } from 'react';
import axios from 'axios';
import endPoints from '@services/api';
import { createCustomerByRecycler } from '@services/api/entities/customers';
import Client from '@components/Client';
import { toast } from 'react-toastify';

const clientProfile = ({ onProfileStatusChange }) => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const clientData = async () => {
    try {
      const { data: fetch } = await axios.get(endPoints.profile.clientData);
      setClient(fetch);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.warning('Probablemente necesites iniciar sesión de nuevo');
      } else if (error.response?.status === 404) {
        // Create an empty profile shell so the user can fill it in-place during checkout
        // — never redirect away, that kills the cart flow.
        try {
          await createCustomerByRecycler();
          try {
            const { data: fresh } = await axios.get(endPoints.profile.clientData);
            setClient(fresh);
          } catch { /* leave client null — form will render empty */ }
        } catch {
          toast.error('No se pudo inicializar tu perfil. Por favor recarga la página.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    clientData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCompletenessChange = (complete) => {
    setIsComplete(complete);
    if (typeof onProfileStatusChange === 'function') onProfileStatusChange(complete);
  };

  const handleUpdateSuccess = () => {
    clientData();
    setEditMode(false);
  };

  if (loading) return <p style={{ color: '#6b7280', fontSize: '14px' }}>Cargando datos de envío…</p>;

  return (
    <Client
      client={client}
      onCompletenessChange={handleCompletenessChange}
      onUpdateSuccess={handleUpdateSuccess}
      readOnly={isComplete && !editMode}
      onEdit={() => setEditMode(true)}
    />
  );
};
export default clientProfile;
