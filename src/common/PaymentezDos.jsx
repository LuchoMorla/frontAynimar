import { Button } from 'primereact/button';
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

import '@styles/prueba.module.scss';

export default function PaymentezDos({ userEmail, uId }) {
  const pg_sdk = useRef(null);

  const credencial = {
    environment: 'development',
    application_code: process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_CODE,
    application_key: process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_KEY,
  };

  const [saveCardText, setSaveCardText] = useState('Save Card');
  const [saveProcessing, setProcessing] = useState(false);

  const get_tokenize_data = () => {
    return {
      locale: 'es',
      user: {
        id: uId,
        email: userEmail,
      },
      configuration: {
        default_country: 'ECU',
      },
    };
  };

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (typeof PaymentGateway !== 'function') {
  //       console.error('❌ PaymentGateway no está definido. Asegúrate de haber cargado el SDK.');
  //       return;
  //     }
  //     paymentForm();
  //   }, 200);

  //   return () => clearTimeout(timer);
  // }, []);
  useEffect(() => {
  // 🔴 No inicializar si los datos no están listos
  if (!userEmail || userEmail === 'mail@vacio.com' || !uId || uId === 0) {
    console.log('🟡 PaymentezDos: Datos de usuario no listos aún. Esperando...');
    return;
  }

  const timer = setTimeout(() => {
    if (typeof PaymentGateway !== 'function') {
      console.error('❌ PaymentGateway no está definido. Asegúrate de haber cargado el SDK.');
      return;
    }
    paymentForm();
  }, 500);

  return () => clearTimeout(timer);
}, [userEmail, uId]); // ✅ Ahora depende de los datos del usuario

  useEffect(() => {
    if (!saveProcessing) {
      retrySubmit();
    }
  }, [saveProcessing]);

  const paymentForm = async () => {
    try {
      pg_sdk.current = new PaymentGateway(
        credencial.environment,
        credencial.application_code,
        credencial.application_key
      );
      await pg_sdk.current.generate_tokenize(get_tokenize_data(), '#tokenize_example', onSuccess, onError);
    } catch (err) {
      console.error('❌ Error en paymentForm:', err);
      setProcessing(false);
      setSaveCardText('Save Card');
    }
  };

  const retrySubmit = async () => {
    if (pg_sdk.current) {
      await pg_sdk.current.generate_tokenize(get_tokenize_data(), '#tokenize_example', onSuccess, onError);
    }
  };

  const onSuccess = (response) => {
    console.log(response);
    if (response?.error) {
      toast.error(response.error?.type + '. \n' + response.error?.help);
    } else if (response?.card) {
      switch (response.card?.status) {
        case 'valid':
          toast.success('✅ Tu tarjeta ha sido añadida con éxito');
          break;
        case 'pending':
          toast.warning('⏳ Tu tarjeta está pendiente ahora.');
          break;
        case 'rejected':
          toast.warning('❌ No autorizado. Intenta con otra tarjeta.');
          break;
        case 'review':
          toast.warning('🔎 El cargo está bajo revisión');
          break;
      }
    }
    setProcessing(false);
    setSaveCardText('Save Card');
  };

  const onError = (message) => {
    console.error(`❗ Formulario incompleto: ${message}`);
    setProcessing(false);
    setSaveCardText('Save Card');
  };

  const handleSaveCard = async (event) => {
    event?.preventDefault();

    try {
      if (pg_sdk.current) {
        pg_sdk.current.tokenize();
        setSaveCardText('Procesando...');
        setProcessing(true);
      } else {
        retrySubmit();
      }
    } catch (err) {
      console.error('❌ Error en handleSaveCard:', err);
    }
  };

  return (
    <main className="container mb-5 d-flex justify-content-center">
      <div id="payment_example_div" className="container">
        <div
          id="tokenize_example"
          className="Card"
          style={{ margin: 'auto', width: 'fit-content', padding: '20px 0px' }}
        ></div>
        <div className="w-fit mx-auto" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <Button id="tokenize_btn" className="w-[100%]" onClick={handleSaveCard} disabled={saveProcessing}>
            {saveCardText}
          </Button>
        </div>
      </div>
    </main>
  );
}
