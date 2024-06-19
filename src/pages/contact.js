/* import Image from 'next/image';
import logo from '@logos/logoAynimar.svg'; */
import Head from 'next/head';
import FormContact from '@components/FormContact';
import styles from '@styles/Contact.module.scss';

const Contact = () => {
    return (
        <>
        <Head>
            <title>Aynimar | Contacto</title>
        </Head>
        <div className={styles.contact}>
            <h1 className={styles.title}>Escríbenos</h1>
            <FormContact />
        </div>
        </>
    );
};
export default Contact;