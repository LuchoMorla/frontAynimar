import React, { useRef } from "react";
import styles from '@styles/MyAccount.module.scss';

const Recycler = ({ recycler }) => {
   const formRef = useRef(null);

    return (
        <div className={styles.MyAccount}>
        <div className={styles["MyAccount-container"]}>
          <h1 className={styles.title}>Mi Cuenta de cooperación con el Reciclaje</h1>

            <form action="/" className={styles.form} ref={formRef}>
            <div>
              <label htmlFor="name" className={styles.label}>Nombre/s</label>
              <input type='text' name="name"
              id="name" autoComplete="name" 
              defaultValue={recycler?.name} className="value" />

              <label htmlFor="last-name" className={styles.label}>Apellido/s</label>
              <input type='text' name="last-name" 
              id="last-name" autoComplete="family-name"  
              defaultValue={recycler?.lastName} className="value" />

              <label htmlFor="cedula" className={styles.label}>Numero de cedula o identidad</label>
              <input type='text' name="cedula" 
              id="cedula"
              defaultValue={recycler?.identityNumber} className="value" />
              
              <label htmlFor="telfono1" className={styles.label}>Telefono o celular 1</label>
              <input type='tel' name="telfono1" 
              id="telfono1" autoComplete="tel" 
              defaultValue={recycler?.phone} className="value" />
              
              <label htmlFor="telfono2" className={styles.label}>Telefono o celular 2</label>
              <input type='tel' name="telfono2" 
              id="telfono2" autoComplete="tel" 
              defaultValue={recycler?.phoneTwo} className="value" />
              
              <label htmlFor="pais" className={styles.label}>Pais</label>
              <input type='text' 
              name="pais" 
              id="pais" autoComplete="country-name" 
              defaultValue={recycler?.countryOfResidence} className="value" />
              
              <label htmlFor="provincia" className={styles.label}>Provincia</label>
              <input type='text' name="provincia" 
              id="provincia"
              defaultValue={recycler?.province} className="value" />
              
              <label htmlFor="ciudad" className={styles.label}>Ciudad</label>
              <input type='text' name="ciudad" 
              id="ciudad"
              defaultValue={recycler?.city} className="value" />
              
              <label htmlFor="postal-code" className={styles.label}>Codigo Postal</label>
              <input type='text' name="postal-code" 
              id="postal-code" autoComplete="postal-code" 
              defaultValue={recycler?.postalCode} className="value" />
              
              <label htmlFor="payment-type" className={styles.label}>¿Como te gustaria recibir los pagos?</label>
              <input type='text'name="payment-type" 
              id="payment-type"
              defaultValue={recycler?.paymentType} className="value" />
              
              <label htmlFor="banco" className={styles.label}>Banco</label>
              <input type='text' name="banco" 
              id="banco"
              defaultValue={recycler?.bank} className="value" />

              <label htmlFor="type-count" className={styles.label}>Tipo de cuenta</label>
              <input type='text'  name="type-count" 
              id="type-count" placeholder="ahorros/corriente"
              defaultValue={recycler?.typeCount} className="value" />

              <label htmlFor="count" className={styles.label}>Numero de cuenta</label>
              <input type='text' name="count" 
              id="count"
              defaultValue={recycler?.countNumber} className="value" />
              
            </div>
    
            <input type="submit" value="Edit" className={(styles["secondary-button"], styles["login-button"])} />
          </form>
        </div>
      </div>
    );
}
export default Recycler;