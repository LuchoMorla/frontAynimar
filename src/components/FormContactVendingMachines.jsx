import React, { useRef } from "react";
import axios from 'axios';
import endPoints from '@services/api';
import styles from '@styles/ContactForm.module.scss';

const FormContact = () => {
    const formRef = useRef(null);

    const submitHandler = async (event) => {
        try {
            event.preventDefault();
            const formData = new FormData(formRef.current);
    
            const config = {
                headers: {
                  accept: '*/*',
                  'Content-Type': 'application/json',
                },
              };
    
            const data = {
                name: formData.get('name'),
                email: formData.get('email-address'),
                ubicacion: formData.get('ubicacion'),
                celu: formData.get('celu'),
                message: formData.get('message')
            };
    
            const response = await axios.post(endPoints.mail.vendingContact, data, config);
            window.alert('mensaje enviado');
            return response.data;
        } catch (error) {
            window.alert('no pudimos enviar el mensaje');
        };
    };

    return (
        <>
            <form action="/" ref={formRef} className={styles.form} onSubmit={submitHandler} autoComplete="on">
                <div className={styles['form_inputs-container']}>
                    <label htmlFor="name">nombre: </label>
                    <input type="text" id='name' name='name' />
                    <label htmlFor="email">email: </label>
                    <input type="email" id='email-address' name='email-address' />
                    <label htmlFor="ubicacion">describe el lugar o ubicacion de la maquina: </label>
                    <input type="text" id='ubicacion' name='ubicacion' />
                    <label htmlFor="celu">Celular | Whatsapp: </label>
                    <input type="tel" id='celu' name='celu' />
                    <label htmlFor="message">mensaje: </label>
                    <textarea name='message' id='message' cols="30" rows="10"></textarea>
                    <input type="submit" value='Enviar' className={styles.button}/>
                </div>
            </form>
        </>
    );
};
export default FormContact;