import { ProviderAuth } from '@hooks/useAuth';
import AppContext from '@context/AppContext';
import useInitialState from '@hooks/useInitialState';
import Header from '@components/Header';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const initialState = useInitialState();
  return (
    <ProviderAuth>
    <AppContext.Provider value={initialState}>
      <Header />
      <Component {...pageProps} />
    </AppContext.Provider>
    </ProviderAuth>
  );
}

export default MyApp;
