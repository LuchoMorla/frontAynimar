/* import ProductList from '@containers/ProductList'; */
import Head from 'next/head';
import UserSegmentation from '@containers/userSegmentation'

export default function Home() {
  return (
    <>
      <Head>
        <title>Aynimar | Home</title>
      </Head>
      <UserSegmentation />
      {/*       <ProductList /> */}
    </>
  );
}
