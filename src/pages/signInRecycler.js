import Head from "next/head";
import React from "react";
import SignUpRecycler from "@components/SignUpRecycler";

const signInRecycler = () => {
    return (
      <>
        <Head>
          <title>Registrarse | Aynimar</title>
        </Head>
        <SignUpRecycler />
      </>
    );
  };
  
  export default signInRecycler;