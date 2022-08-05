import React from "react";
import Link from "next/link";

const MyAccount = () => {

    return (
        <>
        <h1>Mi Cuenta</h1>
        <div>
        <Link href='/mi_cuenta/recycler'>Mi Perfil de contribución remunerada al Recyclaje</Link>
        <Link href='/mi_cuenta/cliente'>Mi Perfil de Compras</Link>
        </div>
        </>
    );
}

export default MyAccount;