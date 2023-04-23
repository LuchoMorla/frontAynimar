import { ProviderAuth } from '@hooks/useAuth';
import Script from 'next/script';
import AppContext from '@context/AppContext';
import useInitialState from '@hooks/useInitialState';
import Layout from '@containers/Layout';
import { ToastContainer } from 'react-toastify';
import TestContext from '@context/TestContext';
import 'react-toastify/dist/ReactToastify.css';

import '../styles/globals.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { useState } from 'react';

function MyApp({ Component, pageProps }) {
  const initialState = useInitialState();
  const [order, setOrder] = useState(null);
  const [transactionID, setTransactionID] = useState(null);
  return (
    <ProviderAuth>
      <AppContext.Provider value={initialState}>
        <TestContext.Provider value={{
          order: order,
          setOrder: setOrder,
          transactionID: transactionID,
          setTransactionID: setTransactionID
        }
        }>
          <Script async src="https://cdn.paymentez.com/ccapi/sdk/payment_sdk_stable.min.js" charset="UTF-8" />
          <Script async src="https://www.googletagmanager.com/gtag/js?id=G-6S5D2T7858" />
          <Layout >
            <Component {...pageProps} />
          </Layout >
          <ToastContainer />
        </TestContext.Provider>
      </AppContext.Provider>
    </ProviderAuth>
  );
}

export default MyApp;
