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
import { useState, useEffect, Component } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

// Non-critical UI — loaded only after hydration, not part of the initial JS chunk.
const RewardChestModal = dynamic(
  () => import('@components/gamification/RewardChestModal'),
  { ssr: false }
);
const ToastContainer = dynamic(
  () => import('react-toastify').then((m) => ({ default: m.ToastContainer })),
  { ssr: false }
);

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] caught:', error, info.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2>Algo salió mal</h2>
          <p>Recarga la página o intenta de nuevo en unos segundos.</p>
          <pre style={{ textAlign: 'left', fontSize: 12, color: '#888', maxWidth: 600, margin: '16px auto', whiteSpace: 'pre-wrap' }}>
            {this.state.error?.message}
          </pre>
          <button onClick={() => window.location.reload()}
            style={{ padding: '8px 24px', background: '#82427b', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 16 }}>
            Recargar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

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
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default MyApp;
