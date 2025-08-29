import React, { useRef } from 'react';
import { updateCustomer } from '@services/api/entities/customers';
import styles from '@styles/MyAccount.module.scss';
import { toast } from 'react-toastify';

// El componente ahora acepta 'isGuest' y 'onSubmit' para ser controlado desde fuera.
const Client = ({ client, isGuest = false, onSubmit }) => {
  
    console.log("Datos del cliente cargados:", client); 
  
  const formRef = useRef(null);

  const getLocation = (event) => {
    event.preventDefault();
    const clientGeoLocationInput = document.getElementById('geolocation');
    let options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    function success(pos) {
      let crd = pos.coords;
      clientGeoLocationInput.value = `${crd.latitude}, ${crd.longitude}`;
    };
    function error(err) {
      toast.error('ERROR(' + err.code + '): ' + err.message);
      console.warn('ERROR(' + err.code + '): ' + err.message);
    };
    navigator.geolocation.getCurrentPosition(success, error, options);
  };

  // Esta es la función por defecto para ACTUALIZAR datos cuando se usa en el perfil.
  const updateHandler = (event) => {
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
        geolocation: formData.get('geolocation'),
    };
    updateCustomer(clientId, data)
      .then(() => {
        toast.success('Actualizaste tus datos correctamente');
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          toast.error('algo salio mal');
        } else if (error.response?.status === 400) {
          toast.error('Error en el envío de datos. Asegúrate de no dejar campos vacíos.');
        } else if (error.response) {
          toast.error('Error ' + error.response.status);
          console.log('Algo salio mal: ' + error.response.status);
        }
      });
  };

  // Se decide qué función usar: la que viene de 'props' (para registro) o la local (para actualizar).
  const finalSubmitHandler = onSubmit || updateHandler;

  return (
    <div className={styles.MyAccount}>
      <div className={styles['MyAccount-container']}>
        {/* El 'onSubmit' del formulario ahora es dinámico */}
        <form action="/" className={styles.form} ref={formRef} autoComplete="on" onSubmit={finalSubmitHandler}>
          <div className={styles['userCheckout-container']}>
            <div className={styles.userCheckoutLi}>
                <div className={styles.inputsContainer}>
                    <label htmlFor="name" className={styles.label}>Nombre/s</label>
                    <input type="text" name="name" id="name" autoComplete="name" required defaultValue={client?.name} className="value" />
                </div>
              </div>
              <div className={styles.userCheckoutLi}>
                <div className={styles.inputsContainer}>
                    <label htmlFor="apellido" className={styles.label}>Apellido/s</label>
                    <input type="text" name="apellido" id="apellido" autoComplete="family-name" required defaultValue={client?.lastName} className="value" />
                </div>
              </div>

              {/* Los campos de Email y Contraseña solo aparecen si 'isGuest' es true */}
              {isGuest && (
                <>
                  <div className={styles.userCheckoutLi}>
                    <div className={styles.inputsContainer}>
                      <label htmlFor="email-address" className={styles.label}>Correo Electrónico</label>
                      <input type="email" name="email-address" id="email-address" autoComplete="email" required placeholder="tu@correo.com" className="value" />
                    </div>
                  </div>
                  <div className={styles.userCheckoutLi}>
                    <div className={styles.inputsContainer}>
                      <label htmlFor="password" className={styles.label}>Crear Contraseña</label>
                      <input type="password" name="password" id="password" autoComplete="new-password" required placeholder="************" className="value" />
                    </div>
                  </div>
                </>
              )}
            
              <div className={styles.userCheckoutLi}>
                <div className={styles.inputsContainer}>
                  <label htmlFor="cedula" className={styles.label}>Numero de cedula o identidad</label>
                  <input type="text" name="cedula" id="cedula" required defaultValue={client?.identityNumber} className="value" />
                </div>
              </div>
              <div className={styles.userCheckoutLi}>
                <div className={styles.inputsContainer}>
                  <label htmlFor="telfono1" className={styles.label}>Telefono o celular 1</label>
                  <input type="tel" name="telfono1" id="telfono1" autoComplete="tel" required defaultValue={client?.phone} className="value" />
                </div>
              </div>
              <div className={styles.userCheckoutLi}>
                <div className={styles.inputsContainer}>
                  <label htmlFor="telfono2" className={styles.label}>Telefono o celular 2</label>
                  <input type="tel" name="telfono2" id="telfono2" autoComplete="tel" required defaultValue={client?.phoneTwo} className="value" />
                </div>
              </div>
              <div className={styles.userCheckoutLi}>
                <div className={styles.inputsContainer}>
                  <label htmlFor="pais" className={styles.label}>Pais</label>
                  <input type="text" name="pais" required id="pais" autoComplete="country-name" defaultValue={client?.countryOfResidence} className="value" />
                </div>
              </div>
              <div className={styles.userCheckoutLi}>
                <div className={styles.inputsContainer}>
                  <label htmlFor="provincia" className={styles.label}>Provincia</label>
                  <input type="text" name="provincia" id="provincia" required defaultValue={client?.province} className="value" />
                </div>
              </div>
              <div className={styles.userCheckoutLi}>
                <div className={styles.inputsContainer}>
                  <label htmlFor="ciudad" className={styles.label}>Ciudad</label>
                  <input type="text" name="ciudad" id="ciudad" required defaultValue={client?.city} className="value" />
                </div>
              </div>
              <div className={styles.userCheckoutLi}>
                <div className={styles.inputsContainer}>
                  <label htmlFor="postal-code" className={styles.label}>Codigo Postal</label>
                  <input type="text" name="postal-code" id="postal-code" autoComplete="postal-code" required defaultValue={client?.postalCode} className="value" />
                </div>
              </div>
              <div className={styles.userCheckoutLi}>
                <div className={styles.inputsContainer}>
                  <label htmlFor="direccion" className={styles.label}>Dirección de domicilio</label>
                  <input type="text" name="direccion" id="direccion" autoComplete="street-address" defaultValue={client?.streetAddress} required className="value" />
                </div>
              </div>
              <div className={styles.userCheckoutLi}>
                <div className={styles.inputsContainer}>
                  <label htmlFor="geolocation" className={styles.label}>Geo-Localizacion</label>
                    <input type="text" name="geolocation" id="geolocation" defaultValue={client?.geolocation} required className="value" />
                    <button onClick={getLocation} className={styles.geolocButton}>Obtener Ubicación Actual</button>
                </div>
              </div>
          </div>

          {/* El botón ahora es de tipo 'submit' y su texto cambia dinámicamente */}
          <button type="submit" className={styles["login-button"]}>
            {isGuest ? 'Registrarse y Continuar' : 'Guardar Cambios'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Client;