import { ProviderAuth } from '@hooks/useAuth';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import AppContext from '@context/AppContext';
import { WalletProvider } from '@context/WalletContext';
const RewardChestModal = dynamic(() => import('@components/gamification/RewardChestModal'), { ssr: false });
import useInitialState from '@hooks/useInitialState';
import Layout from '@containers/Layout';
import { ToastContainer } from 'react-toastify';
import TestContext from '@context/TestContext';
import * as gtag from '@gtag';
import { useRouter } from 'next/router';
import { useState, useEffect, Component } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';
// PrimeReact CSS moved to checkout.js — only loads on /checkout, not on every page

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, componentStack: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] caught:', error, info.componentStack);
    this.setState({ componentStack: info.componentStack });
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
          {this.state.componentStack && (
            <pre style={{ textAlign: 'left', fontSize: 11, color: '#bbb', maxWidth: 600, margin: '8px auto', whiteSpace: 'pre-wrap', borderTop: '1px solid #eee', paddingTop: 8 }}>
              {this.state.componentStack}
            </pre>
          )}
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
      // Guard: window.gtag may not be loaded yet (GA script is async)
      if (typeof window.gtag === 'function') gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  // When a new service worker takes over (skipWaiting:true), reload immediately
  // so stale JS chunks from the old SW are never mixed with new ones.
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    const reload = () => window.location.reload();
    navigator.serviceWorker.addEventListener('controllerchange', reload);
    return () => navigator.serviceWorker.removeEventListener('controllerchange', reload);
  }, []);

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
              {/* GTM — lazyOnload: fires during browser idle, maximizes TBT budget */}
              <Script
                id="gtm-init"
                strategy="lazyOnload"
                dangerouslySetInnerHTML={{ __html:
                  `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-M93VNFW6');`
                }}
              />
              {/* Paymentez — afterInteractive: only needed on checkout, not on first paint */}
              <Script strategy="afterInteractive" src="https://cdn.paymentez.com/ccapi/sdk/payment_sdk_stable.min.js" />
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
