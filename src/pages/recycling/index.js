import Head from 'next/head';
import React from 'react';
import Link from 'next/link';
import WasteList from '@containers/WasteList';
import styles from '@styles/Recycling.module.scss';

const recycling = () => {
  return (
    <>
      <Head>
        <title>Recycling | Aynimar</title>
      </Head>
      <div className={styles.Recycling}>
        <p>Gana dinero vendiendo tus desechos para su transformación en productos útiles. Compramos una variedad de residuos. 
          Si no encuentras lo que deseas vender o tienes algún problema. Contactanos haciendo  
          <Link href='/contact'> Click Aquí</Link>
        </p>
      </div>
      <WasteList /> 
    </>
  );
};

export default recycling;
