import Image from 'next/image';
import logo from '@logos/logoAynimar.svg';
import Head from 'next/head';
import FormContact from '@components/FormProspectosMaquinasExpendedoras';
import styles from '@styles/Contact.module.scss';

const VendingProspect = () => {
    return (
        <>
        <Head>
            <title>Aynimar | Maquinas Expendedoras</title>
            <meta name="description" content="Rentabiliza tu espacio con las máquinas expendedoras de Aynimar. Llena el formulario para ponernos en contacto contigo." />
        </Head>
        <div className={styles.contact}>
        <Image src={logo} width={90} height={90} alt='Logo de Aynimar Maquinas Expendedoras' />
            <h1 className={styles.title}>Maquinas Expendedoras Aynimar</h1>
            <p className={styles.text}>Cuentas con un lugar con transito de personas y te gustaría rentabilizar el espacio, sin tener que hacer ninguna inversion, mejorar el aspecto del espacio y además tener al alcance las 24/7 horas de snacks y bebidas?</p>
            <div className={styles.imageContainer}>
            <Image className={styles.imageVending} src='https://vendingpassec.com/wp-content/uploads/2020/04/conocer-clientes-vending-1.jpg'  width={700} height={300} alt='Maquinas Expendedoras para aumentar la productividad en oficinas, hospitales, gymnasios, centros comerciales, etc.'  />
            </div>
            <p className={styles.text}>Si tu respuesta es si, Continua llenando el siguiente formulario para que podamos ponernos en contacto con tigo y posicionar una de nuestras maquinas expendedoras en tú locacion.</p>
            <FormContact />
        </div>
        </>
    );
};
export default VendingProspect;