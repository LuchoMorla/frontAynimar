import Head from 'next/head';
import React from 'react';
import Link from 'next/link';
import WasteList from '@containers/WasteList';
import styles from '@styles/Recycling.module.scss';

const recycling = () => {
  return (
    <>
      <Head>
        <title>recycling | Aynimar</title>
      </Head>
      <div className={styles.Recycling}>
        <p>Gana dinero vendiendonos tu residuo para que convertirlos en productos utiles. Actualmente estamos ofreciendo
          la compra de los siguientes residuos, en caso de no encontrar el que desees comprarnos o de tener algún incomveniente, siempre
          puedes tomar contacto con nosotros en el boton Contactanos del menú o haciendo <Link href='/contact'>click aquí</Link>
        </p>
      </div>
      <WasteList /> 
    </>
  );
};

export default recycling;
