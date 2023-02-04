import React, { useRef } from "react";
import { useRouter } from "next/router";
import { updateRecycler } from '@services/api/entities/recyclers';
import styles from '@styles/MyAccount.module.scss';

const Recycler = ({ recycler }) => {
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
      let crd = pos.coords;
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
    const recyclerId = recycler?.id;

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
	    paymentType: formData.get('payment-type'),
	    bank: formData.get('banco'),
	    typeCount: formData.get('type-count'),
	    countNumber: formData.get('count'),
/*       user: {
        email: formData.get('email-address'),
        password:formData.get('password')
      } */
    };

    updateRecycler(recyclerId, data)
      .then(() => {
        window.alert('^^ Actualizaste tus datos correctamente ^^, si viniste aquí por 1ra primera vez, te contactaremos muy pronto...');
          router.push('/mi_cuenta/recycler');
      })
      .catch((error)=> { if (error.response?.status === 401) {
        window.alert('algo salio mal :(');
       } else if (error.response?.status === 400) {
        window.alert(':O error por mal envio de actualización de datos, para actualizar una recomendación es que no dejes datos vacios, pon na en caso de que no tengas la información, y si te continua saliendo error, lo mejor es que pruebes con infrmación real y confiable');
       } else if (error.response) {
        window.alert('Algo salio mal: ' + error.response.status);
        if (error.response.status == 409) {
          window.alert('es probable que ya estes registrado te invitamos a crear una nueva contraseña en caso de que la hayas olvidado');
          router.push('/forgotPassword');
        };
      };
    });
  };

    return (
        <div className={styles.MyAccount}>
        <div className={styles["MyAccount-container"]}>
          <h1 className={styles.title}>Mi Cuenta de cooperación con el Reciclaje</h1>
            <p>Edita tus datos para contactarte, poder realizar el pago que le corresponde y para poder recoger el producto.</p>
            <form action="/" className={styles.form} ref={formRef} autoComplete="on">
            <div>
              <label htmlFor="name" className={styles.label}>Nombre/s</label>
              <input type='text' name="name"
              id="name" autoComplete="name" required
              defaultValue={recycler?.name} className="value" />

              <label htmlFor="apellido" className={styles.label}>Apellido/s</label>
              <input type='text' name="apellido" 
              id="apellido" autoComplete="family-name"  required
              defaultValue={recycler?.lastName} className="value" />

              <label htmlFor="cedula" className={styles.label}>Numero de cedula o identidad</label>
              <input type='text' name="cedula" 
              id="cedula" required
              defaultValue={recycler?.identityNumber} className="value" />
              
              <label htmlFor="telfono1" className={styles.label}>Telefono o celular 1</label>
              <input type='tel' name="telfono1" 
              id="telfono1" autoComplete="tel" required
              defaultValue={recycler?.phone} className="value" />
              
              <label htmlFor="telfono2" className={styles.label}>Telefono o celular 2</label>
              <input type='tel' name="telfono2" 
              id="telfono2" autoComplete="tel"  required
              defaultValue={recycler?.phoneTwo} className="value" />
              
              <label htmlFor="pais" className={styles.label}>Pais</label>
              <input type='text' 
              name="pais"  required
              id="pais" autoComplete="country-name" 
              defaultValue={recycler?.countryOfResidence} className="value" />
              
              <label htmlFor="provincia" className={styles.label}>Provincia</label>
              <input type='text' name="provincia" 
              id="provincia" required
              defaultValue={recycler?.province} className="value" />
              
              <label htmlFor="ciudad" className={styles.label}>Ciudad</label>
              <input type='text' name="ciudad" 
              id="ciudad" required
              defaultValue={recycler?.city} className="value" />
              
              <label htmlFor="postal-code" className={styles.label}>Codigo Postal</label>
              <input type='text' name="postal-code" 
              id="postal-code" autoComplete="postal-code" required
              defaultValue={recycler?.postalCode} className="value" />

              <label htmlFor="direccion" className={styles.label}>
              Dirección de recolección
              </label>
              <input type="text" name="direccion" id="direccion" autoComplete="street-address" 
              defaultValue={recycler?.streetAddress} required className="value" />

              <label htmlFor="geolocation" className={styles.label}>
              Ubicación de Google maps
              </label>
              <input type="text" name="geolocation" id="geolocation"
              defaultValue={recycler?.geolocation ? recycler.geolocation : 'sin ubicacion'} required className="value" />

              <button onClick={getLocation}>Obtener Ubicación Actual</button>
                            
              <label htmlFor="payment-type" className={styles.label}>¿Como te gustaria recibir los pagos?</label>
              <input type='text' name="payment-type"  required
              id="payment-type" placeholder="Cheque | Deposito Bancario | Efectivo"
              defaultValue={recycler?.paymentType} className="value" />
              
              <label htmlFor="banco" className={styles.label}>Banco</label>
              <input type='text' name="banco" 
              id="banco" required
              defaultValue={recycler?.bank} className="value" />

              <label htmlFor="type-count" className={styles.label}>Tipo de cuenta</label>
              <input type='text'  name="type-count" 
              id="type-count" placeholder="C.Ahorros | C.Corriente"
              defaultValue={recycler?.typeCount} className="value" />

              <label htmlFor="count" className={styles.label}>Numero de cuenta</label>
              <input type='text' name="count" 
              id="count" required
              defaultValue={recycler?.countNumber} className="value" />
            </div>
    
            <button className={styles["login-button"]} onClick={submitHandler}>Editar</button>
          </form>
        </div>
      </div>
    );
};
export default Recycler;