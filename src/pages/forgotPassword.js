import Head from 'next/head';
import React, { useRef } from 'react';
import { useAuth } from '@hooks/useAuth';
import { useRouter } from 'next/router';
import Image from 'next/image';
import logo from '@logos/logo-Aynimar.svg';
import styles from '@styles/Login.module.scss';

export default function ForgetPassword() {
  const formRef = useRef(null);

  const auth = useAuth();
  const router = useRouter(); 

  const submitHandler = (event) => {
    event.preventDefault();
    //tipamos la informacion de forma interna: y ahora la vamos a recibir con formData
    const formData = new FormData(formRef.current);
    const data = {
      email: formData.get('email-address'),
    };
    //podriamos pasar validaciones(de seguridad) para ver si cumple con el estandar de un correo etc.

      auth
      .recovery(data.email)
      .then(() => {
          router.push('/correo-enviado');
      })
      .catch((error) => {
      if (error.response?.status === 401) {
        window.alert('Usuario o contraseña incorrectos');
      } else if (error.response) {
        console.log('Algo salio mal: ' + error.response.status);
       }
      });
  };

  return (
    <div className={styles.login}>
      <Head>
        <title>Aynimar | contraseña olvidada</title>
      </Head>
      <div className={styles['login-container']}>
        <Image src={logo} width={100} height={100} className={styles.logo} alt='logo Aynimar' />
        <h1 className={styles.title}>Recuperar Contraseña</h1>

        <form action="/" ref={formRef} className={styles.form} onSubmit={submitHandler} autoComplete="on">
          <div className={styles.form} >
            <label htmlFor="email-address" className={styles.label}>Email</label>
            <input type="email" 
            id="email-address"
            name="email-address"
            autoComplete="email"
            required
            placeholder="nombre@mail.com" 
            className={styles.input} 
            />
          </div>

          <button type="submit" 
          className={(styles['primary-button'], styles['login-button'])}>
          Confirmar Correo
          </button>
        </form>
      </div>
    </div>
  );
}
