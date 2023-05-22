import React from "react";
import styles from '@styles/Segmentation.module.scss';
import Link from "next/link";

const userSegmentation = () => {
 return (
    <div className={styles['Segment-Container']}>
    {/* <section className={styles['Recycler_segment-container']}>
        <div>
            <h1>Gana dinero ayudandonos a reciclar</h1>
            <p>Vendiendonos tus desechos para que podamos convertirlos en un Productos utiles para ti, mientras cuidas el medio ambiente y te ves beneficiado al ser participe de una nueva economia, la economia circular.</p>
        </div>
        <div className={styles.buttonr}>
            <Link href="/signInRecycler" >Registrarme para vender reciclables</Link>
        </div>
    </section> */}
    <section className={styles['Customer_segment-container']}>
        <div>
            <h1 className={styles.hiTitle}>Compra de forma segura Online</h1>
            <p>¡Bienvenido(a) a Aynimar! Explora nuestra amplia selección de productos. {'\n'} ¡Regístrate ahora y comienza a {/* disfrutar de la mejor experiencia de */} comprar en línea!</p>
            {/* <p>Compra desde tu computadora o telefono productos que son responsables con el medio ambiente y contribuyen a la creación de una economia circular y verde.</p> */}
        </div>
        <div className={styles.buttonr}>
            <Link href="/signInCustomer" >Registrarte{/*  para hacer compras */}</Link>
        </div>
    </section>
    {/* <section className={styles['Recycler_segment-container']}>
        <img src="https://images.pexels.com/photos/6207744/pexels-photo-6207744.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt=""  width={50} height={50}/>
    </section> */}
    </div>
 );
}

export default userSegmentation;