import { ProviderAuth } from '@hooks/useAuth';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import AppContext from '@context/AppContext';
import { WalletProvider } from '@context/WalletContext';
import useInitialState from '@hooks/useInitialState';
import Layout from '@containers/Layout';
import TestContext from '@context/TestContext';
import * as gtag from '@gtag';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';
// ponytail: PrimeReact CSS moved to checkout.js via <Head> — saves ~300KB on every non-payment page

// Non-critical UI — loaded only after hydration, not part of the initial JS chunk.
const RewardChestModal = dynamic(
  () => import('@components/gamification/RewardChestModal'),
  { ssr: false }
);
const ToastContainer = dynamic(
  () => import('react-toastify').then((m) => ({ default: m.ToastContainer })),
  { ssr: false }
);

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

  // Sentry loads asynchronously — never blocks LCP or first paint.
  useEffect(() => {
    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
    if (!dsn) return;
    import('@sentry/browser').then(({ init, browserTracingIntegration }) => {
      init({
        dsn,
        environment: process.env.NODE_ENV || 'production',
        tracesSampleRate: 0.1,
        integrations: [browserTracingIntegration()],
        // Focus capture: checkout flow + product navigation
        tracePropagationTargets: [/aynimar\.com/, /\/checkout/, /\/store\//],
      });
    });
  }, []);

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
          </WalletProvider>
        </TestContext.Provider>
      </AppContext.Provider>
    </ProviderAuth>
  );
}

export default MyApp;
