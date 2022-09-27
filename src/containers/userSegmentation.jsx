import React from "react";
import styles from '@styles/Segmentation.module.scss';
import Link from "next/link";

const userSegmentation = () => {
 return (
    <div className={styles['Segment-Container']}>
    <section className={styles['Recycler_segment-container']}>
        <div>
            <h1>Gana dinero ayudandonos a reciclar</h1>
            <p>Vendiendonos tus desechos para que podamos convertirlos en un Productos utiles para ti, mientras cuidas el medio ambiente y te ves beneficiado al ser participe de una nueva economia, la economia circular.</p>
        </div>
        <div className={styles.buttonr}>
            <Link href="/signInRecycler" >Registrarme para vender reciclables</Link>
        </div>
    </section>
    <section className={styles['Customer_segment-container']}>
        <div>
            <h1>Ecotienda online</h1>
            <p>Compra desde tu computadora o telefono productos que son responsables con el medio ambiente y contribuyen a la creación de una economia circular y verde.</p>
        </div>
        <div className={styles.buttonr}>
            <Link href="/signInCustomer" >Registrarme para hacer compras</Link>
        </div>
    </section>
    </div>
 );
}

export default userSegmentation;