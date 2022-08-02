import React, { useRef } from 'react';
import { useAuth } from '@hooks/useAuth' 
import { useRouter } from 'next/router';
import Image from 'next/image';
import logo from '@logos/logo-Aynimar.svg'
import styles from '@styles/PasswordRecovery.module.scss';

export default function Recovery() {

  return (
    <div className={styles.login}>
        <div className={styles["form-container"]}>
            <Image src={logo} alt="logo" className={styles.logo} />

        <h1 className={styles.title}>Crea tu nueva contraseña</h1>
        <p className={styles.subtitle}>Ingresa una nueva contraseña para tu cuenta</p>

        <form action="/" className={styles.form} >
            <label htmlFor="password" className={styles.label}>Contraseña</label>
            <input
            type="password" 
            id="password" 
            placeholder="*********" 
            className={(styles.input, styles['input-password'])} 
            />

            <label htmlFor="new-password" className={styles.label}>Contraseña</label>
            <input type="password" 
            id="new-password" 
            placeholder="*********" 
            className={(styles.input, styles['input-password'])} 
            />

            <input type="submit" value="Confirm" className={(styles['primary-button'], styles['login-button'])} />
        </form>
        </div>
    </div>
  );
}
