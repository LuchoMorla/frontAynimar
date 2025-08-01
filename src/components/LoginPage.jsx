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

  // Función para asociar el carrito. Devuelve 'true' si había un carrito para asociar.
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
        console.log(`Carrito de invitado #${guestOrderId} asociado con éxito.`);
        
        // NO eliminamos el 'oi' aquí. Devolvemos true para la redirección.
        return true;
        
      } catch (error) {
        console.error('Error al asociar el carrito de invitado:', error);
        return false;
      }
    }
    
    // No había carrito de invitado que asociar.
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
        
        const wasCartAssociated = await associateGuestCart();
        
        if (wasCartAssociated) {
          // Si había un carrito, lo más probable es que el usuario quiera pagar.
          router.push('/checkout');
        } else {
          // Si no había carrito, lo enviamos a la tienda.
          router.push('/store');
        }
      })
      .catch((error) => {
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
    // ... Tu JSX no cambia
    <div className={styles['login']}>
      <div className={styles['login-container']}>
        <h1 className={styles.title}>Inicia Sesión</h1>
        <form ref={formRef} className={styles.form} onSubmit={submitHandler} autoComplete="on">
          <div className={styles.form}>
            <label htmlFor="email-address" className={styles.label}>
              Email
            </label>
            <input type="email" id="email-address" name="email-address" autoComplete="email" required placeholder="nombre@mail.com" className={styles.input} />
            <label htmlFor="password" className={styles.label}>
              Contraseña
            </label>
            <input type="password" id="password" name="password" autoComplete="current-password" required className={styles.input} placeholder="***Contraseña***" />
          </div>
          <button type="submit" className={styles['login-button']}>
            Iniciar Sesión
          </button>
        </form>
        <ul className={styles.contenedorAuhtChange}>
          <li className={styles.sigInCustomer}>
            <Link href="/signInCustomer" className={styles.linkAuthChange}>Regístrate</Link>
          </li>
          <li className={styles.forgot}>
            <Link href="/forgotPassword" className={styles.linkAuthChange}>Olvidé mi Contraseña</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}