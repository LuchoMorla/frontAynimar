import ProductList from '@containers/ProductList';
import Head from 'next/head';
import UserSegmentation from '@containers/userSegmentation';
import WasteList from '@containers/WasteList';
import HeroSection from '@components/HeroSection';
import styles from '@styles/Home.module.scss';

export default function Home() {
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
      <ProductList />
      <h2 className={styles['recicler-title']}>Vende tus Reciclables</h2>
       <WasteList />
    </>
  );
}