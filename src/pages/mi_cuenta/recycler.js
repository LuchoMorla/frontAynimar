import Head from 'next/head';
import React from "react";
import RecyclerProfile from "@containers/RecyclerProfile";

const recycler = () => {
    return (
        <>
            <Head>
            <title>Aynimar | mi cuenta Recycler</title>
            </Head>
            <RecyclerProfile />
        </>
    );
};
export default recycler;