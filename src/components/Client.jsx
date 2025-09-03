
import React, { useRef, useEffect } from 'react';
import { updateCustomer } from '@services/api/entities/customers';
import styles from '@styles/MyAccount.module.scss';
import { toast } from 'react-toastify';

const Client = ({ client, isGuest = false, onSubmit, onCompletenessChange, onUpdateSuccess }) => {
  const formRef = useRef(null);

  useEffect(() => {
    if (!isGuest && typeof onCompletenessChange === 'function' && client) {
      const requiredFields = [
        'name', 'lastName', 'identityNumber', 'phone', 'countryOfResidence',
        'province', 'city', 'streetAddress'
      ];

      const isComplete = requiredFields.every(field => client[field] && String(client[field]).trim() !== '');

      onCompletenessChange(isComplete);
    }
  }, [client, isGuest, onCompletenessChange]);

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
    }

    function error(err) {
      toast.error('ERROR(' + err.code + '): ' + err.message);
      console.warn('ERROR(' + err.code + '): ' + err.message);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  };

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

    // Validaciones personalizadas
    const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
    const numberRegex = /^[0-9]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameRegex.test(data.name)) {
      toast.error('El nombre solo puede contener letras.');
      return;
    }

    if (!nameRegex.test(data.lastName)) {
      toast.error('El apellido solo puede contener letras.');
      return;
    }

    if (!numberRegex.test(data.identityNumber)) {
      toast.error('La cédula debe contener solo números.');
      return;
    }

    if (!numberRegex.test(data.phone)) {
      toast.error('El teléfono debe contener solo números.');
      return;
    }

    if (isGuest && !emailRegex.test(formData.get('email-address'))) {
      toast.error('Por favor ingresa un correo válido.');
      return;
    }

    updateCustomer(clientId, data)
      .then(() => {
        toast.success('Actualizaste tus datos correctamente');
        if (typeof onUpdateSuccess === 'function') {
          onUpdateSuccess();
        }
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          toast.error('Algo salió mal');
        } else if (error.response?.status === 400) {
          toast.error('Error en el envío de datos. Asegúrate de no dejar campos vacíos.');
        } else if (error.response) {
          toast.error('Error ' + error.response.status);
          console.log('Algo salió mal: ' + error.response.status);
        }
      });
  };

  const finalSubmitHandler = onSubmit || updateHandler;

  return (
    <div className={styles.MyAccount}>
      <div className={styles['MyAccount-container']}>
        <form
          action="/"
          className={styles.form}
          ref={formRef}
          autoComplete="on"
          onSubmit={finalSubmitHandler}
        >
          <div className={styles['userCheckout-container']}>
            {/* Nombre */}
            <div className={styles.userCheckoutLi}>
              <div className={styles.inputsContainer}>
                <label htmlFor="name" className={styles.label}>
                  Nombre/s <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="name"
                  required
                  defaultValue={client?.name}
                  className="value"
                  pattern="[a-zA-ZÀ-ÿ\s]+"
                  title="Solo letras y espacios"
                />
              </div>
            </div>

            {/* Apellido */}
            <div className={styles.userCheckoutLi}>
              <div className={styles.inputsContainer}>
                <label htmlFor="apellido" className={styles.label}>
                  Apellido/s <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  name="apellido"
                  id="apellido"
                  autoComplete="family-name"
                  required
                  defaultValue={client?.lastName}
                  className="value"
                  pattern="[a-zA-ZÀ-ÿ\s]+"
                  title="Solo letras y espacios"
                />
              </div>
            </div>

            {/* Email (solo para invitados) */}
            {isGuest && (
              <>
                <div className={styles.userCheckoutLi}>
                  <div className={styles.inputsContainer}>
                    <label htmlFor="email-address" className={styles.label}>
                      Correo Electrónico <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="email"
                      name="email-address"
                      id="email-address"
                      autoComplete="email"
                      required
                      placeholder="tu@correo.com"
                      className="value"
                    />
                  </div>
                </div>
                <div className={styles.userCheckoutLi}>
                  <div className={styles.inputsContainer}>
                    <label htmlFor="password" className={styles.label}>
                      Crear Contraseña <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      autoComplete="new-password"
                      required
                      placeholder="************"
                      className="value"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Cédula */}
            <div className={styles.userCheckoutLi}>
              <div className={styles.inputsContainer}>
                <label htmlFor="cedula" className={styles.label}>
                  Número de cédula o identidad <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  name="cedula"
                  id="cedula"
                  required
                  defaultValue={client?.identityNumber}
                  className="value"
                  pattern="[0-9]+"
                  title="Solo números"
                />
              </div>
            </div>

            {/* Teléfono 1 */}
            <div className={styles.userCheckoutLi}>
              <div className={styles.inputsContainer}>
                <label htmlFor="telfono1" className={styles.label}>
                  Teléfono o celular 1 <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="tel"
                  name="telfono1"
                  id="telfono1"
                  autoComplete="tel"
                  required
                  defaultValue={client?.phone}
                  className="value"
                  pattern="[0-9]+"
                  title="Solo números"
                />
              </div>
            </div>

            {/* Teléfono 2 (opcional) */}
            <div className={styles.userCheckoutLi}>
              <div className={styles.inputsContainer}>
                <label htmlFor="telfono2" className={styles.label}>
                  Teléfono o celular 2
                </label>
                <input
                  type="tel"
                  name="telfono2"
                  id="telfono2"
                  autoComplete="tel"
                  defaultValue={client?.phoneTwo}
                  className="value"
                  pattern="[0-9]*"
                  title="Solo números (opcional)"
                />
              </div>
            </div>

            {/* País */}
            <div className={styles.userCheckoutLi}>
              <div className={styles.inputsContainer}>
                <label htmlFor="pais" className={styles.label}>
                  País <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  name="pais"
                  id="pais"
                  required
                  autoComplete="country-name"
                  defaultValue={client?.countryOfResidence}
                  className="value"
                />
              </div>
            </div>

            {/* Provincia */}
            <div className={styles.userCheckoutLi}>
              <div className={styles.inputsContainer}>
                <label htmlFor="provincia" className={styles.label}>
                  Provincia <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  name="provincia"
                  id="provincia"
                  required
                  defaultValue={client?.province}
                  className="value"
                />
              </div>
            </div>

            {/* Ciudad */}
            <div className={styles.userCheckoutLi}>
              <div className={styles.inputsContainer}>
                <label htmlFor="ciudad" className={styles.label}>
                  Ciudad <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  name="ciudad"
                  id="ciudad"
                  required
                  defaultValue={client?.city}
                  className="value"
                />
              </div>
            </div>

            {/* Código Postal */}
            <div className={styles.userCheckoutLi}>
              <div className={styles.inputsContainer}>
                <label htmlFor="postal-code" className={styles.label}>
                  Código Postal
                </label>
                <input
                  type="text"
                  name="postal-code"
                  id="postal-code"
                  autoComplete="postal-code"
                  defaultValue={client?.postalCode}
                  className="value"
                />
              </div>
            </div>

            {/* Dirección */}
            <div className={styles.userCheckoutLi}>
              <div className={styles.inputsContainer}>
                <label htmlFor="direccion" className={styles.label}>
                  Dirección de domicilio <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  name="direccion"
                  id="direccion"
                  autoComplete="street-address"
                  required
                  defaultValue={client?.streetAddress}
                  className="value"
                />
              </div>
            </div>

            {/* Geolocalización */}
            <div className={styles.userCheckoutLi}>
              <div className={styles.inputsContainer}>
                <label htmlFor="geolocation" className={styles.label}>
                  Geo-Localización
                </label>
                <input
                  type="text"
                  name="geolocation"
                  id="geolocation"
                  defaultValue={client?.geolocation}
                  className="value"
                />
                <button onClick={getLocation} className={styles.geolocButton}>
                  Obtener Ubicación Actual
                </button>
              </div>
            </div>
          </div>

          {/* Botón de envío */}
          <button type="submit" className={styles["login-button"]}>
            {isGuest ? 'Registrarse y Continuar' : 'Guardar Cambios'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Client;