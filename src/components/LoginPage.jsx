import React, { useRef } from 'react';
import { useAuth } from '@hooks/useAuth';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-toastify';
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
      password: formData.get('password'),
    };
    //podriamos pasar validaciones(de seguridad) para ver si cumple con el estandar de un correo etc.

    auth
      .signIn(data.email, data.password)
      .then(() => {
        toast.success('ingreso correcto!!!');
        router.push('/store');
      })
      .catch((error) => {
        if (error.response?.status === 401) {/* 
          window.alert ('Usuario o contraseña incorrectos'); */
          toast.error('Usuario o contraseña incorrectos');
        } else if (error.response) {
          toast.error('Error ' + error.response.status);
          console.log('Algo salio mal: ' + error.response.status);
        }
      });
  };

  return (
    <div className={styles['login']}>
      <div className={styles['login-container']}>
        <h1 className={styles.title}>Inicia Sesión</h1>

        <form ref={formRef} className={styles.form} onSubmit={submitHandler} autoComplete="on">
          <div className={styles.form}>
            <label htmlFor="email-address" className={styles.label}>
              Email
            </label>
            <input type="email" id="email-address" name="email-address" autoComplete="email" required placeholder="nombre@mail.com" className={styles.input} />
            {'\n'}
            <label htmlFor="password" className={styles.label}>
              Contraseña
            </label>
            <input type="password" id="password" name="password" autoComplete="current-password" required className={styles.input} placeholder="***Contraseña***" />
            {'\n'}
          </div>

          <button type="submit" className={styles['login-button']}>
            Iniciar Sesión
          </button>
        </form>
        <ul className={styles.contenedorAuhtChange}>
          <li className={styles.sigInCustomer}>
            <Link href="/signInCustomer" className={styles.linkAuthChange}>Registrate</Link>
          </li>
          <li className={styles.forgot}>
            <Link href="/forgotPassword" className={styles.linkAuthChange}>Olvidé mi Contraseña</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};