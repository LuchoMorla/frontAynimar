import React from 'react';
import styles from '@styles/Blog.module.scss';
import Image from 'next/image';

const aboutUs = () => {
    
    return (
        <>
            <div className={styles.blogContainter}>
                <h2>Mision</h2>
                    <p>Desarrollar y potenciar el comercio circular electrónico y automatizado en Latinoamérica y el Mundo, así como también el desarrollo económico de su población, creando nuevas soluciones que permitan mejorar la calidad de vida de las personas y su interacción con el medio ambiente a través de la tecnología, conectando a las personas con las empresas para fomentar una economía circular donde la actividad comercial del ser humano sea autosustentable y no contamine la naturaleza.</p>
                <h2>Vision</h2>
                    <p>Se desarrollarán soluciones tecnológicas para simplificar, potenciar y conectar empresas, familias y personas, con la creación y puesta de soluciones que mejoren la experiencia de los usuarios y la gestión estratégica de recursos en los puntos de venta y acopio físicos y digitales para dar múltiples servicios a las personas, en el momento que los deseen adquirir y donde los deseen adquirir, así como también se velara por el desarrollo de nuevas tecnologías que permitan mejorar la calidad de vida y la forma de como interactuamos con todo lo que nos rodea.</p>
            </div>
            <div>
                <Image src="https://i.pinimg.com/originals/b5/86/17/b586175e1ba2d5574965d6daaf2bfba0.jpg" alt="Imagen de EcoMachines Aynimar generada por IA" width={375} height={500} />
            </div>
        </>
    );
};
export default aboutUs;