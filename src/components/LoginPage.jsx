import React, { useRef } from 'react';
import { useAuth } from '@hooks/useAuth';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@logos/logo-Aynimar.svg';
import styles from '@styles/Login.module.scss';

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter(); 

  const formRef = useRef(null);

  const submitHandler = (event) => {
    event.preventDefault();
    //tipamos la informacion de forma interna: y ahora la vamos a recibir con formData
    const formData = new FormData(formRef.current);
    const data = {
      email: formData.get('email-address'),
      password: formData.get('password')
    };
    //podriamos pasar validaciones(de seguridad) para ver si cumple con el estandar de un correo etc.

      auth
      .signIn(data.email, data.password)
      .then(() => {/* 
        console.log('Login sucess'); */
        router.reload();
        router.push('/');
      })
      .catch((error) => {
      if (error.response?.status === 401) {
        window.alert('Usuario o contraseña incorrectos');
      } else if (error.response) {
        console.log('Algo salio mal: ' + error.response.status);
       };
      });
  };

  return (
    <div className={styles.login}>
      <div className={styles['login-container']}>
        <Image src={logo} width={100} height={100} className={styles.logo} alt='logo Aynimar'/>
        <h1 className={styles.title}>Mi cuenta</h1>

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
           {'\n'}
            <label htmlFor="password" className={styles.label}>Contraseña</label>
            <input type="password" 
            id="password" 
            name="password" 
            autoComplete="current-password" 
            required
            className={styles.input} 
            placeholder="***Contraseña***"
            />
            {'\n'}
          </div>

          <button type="submit" 
          className={(styles['primary-button'], styles['login-button'])}>
          Iniciar Sesión
          </button>
        </form>
        <Link href="/forgotPassword">Olvide mi Contraseña</Link>
      </div>
    </div>
  );
}
