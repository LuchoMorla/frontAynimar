import React from "react";
import styles from '@styles/Segmentation.module.scss';
import Link from "next/link";

const userSegmentation = () => {
 return (
    <div className={styles['Segment-Container']}>
    <section className={styles['Recycler_segment-container']}>
        <div>
            <h1  className={styles.hiTitle}>Gana dinero ayudandonos a reciclar</h1>
            <p>Véndele tus desechos a las empresas para que puedan convertirlos en productos útiles y responsables para tí y para todos por que ayudas a salvar a mundo fomentando el uso de productos que son reciprocos con el medio ambiente y la creacion de una nueva economía, la economía circular, donde se te paga por tus desperdicios.</p>
        </div>
        <div className={styles.buttonr}>
            <Link href="/signInRecycler" >Registrarme para vender reciclables</Link>
        </div>
    </section>
    <section className={styles['Customer_segment-container']}>
        <div className={styles.ContainerCallToAction}>
            <h1 className={styles.hiTitle}>{/* Compra de forma segura Online */}Pide ya!!</h1>
            <p>¡Bienvenido(a) a Aynimar! Explora nuestra amplia selección de productos. {'\n'} ¡Regístrate ahora y comienza a {/* disfrutar de la mejor experiencia de */} comprar en línea de forma segura!</p>
            {/* <p>Compra desde tu computadora o telefono productos que son responsables con el medio ambiente y contribuyen a la creación de una economia circular y verde.</p> */}
        </div>
        <div className={styles.buttonr}>
            <Link href="/signInCustomer" className={styles.linkPeudoButton} >¡Regístrate!{/*  para hacer compras */}</Link>
        </div>
    </section>
    </div>
 );
}

export default userSegmentation;