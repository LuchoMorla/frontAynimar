import { ProviderAuth } from '@hooks/useAuth';
import AppContext from '@context/AppContext';
import useInitialState from '@hooks/useInitialState';
import Layout from '@containers/Layout';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const initialState = useInitialState();
  return (
    <ProviderAuth>
    <AppContext.Provider value={initialState}>
      <Layout >
              <Component {...pageProps} />
      </Layout>
    </AppContext.Provider>
    </ProviderAuth>
  );
}

export default MyApp;
