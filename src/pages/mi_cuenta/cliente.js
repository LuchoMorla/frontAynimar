import Head from 'next/head';
import React from "react";
import CustomerProfile from "@containers/CustomerProfile";
import styles from '@styles/MyAccount.module.scss';

const recycler = () => {
    return (
        <>
            <Head>
                <title>Aynimar | mi cuenta cliente</title>
            </Head>
            <h1 className={styles.title}>Mi Cuenta de Compras</h1>
            <CustomerProfile />        
        </>
    );
};
export default recycler;