import React, { useRef } from "react";
import Image from 'next/image';
import logo from '@logos/logo-Aynimar.svg'
import styles from '@styles/Login.module.scss';

const SignUp = () => {
  const userName = useRef(null);
  const lastName = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const submitHandler = (event) => {
    event.preventDefault();

    const name = userName.current.value;
    const apellido = lastName.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const data = {
      name,
      apellido,
      email,
      password
    }

    console.log(data);
  };

    return (
      <div className={styles.login}>
      <div className={styles['login-container']}>
        <Image src={logo} width={100} height={100} className={styles.logo}/>
        <h1 className={styles.title}>Registro de cliente</h1>

        <form action="/" className={styles.form} onSubmit={submitHandler} autoComplete="on">
          <div className={styles.form} >
            <label htmlFor="name"className={styles.label}>Nombre/s</label>
            <input type="text"
            autoComplete="name"
            name="name"
            id="name"
            required
            placeholder="Inés"
            className={styles.input}
            ref={userName} 
            />
            {'\n'}
            <label htmlFor="last-name" className={styles.label} >Apellido/s</label>
            <input type="text"
            autoComplete="family-name"
            name="last-name"
            id="last-name"
            required
            placeholder="Esario Lopez Khe"
            className={styles.input}
            ref={lastName} 
            />
            {'\n'}
            <label htmlFor="email-address" className={styles.label}>Email</label>
            <input type="email" 
            id="email-address"
            name="email"
            autoComplete="email"
            required
            placeholder="nombre@mail.com" 
            className={styles.input} 
            ref={emailRef} />
           {'\n'}
            <label htmlFor="password" className={styles.label}>Contraseña</label>
            <input type="password" 
            id="password" 
            required
            className={styles.input} 
            placeholder="***Contraseña***"
            ref={passwordRef} />
            {'\n'}
          </div>

          <button type="submit" 
          className={(styles['primary-button'], styles['login-button'])}>
          Registrarse
          </button>
        </form>
      </div>
    </div>
    );
};

export default SignUp;