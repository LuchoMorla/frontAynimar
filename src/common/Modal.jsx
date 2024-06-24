import React, { useEffect, useState } from 'react';
import ReactDom from 'react-dom';
import Link from 'next/link';
import styles from '@styles/Modal.module.scss';

const Modal = ({ open, onClose, children }) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const cerrarPopUp = (e) => {
    e.preventDefault();
    onClose();
  };

  const modalContent = open ? (
    <>
      <div className={styles.overlay} id="overlay">
        <div className={styles.popUp} id="popUp">
          <a href="#" id="Button_cerrar-popUp" onClick={cerrarPopUp} className={styles['button_cerrar-popUp']}>
            X
          </a>
          {children}
        </div>
      </div>
    </>
  ) : null;
  if (isBrowser) {
    return ReactDom.createPortal(modalContent, document.getElementById('rootModal'));
  } else {
    return null;
  }
};
export default Modal;
