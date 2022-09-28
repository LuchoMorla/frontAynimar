import Head from 'next/head';
import React from 'react';
import Image from 'next/image';
import logo from '@logos/logo-Aynimar.svg';
import emailIcon from '@icons/email.svg';
import styles from '@styles/SendEmail.module.scss';

export default function emailHasBeenSent() {
  return (
    <div className={styles.SendEmail}>
      <Head>
        <title>Aynimar | Correo Enviado</title>
      </Head>
    <div className={styles["form-container"]}>
      <Image src={logo} alt="logo" className={styles.logo} />
      <h1 className={styles.title}>Te enviamos un mensaje a tu correo electronico!</h1>
      <p className={styles.subtitle}>Porfavor hechale un vistazo a tu bandeja de entrada y encontraras las instrucciones</p>
      <div className={styles["email-image"]}>
        <Image src={emailIcon} alt="email" />
      </div>
     {/*  <button className={(styles["primary-button"], styles["login-button"])}>Login</button> */}

      {/* <p className={styles.resend}>
        <span>Didn't receive the email?</span>
        <a href="/">Resend</a>
      </p> */}
    </div>
  </div>
  );
};