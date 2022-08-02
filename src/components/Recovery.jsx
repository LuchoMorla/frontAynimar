import React, { useRef } from 'react';
import { useAuth } from '@hooks/useAuth' 
import { useRouter } from 'next/router';
import Image from 'next/image';
import logo from '@logos/logo-Aynimar.svg'
import styles from '@styles/PasswordRecovery.module.scss';

export default function Recovery() {
    const formRef = useRef(null);

    const auth = useAuth();
    const router = useRouter(); 

    const submitHandler = (event) => {
        event.preventDefault();
        const formData = new FormData(formRef.current);
        const data = {
            password: formData.get('password'),
            confirmPassword: formData.get('new-password')
        }
        let thePassword = data.password;
        let theConfirmPassword = data.confirmPassword;
        if(thePassword !== theConfirmPassword) {
            alert('Las contraseñas no son iguales');
        }
        if(thePassword === theConfirmPassword) {
            console.log('ok the password is: ' + data.password);
        }
      };

  return (
    <div className={styles.login}>
        <div className={styles["form-container"]}>
            <Image src={logo} alt="logo" className={styles.logo} />

        <h1 className={styles.title}>Crea tu nueva contraseña</h1>
        <p className={styles.subtitle}>Ingresa una nueva contraseña para tu cuenta</p>

        <form action="/" ref={formRef} className={styles.form}  onSubmit={submitHandler}  >
            <label htmlFor="password" className={styles.label}>Contraseña</label>
            <input
            type="password" 
            id="password" 
            name="password" 
            autoComplete="current-password" 
            required
            className={styles.input} 
            placeholder="**********"
            />

            <label htmlFor="new-password" className={styles.label}>Confirma tu Contraseña</label>
            <input 
            type="password" 
            id="new-password" 
            name="new-password" 
            autoComplete="current-password" 
            required
            className={styles.input} 
            placeholder="**********"
            />

            <input type="submit" value="Confirm" className={(styles['primary-button'], styles['login-button'])} />
        </form>
        </div>
    </div>
  );
}
