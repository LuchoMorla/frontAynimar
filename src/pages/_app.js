import { ProviderAuth } from '@hooks/useAuth';
import Script from 'next/script';
import AppContext from '@context/AppContext';
import useInitialState from '@hooks/useInitialState';
import Layout from '@containers/Layout';
import 'bootstrap/dist/css/bootstrap.css';
import '../styles/globals.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; 
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';  
/* import 'bootstrap/dist/css/bootstrap.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; 
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import styles from '@styles/Layout.module.scss'; */

function MyApp({ Component, pageProps }) {
  const initialState = useInitialState();
  return (
    <ProviderAuth>
    <AppContext.Provider value={initialState}>
    <Script async src="https://cdn.paymentez.com/ccapi/sdk/payment_sdk_stable.min.js" charset="UTF-8" />
    <Script async src="https://www.googletagmanager.com/gtag/js?id=G-6S5D2T7858" />
      <Layout >
              <Component {...pageProps} />
      </Layout >
    </AppContext.Provider>
    </ProviderAuth>
  );
}

export default MyApp;
