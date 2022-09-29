import { ProviderAuth } from '@hooks/useAuth';
import '@styles/tailwind.css';
import MainLayout from '@layout/MainLayout';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ProviderAuth>
        <Head>
          <title>React Shop Admin</title>
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta charSet="utf-8" />
        </Head>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </ProviderAuth>
    </>
  );
}

export default MyApp;
