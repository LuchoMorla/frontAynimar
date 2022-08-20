import React, { useRef } from 'react';
import { useRouter } from "next/router";
import { updateCustomer } from '@services/api/entities/customers';
import styles from '@styles/MyAccount.module.scss';

const Client = ({ client }) => {
  const formRef = useRef(null);
  const router = useRouter(); 

  const submitHandler = (event) => {
   event.preventDefault();

   const formData = new FormData(formRef.current);
   const clientId = client?.id;

   const data = {
     name: formData.get('name'),
     lastName: formData.get('apellido'),
     identityNumber: formData.get('cedula'),
     phone: formData.get('telfono1'),
     phoneTwo: formData.get('telfono2'),
     countryOfResidence: formData.get('pais'),
     province: formData.get('provincia'),
     city: formData.get('ciudad'),
     postalCode: formData.get('postal-code'),
     streetAddress: formData.get('direccion'),
   };
   updateCustomer(clientId, data)
     .then(() => {
         alert('^^ Actualizaste tus datos correctamente ^^');
         router.push('/mi_cuenta/cliente');
     })
     .catch((error)=> { if (error.response?.status === 401) {
       alert('algo salio mal :(');
      } else if (error.response?.status === 400) {
       alert(':O error por mal envio de actualización de datos, para actualizar una recomendación es que no dejes datos vacios, pon na en caso de que no tengas la información, y si te continua saliendo error, lo mejor es que pruebes con infrmación real y confiable');
      } else if (error.response) {
       alert('Algo salio mal: ' + error.response.status);
       if (error.response.status == 409) {
         alert('es probable que ya estes registrado te invitamos a crear una nueva contraseña en caso de que la hayas olvidado');
         router.push('/forgotPassword');
       }
     }
   });
 };

  return (
    <div className={styles.MyAccount}>
      <div className={styles['MyAccount-container']}>
        <h1 className={styles.title}>Mi Cuenta de Compras</h1>

        <form action="/" className={styles.form} ref={formRef}  onSubmit={submitHandler} autoComplete="on">
            <div>
              <label htmlFor="name" className={styles.label}>Nombre/s</label>
              <input type='text' name="name"
              id="name" autoComplete="name" required
              defaultValue={client?.name} className="value" />

              <label htmlFor="apellido" className={styles.label}>Apellido/s</label>
              <input type='text' name="apellido" 
              id="apellido" autoComplete="family-name"  required
              defaultValue={client?.lastName} className="value" />

              <label htmlFor="cedula" className={styles.label}>Numero de cedula o identidad</label>
              <input type='text' name="cedula" 
              id="cedula" required
              defaultValue={client?.identityNumber} className="value" />
              
              <label htmlFor="telfono1" className={styles.label}>Telefono o celular 1</label>
              <input type='tel' name="telfono1" 
              id="telfono1" autoComplete="tel" required
              defaultValue={client?.phone} className="value" />
              
              <label htmlFor="telfono2" className={styles.label}>Telefono o celular 2</label>
              <input type='tel' name="telfono2" 
              id="telfono2" autoComplete="tel"  required
              defaultValue={client?.phoneTwo} className="value" />
              
              <label htmlFor="pais" className={styles.label}>Pais</label>
              <input type='text' 
              name="pais"  required
              id="pais" autoComplete="country-name" 
              defaultValue={client?.countryOfResidence} className="value" />
              
              <label htmlFor="provincia" className={styles.label}>Provincia</label>
              <input type='text' name="provincia" 
              id="provincia" required
              defaultValue={client?.province} className="value" />
              
              <label htmlFor="ciudad" className={styles.label}>Ciudad</label>
              <input type='text' name="ciudad" 
              id="ciudad" required
              defaultValue={client?.city} className="value" />
              
              <label htmlFor="postal-code" className={styles.label}>Codigo Postal</label>
              <input type='text' name="postal-code" 
              id="postal-code" autoComplete="postal-code" required
              defaultValue={client?.postalCode} className="value" />

            <label htmlFor="direccion" className={styles.label}>
              Dirección de domicilio
            </label>
            <input type="text" name="direccion" id="direccion" autoComplete="street-address" 
            defaultValue={client?.streetAddress} required className="value" />
          
          </div>

          <input type="submit" value="Editar" className={(styles['secondary-button'], styles['login-button'])} />
        </form>
      </div>
    </div>
  );
};
export default Client;
