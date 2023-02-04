import React, { useRef } from 'react';
import { useRouter } from 'next/router';
import { updateCustomer } from '@services/api/entities/customers';
import styles from '@styles/MyAccount.module.scss';

const Client = ({ client }) => {
  const formRef = useRef(null);
  const router = useRouter();

  const getLocation = (event) => {
    event.preventDefault();
    const clientGeoLocationInput = document.getElementById('geolocation');
    let options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    function success(pos) {
      let crd = pos.coords;/* 
      console.log('Your current position is:');
      console.log('Latitude : ' + crd.latitude);
      console.log('Longitude: ' + crd.longitude); */
/*       console.log('More or less ' + crd.accuracy + ' meters.'); */
      clientGeoLocationInput.value = `${crd.latitude}, ${crd.longitude}`;
    };

    function error(err) {
      window.alert('ERROR(' + err.code + '): ' + err.message);
      console.warn('ERROR(' + err.code + '): ' + err.message);
    };

    navigator.geolocation.getCurrentPosition(success, error, options);
   };

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
        window.alert('^^ Actualizaste tus datos correctamente ^^');
        router.push('/mi_cuenta/cliente');
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          window.alert('algo salio mal :(');
        } else if (error.response?.status === 400) {
          window.alert(
            ':O error por mal envio de actualización de datos, para actualizar una recomendación es que no dejes datos vacios, pon na en caso de que no tengas la información, y si te continua saliendo error, lo mejor es que pruebes con infrmación real y confiable'
          );
        } else if (error.response) {
          window.alert('Algo salio mal: ' + error.response.status);
          if (error.response.status == 409) {
            window.alert('es probable que ya estes registrado te invitamos a crear una nueva contraseña en caso de que la hayas olvidado');
            router.push('/forgotPassword');
          }
        }
      });
  };

  return (
    <div className={styles.MyAccount}>
      <div className={styles['MyAccount-container']}>
        <h1 className={styles.title}>Mi Cuenta de Compras</h1>

        <form action="/" className={styles.form} ref={formRef} autoComplete="on">
          <div>
            <label htmlFor="name" className={styles.label}>
              Nombre/s
            </label>
            <input type="text" name="name" id="name" autoComplete="name" required defaultValue={client?.name} className="value" />

            <label htmlFor="apellido" className={styles.label}>
              Apellido/s
            </label>
            <input type="text" name="apellido" id="apellido" autoComplete="family-name" required defaultValue={client?.lastName} className="value" />

            <label htmlFor="cedula" className={styles.label}>
              Numero de cedula o identidad
            </label>
            <input type="text" name="cedula" id="cedula" required defaultValue={client?.identityNumber} className="value" />

            <label htmlFor="telfono1" className={styles.label}>
              Telefono o celular 1
            </label>
            <input type="tel" name="telfono1" id="telfono1" autoComplete="tel" required defaultValue={client?.phone} className="value" />

            <label htmlFor="telfono2" className={styles.label}>
              Telefono o celular 2
            </label>
            <input type="tel" name="telfono2" id="telfono2" autoComplete="tel" required defaultValue={client?.phoneTwo} className="value" />

            <label htmlFor="pais" className={styles.label}>
              Pais
            </label>
            <input type="text" name="pais" required id="pais" autoComplete="country-name" defaultValue={client?.countryOfResidence} className="value" />

            <label htmlFor="provincia" className={styles.label}>
              Provincia
            </label>
            <input type="text" name="provincia" id="provincia" required defaultValue={client?.province} className="value" />

            <label htmlFor="ciudad" className={styles.label}>
              Ciudad
            </label>
            <input type="text" name="ciudad" id="ciudad" required defaultValue={client?.city} className="value" />

            <label htmlFor="postal-code" className={styles.label}>
              Codigo Postal
            </label>
            <input type="text" name="postal-code" id="postal-code" autoComplete="postal-code" required defaultValue={client?.postalCode} className="value" />

            <label htmlFor="direccion" className={styles.label}>
              Dirección de domicilio
            </label>
            <input type="text" name="direccion" id="direccion" autoComplete="street-address" defaultValue={client?.streetAddress} required className="value" />

            <label htmlFor="geolocation" className={styles.label}>
              Ubicación de Google maps
              </label>
              <input type="text" name="geolocation" id="geolocation"
              defaultValue={client?.geolocation ? client.geolocation : 'sin ubicacion'} required className="value" />
              <button onClick={getLocation}>Obtener Ubicación Actual</button>

            </div>

          <button className={styles["login-button"]} onClick={submitHandler}>Editar</button>
        </form>
      </div>
    </div>
  );
};
export default Client;
