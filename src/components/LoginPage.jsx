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

  // Función para notificar que el token fue establecido
  const notifyTokenSet = () => {
    console.log('🔔 Disparando evento tokenSet');
    
    // Disparar evento inmediatamente
    window.dispatchEvent(new Event('tokenSet'));
    
    // También disparar después de un pequeño delay por si acaso
    setTimeout(() => {
      window.dispatchEvent(new Event('tokenSet'));
      console.log('🔔 Segundo disparo de tokenSet');
    }, 100);
  };

  // Función para asociar el carrito. Devuelve 'true' si había un carrito para asociar.
  const associateGuestCart = async () => {
    const token = Cookie.get('token');
    const guestOrderId = window.localStorage.getItem('oi');

    console.log('🔗 Verificando asociación de carrito:', { token: !!token, guestOrderId });

    if (token && guestOrderId) {
      try {
        console.log('🔗 Asociando carrito de invitado:', guestOrderId);
        await axios.patch(
          endPoints.orders.associateOrder,
          { orderId: parseInt(guestOrderId) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(`✅ Carrito de invitado #${guestOrderId} asociado con éxito.`);
        
        // NO eliminamos el 'oi' aquí. Devolvemos true para la redirección.
        return true;
        
      } catch (error) {
        console.error('❌ Error al asociar el carrito de invitado:', error);
        return false;
      }
    }
    
    // No había carrito de invitado que asociar.
    console.log('ℹ️ No hay carrito de invitado para asociar');
    return false;
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);
    const data = {
      email: formData.get('email-address'),
      password: formData.get('password'),
    };

    console.log('🚀 Iniciando proceso de login...');

    auth
      .signIn(data.email, data.password)
      .then(async () => {
        console.log('✅ Login exitoso, token establecido');
        toast.success('¡Ingreso correcto!');
        
        // Notificar inmediatamente que el token fue establecido
        notifyTokenSet();
        
        // Intentar asociar carrito de invitado
        const wasCartAssociated = await associateGuestCart();
        
        console.log('🎯 Preparando redirección...', { wasCartAssociated });
        
        // Pequeño delay antes de redirigir para asegurar que el Header detecte la autenticación
        setTimeout(() => {
          if (wasCartAssociated) {
            console.log('🛒 Redirigiendo a checkout (había carrito)');
            router.push('/checkout');
          } else {
            console.log('🏪 Redirigiendo a tienda (sin carrito)');
            router.push('/store');
          }
          
          // Disparar evento adicional después de la redirección
          setTimeout(() => {
            window.dispatchEvent(new Event('tokenSet'));
            console.log('🔔 Evento tokenSet post-redirección');
          }, 200);
          
        }, 300); // Delay de 300ms para dar tiempo al Header
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