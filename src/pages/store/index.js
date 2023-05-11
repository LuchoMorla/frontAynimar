import Head from 'next/head';
import Link from 'next/link';
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
          Bienvenido, aquí podrás ver nuestros productos disponibles y agregarlos al carrito para posteriormente ir a caja para el checkout, queremos hacerte saber que nos complace servirte y abastecerte de los productos que necesites, en caso de requerir algún producto que no se encuentre en nuestro catalogo nos lo puedes pedir <Link href='/contact'>haciendo click aquí</Link> y con gusto podemos encontrarlos por ti.
        </p>
      </div>
      <ProductList />
    </>
  );
}