import Head from 'next/head';
import React from "react";
import CustomerOrders from "@containers/CustomerOrders";

const customerOrders = () => {
    return (
        <>
            <Head>
                <title>Aynimar | Ordenes</title>
            </Head>
            <CustomerOrders />        
        </>
    );
};
export default customerOrders;