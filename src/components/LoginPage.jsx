import React, { useRef } from 'react';
import { useAuth } from '@hooks/useAuth';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Cookie from 'js-cookie';
import axios from 'axios';
import endPoints from '@services/api';
import { toast } from 'react-toastify';
import styles from '@styles/Login.module.scss';

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const formRef = useRef(null);

  const notifyTokenSet = () => {
    window.dispatchEvent(new Event('tokenSet'));
    setTimeout(() => { window.dispatchEvent(new Event('tokenSet')); }, 100);
  };

  const associateGuestCart = async () => {
    const token = Cookie.get('token');
    const guestOrderId = window.localStorage.getItem('oi');

    if (token && guestOrderId) {
      try {
        await axios.patch(
          endPoints.orders.associateOrder,
          { orderId: parseInt(guestOrderId) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return true;
      } catch (error) {
        console.error('[LoginPage] Error asociando carrito:', error.message);
        return false;
      }
    }
    return false;
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);
    const data = {
      email: formData.get('email-address'),
      password: formData.get('password'),
    };

    auth
      .signIn(data.email, data.password)
      .then(async () => {
        toast.success('¡Ingreso correcto!');
        notifyTokenSet();
        const wasCartAssociated = await associateGuestCart();
        setTimeout(() => {
          router.push(wasCartAssociated ? '/checkout' : '/store');
          setTimeout(() => { window.dispatchEvent(new Event('tokenSet')); }, 200);
        }, 300);
      })
      .catch((error) => {
        console.error('❌ Error en login:', error);
        if (error.response?.status === 401) {
          toast.error('Usuario o contraseña incorrectos');
        } else if (error.response) {
          toast.error('Error ' + error.response.status);
        } else {
          toast.error('Ocurrió un error inesperado.');
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
            <input 
              type="email" 
              id="email-address" 
              name="email-address" 
              autoComplete="email" 
              required 
              placeholder="nombre@mail.com" 
              className={styles.input} 
            />
            <label htmlFor="password" className={styles.label}>
              Contraseña
            </label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              autoComplete="current-password" 
              required 
              className={styles.input} 
              placeholder="***Contraseña***" 
            />
          </div>
          <button type="submit" className={styles['login-button']}>
            Iniciar Sesión
          </button>
        </form>
        <ul className={styles.contenedorAuhtChange}>
          <li className={styles.sigInCustomer}>
            <Link href="/signInCustomer" className={styles.linkAuthChange}>
              Regístrate
            </Link>
          </li>
          <li className={styles.forgot}>
            <Link href="/forgotPassword" className={styles.linkAuthChange}>
              Olvidé mi Contraseña
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}