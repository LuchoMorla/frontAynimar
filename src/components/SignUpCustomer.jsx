import React, { useRef } from "react";
import Image from 'next/image';
import Link from "next/link";
import { useRouter } from 'next/router';
import { addCustomer } from '@entities/customers';
import logo from '@logos/logo-Aynimar.svg';
import styles from '@styles/Login.module.scss';

const SignUp = () => {
  const formRef = useRef(null);
/*   const addUser = addCustomers(); */
  const router = useRouter(); 

  const submitHandler = (event) => {
    event.preventDefault();

    const formData = new FormData(formRef.current);

    const data = {
      name: formData.get('name'),
      lastName: formData.get('apellido'),
      user: {
        email: formData.get('email-address'),
        password:formData.get('password')
      }
    };

      addCustomer(data)
      .then(() => {
          router.push('/correo-enviado');
      })
      .catch((error)=> { if (error.response?.status === 401) {
        window.alert('algo salio mal :(');
       } else if (error.response) {
        window.alert('Algo salio mal: ' + error.response.status);
        console.log('Algo salio mal: ' + error.response.status);
        if (error.response.status == 409) {
          window.alert('es probable que ya estes registrado te invitamos a crear una nueva contraseña en caso de que la hayas olvidado');
          router.push('/forgetPassword');
        }
      }
    });
  };

    return (
      <div className={styles.login}>
      <div className={styles['login-container']}>
        <Image src={logo} width={100} height={100} className={styles.logo} alt='logo Aynimar' />
        <h1 className={styles.title}>Registro de cliente</h1>

        <form action="/" ref={formRef} className={styles.form} onSubmit={submitHandler} autoComplete="on">
          <div className={styles.form} >
            <label htmlFor="name"className={styles.label}>Nombre/s</label>
            <input type="text"
            autoComplete="name"
            name="name"
            id="name"
            required
            placeholder="Inés"
            className={styles.input}
            />
            {'\n'}
            <label htmlFor="apellido" className={styles.label} >Apellido/s</label>
            <input type="text"
            autoComplete="family-name"
            name="apellido"
            id="apellido"
            required
            placeholder="Esario Lopez Khe"
            className={styles.input}
            />
            {'\n'}
            <label htmlFor="email-address" className={styles.label}>Email</label>
            <input type="email" 
            id="email-address"
            name="email-address"
            autoComplete="email"
            required
            placeholder="nombre@mail.com" 
            className={styles.input} 
            />
           {'\n'}
            <label htmlFor="password" className={styles.label}>Contraseña</label>
            <input type="password" 
            id="password" 
            name="password"
            autoComplete="current-password" 
            required
            className={styles.input} 
            placeholder="***Contraseña***"
            />
            {'\n'}
          </div>

          <button type="submit" 
          className={(styles['primary-button'], styles['login-button'])}>
          Registrarse
          </button>
        </form>
        <Link href='/login'>ya tengo una cuenta, Iniciar Sesion</Link>
      </div>
    </div>
    );
};

export default SignUp;