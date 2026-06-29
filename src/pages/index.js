import ProductList from '@containers/ProductList';
import Head from 'next/head';
import UserSegmentation from '@containers/userSegmentation';
import WasteList from '@containers/WasteList';
import HeroSection from '@components/HeroSection';
import styles from '@styles/Home.module.scss';

export async function getStaticProps() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';
  try {
    const res = await fetch(
      `${API}/api/${VERSION}/products?limit=15&offset=0&price_min=0&price_max=10000000&show_shop=true`
    );
    const data = await res.json();
    return {
      props: { initialProducts: Array.isArray(data) ? data : [] },
      revalidate: 120,
    };
  } catch {
    return { props: { initialProducts: [] }, revalidate: 30 };
  }
}

export default function Home({ initialProducts = [] }) {
  return (
    <>
      <Head>
        <title>Aynimar | Marketplace Sostenible — Paga al recibir en Ecuador</title>
        <meta name="description" content="Compra productos nuevos e importados con pago contra entrega en todo Ecuador. Financia tus compras reciclando. Economía circular real." />
        <link rel="canonical" href="https://www.aynimar.com/" />
        <meta property="og:title" content="Aynimar | Marketplace Sostenible" />
        <meta property="og:description" content="Compra con pago contra entrega en Ecuador y financia reciclando." />
        <meta property="og:url" content="https://www.aynimar.com/" />
        <meta property="og:type" content="website" />
      </Head>
      <HeroSection />
      <UserSegmentation />
      <h2 className={styles['recicler-title']}>Nuestros Productos</h2>
      <ProductList initialProducts={initialProducts} />
      <h2 className={styles['recicler-title']}>Vende tus Reciclables</h2>
      <WasteList />
    </>
  );
}