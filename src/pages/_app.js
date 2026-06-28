import { ProviderAuth } from '@hooks/useAuth';
import Script from 'next/script';
import AppContext from '@context/AppContext';
import { WalletProvider } from '@context/WalletContext';
import RewardChestModal from '@components/gamification/RewardChestModal';
import useInitialState from '@hooks/useInitialState';
import Layout from '@containers/Layout';
import { ToastContainer } from 'react-toastify';
import TestContext from '@context/TestContext';
import { SpeedInsights } from '@vercel/speed-insights/react';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import * as gtag from '@gtag';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  const initialState = useInitialState();
  const [order, setOrder] = useState(null);
  const [transactionID, setTransactionID] = useState(null);

  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

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
          <WalletProvider>
            <Script async src="https://cdn.paymentez.com/ccapi/sdk/payment_sdk_stable.min.js" charset="UTF-8" />
            <Layout>
              <Component {...pageProps} />
            </Layout>
            <RewardChestModal />
            <ToastContainer />
            <SpeedInsights />
          </WalletProvider>
        </TestContext.Provider>
      </AppContext.Provider>
    </ProviderAuth>
  );
}

export default MyApp;
