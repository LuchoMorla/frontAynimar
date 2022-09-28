import Head from 'next/head';
import React from 'react';
import MyAccount from '@containers/MyAccount';

const myAccount = () => {
  return (
    <>
      <Head>
        <title>Aynimar | Mi Cuenta</title>
      </Head>
      <MyAccount />
    </>
  );
};

export default myAccount;
