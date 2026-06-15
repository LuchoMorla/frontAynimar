import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '@styles/Footer.module.scss';

const TRUST_ITEMS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={styles.trustIcon}>
        <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.01 21 3 13.99 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z"/>
      </svg>
    ),
    label: 'WhatsApp Ecuador',
    sub: 'Soporte directo',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={styles.trustIcon}>
        <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zm-.5 1.5L21 12h-4V9.5h2.5zM6 18.5c-.83 0-1.5-.67-1.5-1.5S5.17 15.5 6 15.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
      </svg>
    ),
    label: 'Servientrega · Tramaco',
    sub: 'Envíos a todo el país',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={styles.trustIcon}>
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 14l-3-3 1.41-1.41L11 12.17l4.59-4.58L17 9l-6 6z"/>
      </svg>
    ),
    label: 'Garantía de satisfacción',
    sub: 'Respaldamos tu compra',
  },
];

const Footer = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <>
      {/* Barra de navegación con trust badges */}
      <nav className={styles.Nav}>
        <div className={styles['navbar-right']}>
          <ul>
            <li>
              <button onClick={() => router.back()} className={styles.footerLink}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={50} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Atrás
              </button>
            </li>
          </ul>
        </div>

        {/* Trust badges — reemplaza el texto blanco */}
        <div className={styles.trustBar}>
          {TRUST_ITEMS.map(({ icon, label, sub }) => (
            <div key={label} className={styles.trustPill}>
              {icon}
              <span>
                <strong>{label}</strong>
                <span className={styles.trustSub}>{sub}</span>
              </span>
            </div>
          ))}
        </div>

        <div className={styles['navbar-left']}>
          <ul className={styles.footerRigthList}>
            <li>
              <Link href="/signInCustomer" className={styles.footerLink}>
                Registrarse
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  currentPath === '/home'
                    ? router.push('/store')
                    : currentPath === '/store'
                    ? router.push('/checkout')
                    : currentPath === '/checkout'
                    ? router.push('/mi_cuenta/orders')
                    : router.push('/mi_cuenta/orders');
                }}
                className={styles.footerLink}
              >
                Adelante
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={50} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Footer legal */}
      <footer className={styles.footerBottom}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <span className={styles.footerLogo}>Aynimar</span>
            <p className={styles.footerMission}>
              Economía circular inteligente en Ecuador.<br />
              Importamos productos nuevos y premiamos el reciclaje.
            </p>
          </div>

          <div className={styles.footerLinks}>
            <Link href="/terminosYCondiciones" className={styles.footerBottomLink}>Términos y condiciones</Link>
            <Link href="/contact" className={styles.footerBottomLink}>Contacto</Link>
            <Link href="/aboutUs" className={styles.footerBottomLink}>Sobre nosotros</Link>
            <a href="https://circular-merchant.aynimar.com/" className={styles.footerBottomLink}>
              Registra tu negocio
            </a>
          </div>

          <div className={styles.footerLegal}>
            <p>Empresa legalmente constituida en Ecuador</p>
            <p><strong>RUC:</strong> 1793227194001</p>
            <p>© {new Date().getFullYear()} Aynimar. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
