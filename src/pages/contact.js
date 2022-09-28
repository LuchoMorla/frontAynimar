import Image from 'next/image';
import logo from '@logos/logo-Aynimar.svg';
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
            <Image src={logo} width={100} height={100} alt='logo Aynimar'/>
            <h1 className={styles.title}>Contacto</h1>
            <FormContact />
        </div>
        </>
    );
};
export default Contact;