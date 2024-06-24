import ProductList from '@containers/ProductList';
import Head from 'next/head';
import UserSegmentation from '@containers/userSegmentation';
import WasteList from '@containers/WasteList';
import styles from '@styles/Home.module.scss';

export default function Home() {
  return (
    <>
      <Head>
        <title>Aynimar | Home</title>
      </Head>
      <UserSegmentation />
      <h1 className={styles['recicler-title']}>Nuestros Productos</h1>
      <ProductList />
      <h1 className={styles['recicler-title']}>Vende tus Reciclables</h1>
       <WasteList />
    </>
  );
}