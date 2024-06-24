import React from "react";
import styles from '@styles/Segmentation.module.scss';
import Link from "next/link";

const userSegmentation = () => {
 return (
    <div className={styles['Segment-Container']}>
        <section className={styles['Customer_segment-container']}>
            <div className={styles.ContainerCallToAction}>
                <h1 className={styles.hiTitle}>{/* Compra de forma segura Online */}Pide ya!!</h1>
                <p>¡Bienvenido(a) a Aynimar! Explora nuestra amplia selección de productos. {'\n'} ¡Regístrate ahora y comienza a {/* disfrutar de la mejor experiencia de */} comprar en línea de forma segura!</p>
                {/* <p>Compra desde tu computadora o telefono productos que son responsables con el medio ambiente y contribuyen a la creación de una economia circular y verde.</p> */}
            </div>
            <div className={styles.buttonr}>
                <Link href="/signInCustomer" className={styles.linkPeudoButton}>Comenzar{/*  para hacer compras */}</Link>
            </div>
        </section>
        <section className={styles['Recycler_segment-container']}>
            <div className={styles.ContainerCallToAction}>
                <h1  className={styles.hiTitle}>Recicla y Gana</h1>
                <p>Vende tus desechos a empresas y contribuye a la economía circular, ganando por ello y ayudando al medio ambiente.</p>
            </div>
            <div className={styles.buttonr}>
                <Link href="/signInRecycler" >Vende Reciclables</Link>
            </div>
        </section>
    </div>
 );
}

export default userSegmentation;