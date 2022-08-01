import React, { useRef } from "react";
import Image from 'next/image';
import logo from '@logos/logo-Aynimar.svg';
import { addRecyclers } from '@services/api/entities';
import styles from '@styles/Login.module.scss';

const SignUp = () => {
  const nameReff = useRef(null);
  const lastNameReff = useRef(null);
  const ciReff = useRef(null);
  const phoneReff = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const submitHandler = (event) => {
    event.preventDefault();

    const name = nameReff.current.value;
    const lastName = lastNameReff.current.value;
    const identityNumber = ciReff.current.value;
    const phone = phoneReff.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const data = {
      name,
      lastName,
      identityNumber,
      phone,
      email,
      password
    }

    console.log(data);
    addRecyclers(data).then(() => {
      console.log(response);
    });
  };

    return (
      <div className={styles.login}>
      <div className={styles['login-container']}>
        <Image src={logo} width={100} height={100} className={styles.logo}/>
        <h1 className={styles.title}>Inscripción</h1>

        <form action="/" className={styles.form} onSubmit={submitHandler} autoComplete="on">
          <div className={styles.form} >
            <label htmlFor="name" className={styles.label}>Nombre/s</label>
            <input type="text"
            autoComplete="name"
            name="name"
            id="name"
            required
            placeholder="Inés"
            className={styles.input}
            ref={nameReff}  
            />
            {'\n'}
            <label htmlFor="last-name" className={styles.label}>Apellido/s</label>
            <input type="text"
            autoComplete="family-name"
            name="last-name"
            id="last-name"
            required
            placeholder="Esario Lopez Khe"
            className={styles.input} 
            ref={lastNameReff}
            />
            {'\n'}
            <label htmlFor="identity-number" className={styles.label}>Numero de cedula, identidad o CI</label>
            <input type="text"
            name="identity-number"
            id="identity-number"
            required
            placeholder="073176549-1"
            className={styles.input} 
            ref={ciReff}
            />
            {'\n'}
            <label htmlFor="phone" className={styles.label}>Numero de contacto, Celular o Whatsapp</label>
            <input type="tel"
            autoComplete="tel"
            name="phone"
            id="phone"
            required
            placeholder="0947698212"
            className={styles.input} 
            ref={phoneReff}
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