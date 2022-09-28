import Head from 'next/head';
import ProductList from '@containers/ProductList';
import styles from '@styles/Recycling.module.scss';

export default function Home() {
  return (
    <>
      <Head>
        <title>Aynimar | Tienda</title>
      </Head>
      <div className={styles.Recycling}>
        <p>
          Bienvenido, este servicio estará disponible próximamente...
        </p>
      </div>
      <ProductList />
    </>
  );
}