import Head from 'next/head';
import React from 'react';
import WasteList from '@containers/WasteList';
import styles from '@styles/Recycling.module.scss';

const recycling = () => {
  return (
    <>
      <Head>
        <title>recycling | Aynimar</title>
      </Head>
      <div className={styles.Recycling}>
        <p>Gana dinero vendiendonos tu residuo para que convertirlos en productos utiles.</p>
      </div>
      <WasteList /> 
    </>
  );
};

export default recycling;
