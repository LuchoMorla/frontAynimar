import React from "react";
import Link from "next/link";
import styles from '@styles/MyAccounts.module.scss'

const MyAccount = () => {

    return (
        <div className={styles['accounts-container']}>
            <h1 className={styles.title}>Mi Cuenta</h1>
            <div className={styles.accounts}>
                <Link href='/mi_cuenta/recycler'>Mi Perfil de contribución remunerada al Recyclaje</Link>
                <Link href='/mi_cuenta/cliente'>Mi Perfil de Compras</Link>
            </div>
        </div>
    );
}

export default MyAccount;