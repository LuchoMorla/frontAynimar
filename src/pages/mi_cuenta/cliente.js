import Head from 'next/head';
import React from "react";
import CustomerProfile from "@containers/CustomerProfile";

const recycler = () => {
    return (
        <>
            <Head>
                <title>Aynimar | mi cuenta cliente</title>
            </Head>
            <CustomerProfile />        
        </>
    );
};
export default recycler;