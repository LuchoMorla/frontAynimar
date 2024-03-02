import Image from 'next/image';
import logo from '@logos/logoAynimar.svg';
import Head from 'next/head';
import FormContact from '@components/FormContactVendingMachines';
import styles from '@styles/Contact.module.scss';

const VendingContact = () => {
    return (
        <>
        <Head>
            <title>Aynimar | Contacto Cliente Vending</title>
        </Head>
        <div className={styles.contact}>
        <Image src={logo} width={90} height={90} alt='logo-Aynimar' />
            <h1 className={styles.title}>Maquinas Expendedoras Aynimar</h1>
            <p  className={styles.text}>Este es un servicio de gestion de experiencia de usuario, en la que aynimar se presta a escuchar sugerencias como productos nuevos, inconvenientes, soluciones y nuevos servicios con el fin de garantizarle siempre una mejor experiencia con nuestras maquinas expendedoras.</p>
            <FormContact />
        </div>
        </>
    );
};
export default VendingContact;