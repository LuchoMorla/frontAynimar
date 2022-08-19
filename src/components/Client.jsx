import React, { useRef } from 'react';
import styles from '@styles/MyAccount.module.scss';

const Client = ({ client }) => {
  const formRef = useRef(null);

  return (
    <div className={styles.MyAccount}>
      <div className={styles['MyAccount-container']}>
        <h1 className={styles.title}>Mi Cuenta de Compras</h1>

        <form action="/" className={styles.form} ref={formRef}>
          <div>
            <label htmlFor="name" className={styles.label}>
              Nombre/s
            </label>
            <input type="text" defaultValue={client?.name} className="value" />

            <label htmlFor="email" className={styles.label}>
              Apellido/s
            </label>
            <input type="text" defaultValue={client?.lastName} className="value" />

            <label htmlFor="cedula" className={styles.label}>
              Numero de cedula o identidad
            </label>
            <input type="text" name="cedula"
            id="cedula" defaultValue={client?.identityNumber} className="value" />

            <label htmlFor="telfono1" className={styles.label}>
              Telefono o celular 1
            </label>
            <input type="tel" name="telfono1" id="telfono1" 
            autoComplete="tel" defaultValue={client?.phone} className="value" />

            <label htmlFor="telfono2" className={styles.label}>
              Telefono o celular 2
            </label>
            <input type="tel" name="telfono2" id="telfono2" autoComplete="tel" 
            defaultValue={client?.phoneTwo} className="value" />

            <label htmlFor="pais" className={styles.label}>
              Pais
            </label>
            <input type="text" name="pais" id="pais" autoComplete="country-name" 
            defaultValue={client?.countryOfResidence} className="value" />

            <label htmlFor="provincia" className={styles.label}>
              Provincia
            </label>
            <input type="text" name="provincia" id="provincia" 
            defaultValue={client?.province} className="value" />

            <label htmlFor="ciudad" className={styles.label}>
              Ciudad
            </label>
            <input type="text" name="ciudad" id="ciudad" 
            defaultValue={client?.city} className="value" />

            <label htmlFor="postal-code" className={styles.label}>
              Codigo Postal
            </label>
            <input type="text" name="postal-code" id="postal-code" autoComplete="postal-code" 
            defaultValue={client?.postalCode} className="value" />
          </div>

          <input type="submit" value="Edit" className={(styles['secondary-button'], styles['login-button'])} />
        </form>
      </div>
    </div>
  );
};
export default Client;
