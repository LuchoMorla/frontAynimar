import React, { useRef } from 'react';
import { useAuth } from '@hooks/useAuth' 
import { useRouter } from 'next/router';
import Image from 'next/image';
import logo from '@logos/logo-Aynimar.svg'
import styles from '@styles/Login.module.scss';

export default function LoginPage() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const auth = useAuth();
  const router = useRouter(); 

  const submitHandler = () => {
/*     event.preventDefault(); */
    //tipamos la informacion de forma interna:
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    //podriamos pasar validaciones(de seguridad) para ver si cumple con el estandar de un correo etc.

    auth
    .signIn(email, password)
    .then(() => {
      console.log('Login sucess');
        router.push('/');
    })
    .catch((error) => {
      if (error.response?.status === 401) {
        alert('Usuario o contraseña incorrectos');
      } else if (error.response) {
        console.log('Algo salio mal :' + error.response.status);
      }
    });
  };

  return (
    <div className={styles.login}>
      <div className={styles['login-container']}>
        <Image src={logo} width={100} height={100} className={styles.logo}/>
        <h1 className={styles.title}>Mi cuenta</h1>

        <form action="/" className={styles.form} onSubmit={submitHandler} autoComplete="on">
          <div className={styles.form} >
            <label htmlFor="email-address" className={styles.label}>Email</label>
            <input type="email" 
            id="email-address"
            name="email"
            autoComplete="email"
            required
            placeholder="nombre@mail.com" 
            className={styles.input} 
            ref={emailRef} />
           {'\n'}
            <label htmlFor="password" className={styles.label}>Contraseña</label>
            <input type="password" 
            id="password" 
            autoComplete="current-password" 
            required
            className={styles.input} 
            placeholder="***Contraseña***"
            ref={passwordRef} />
            {'\n'}
          </div>

          <button type="submit" 
          className={(styles['primary-button'], styles['login-button'])}>
          Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}
