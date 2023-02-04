import React, { useRef, useContext } from 'react';
import AppContext from '@context/AppContext';
import { useAuth } from '@hooks/useAuth';
import { useRouter } from 'next/router';
import Image from 'next/image';
import logo from '@logos/logo-Aynimar.svg';
import imgCloseImage from '@assets/icons/close-eye.png';
import imgOpenImage from '@assets/icons/open-eye.png';
import styles from '@styles/PasswordRecovery.module.scss';

export default function Recovery() {
  const { state, showPassword } = useContext(AppContext);
    const formRef = useRef(null);

    const auth = useAuth();
    const router = useRouter(); 

    const query = router.query;
    const queryToken = query.token;

    const submitHandler = (event) => {
        event.preventDefault();
        const formData = new FormData(formRef.current);
        const data = {
            password: formData.get('password'),
            confirmPassword: formData.get('new-password'),
        };
        let thePassword = data.password;
        let theConfirmPassword = data.confirmPassword;
        if(thePassword.valueOf() != theConfirmPassword.valueOf()) {
          window.alert('Las contraseñas no son iguales');
        };
        if(thePassword === theConfirmPassword) {
            const token = queryToken;
            const newPassword= data.password;
            auth
            .changePassword(token, newPassword)
            .then(() => {
              window.alert('tu contraseña fue cambiada');
                router.push('/login');
            })
            .catch((error) => {
              if (error.response?.status === 401) {
                window.alert('Usuario o contraseña incorrectos');
              } else if (error.response) {
                console.log('Algo salio mal :' + error.response.status);
              }
            });
        };
      };

  return (
    <div className={styles.login}>
        <div className={styles["form-container"]}>
            <Image src={logo} alt="logo" className={styles.logo} />

        <h1 className={styles.title}>Crea tu nueva contraseña</h1>
        <p className={styles.subtitle}>Ingresa una nueva contraseña para tu cuenta</p>
        <div className={styles.formAndbuttonPasswordContainer}>
          <form action="/" ref={formRef} className={styles.form}  onSubmit={submitHandler}  >
              <label htmlFor="password" className={styles.label}>Contraseña</label>
              <input
              type={state.showingPassword == true ? "password" : "text"}
              id="password" 
              name="password" 
              autoComplete="current-password" 
              required
              className={styles.input} 
              placeholder="**********"
              />
              
              <label htmlFor="new-password" className={styles.label}>Confirma tu Contraseña</label>
              <input 
              type={state.showingPassword == true ? "password" : "text"}
              id="new-password" 
              name="new-password" 
              autoComplete="current-password" 
              required
              className={styles.input} 
              placeholder="**********"
              />
              <input type="submit" value="Confirm" className={(styles['primary-button'], styles['login-button'])} />
          </form>
          <button onClick={() => showPassword()} className={styles.buttonOpenAndCloseEye}>
            {state.showingPassword == true ? <div><Image src={imgOpenImage} />mostrar contraseña</div> : <div><Image src={imgCloseImage} />ocultar contraseña</div>}
          </button>
        </div>
        
        </div>
    </div>
  );
}
