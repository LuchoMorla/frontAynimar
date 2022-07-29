import Head from "next/head";
import React from "react";
import SignUpCustomer from "@components/SignUpCustomer";

const signInCustomer = () => {
    return (
      <>
        <Head>
          <title>Registrarse | Aynimar</title>
        </Head>
        <SignUpCustomer />
      </>
    );
  };
  
  export default signInCustomer;