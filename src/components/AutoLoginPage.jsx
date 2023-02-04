import React from 'react';
import { useAuth } from '@hooks/useAuth';
import { useRouter } from 'next/router';
/* import Image from 'next/image';
 import logo from '@logos/logo-Aynimar.svg' */
/* import styles from '@styles/Login.module.scss';   */

export default function AutoLoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const query = router.query;
  const token = query.token;
  setTimeout(() => {
    if (token !== null) {
            auth
            .autoSignIn(token)
            .then(() => {
                router.push('/');
            })
            .catch((error) => {
              if (error.response?.status === 401) {
                window.alert('Usuario o contraseña incorrectos');
              } else if (error.response) {
                console.log('Algo salio mal :' + error.response.status);
              }
            });
        }
      }, 3000);

  return <></>;
};