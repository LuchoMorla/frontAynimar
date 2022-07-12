import React, { useRef } from 'react';
import styles from '@styles/Login.module.scss';
import Image from 'next/image';
import logo from '@logos/logo-Aynimar.svg'

export default function LoginPage() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const submitHandler = (event) => {
    event.preventDefault();
    //tipamos la informacion de forma interna:
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    //podriamos pasar validaciones(de seguridad) para ver si cumple con el estandar de un correo etc
    //para este punto solo vamos a mostrar los datos por consola:
    console.log(email, password);
  };

  return (
    <div className={styles.login}>
      <div className={styles['login-container']}>
        <Image src={logo} width={100} height={100} className={styles.logo}/>
        <h1 className={styles.title}>Mi cuenta</h1>

        <form action="/" className={styles.form} onSubmit={submitHandler}>
          <div className={styles.form} >
            <label htmlFor="name" className={styles.label}>Nombre</label>
            <input type="text" 
            id="name" placeholder="Nombre" className={(styles.input, styles['input-name'])} 
            />
            {'\n'}
            <label htmlFor="email-address" className={styles.label}>Email</label>
            <input type="email" 
            id="email-address"
            name="email"
            autoComplete="email"
            required
            placeholder="nombre@mail.com" 
            className={(styles.input, styles['input-email'])} 
            ref={emailRef} />
           {'\n'}
            <label htmlFor="password" className={styles.label}>Contraseña</label>
            <input type="password" 
            id="password" 
            autoComplete="current-password" 
            required
            className={(styles.input, styles['input-password'])} 
            placeholder="***Contraseña***"
            ref={passwordRef} />
            {'\n'}
          </div>

          <input type="submit" value="Iniciar Sesión" 
          className={styles['primary-button'], styles['login-button']} />
        </form>
      </div>
    </div>
  );
}
