import { ProviderAuth } from '@hooks/useAuth';
import Script from 'next/script';
import AppContext from '@context/AppContext';
import useInitialState from '@hooks/useInitialState';
import Layout from '@containers/Layout';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const initialState = useInitialState();
  return (
    <ProviderAuth>
    <AppContext.Provider value={initialState}>
    <Script async src="https://www.googletagmanager.com/gtag/js?id=G-6S5D2T7858" />
    <Script id="google-analytics" strategy="afterInteractive" >
      {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date()); 
      gtag('config', 'G-6S5D2T7858');
      `}
      </Script>
      <Layout >
              <Component {...pageProps} />
      </Layout>
    </AppContext.Provider>
    </ProviderAuth>
  );
}

export default MyApp;
