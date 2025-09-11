import React from 'react';
import styles from '@styles/Blog.module.scss';
import Image from 'next/image';

const aboutUs = () => {
    
    return (
        <>
            <div className={styles.blogContainter}>
                {/* Título Principal */}
                <h2>Diseñado para ti, con una historia que contar</h2>

                {/* Párrafo de Bienvenida */}
                <p>¡Bienvenido/a a la familia Aynimar.com! Nos llena de alegría que estés aquí. Aynimar nació de un sueño: crear piezas únicas que no encontrarás en ninguna otra tienda. Creemos que lo que vistes es una forma de expresión, una manera de contarle al mundo quién eres sin decir una palabra.</p>
                
                {/* Subtítulo y Párrafo de Propósito */}
                <h3>Nuestra Misión: Tu Exclusividad</h3>
                <p>Nuestro propósito es claro: queremos que te sientas único/a. En un mundo lleno de tendencias pasajeras, apostamos por diseños que perduran y que te representan. Para nosotros, el mayor éxito es crear esa confianza en el mundo digital y demostrarte que las compras online pueden ser una experiencia cercana y excepcional.</p>

                {/* Subtítulo y Párrafo de Comunidad */}
                <h3>Creamos juntos esta comunidad</h3>
                <p>Aynimar es más que una tienda, es un proyecto que crece contigo. Tus ideas y sugerencias son el motor que nos impulsa a mejorar cada día. Nos encanta escucharte, tanto lo bueno como lo malo, para seguir evolucionando. ¡Ponte en contacto con nosotros cuando quieras!</p>
                <p>¡Gracias por acompañarnos en este viaje y por ayudarnos a crecer juntos!</p>

                {/* Lista de Beneficios */}
                <h3>¿Por qué comprar con nosotros?</h3>
                <ul>
                    <li><strong>Diseños que no encontrarás en otro lugar:</strong> Colecciones únicas y de moda pensadas para destacar.</li>
                    <li><strong>Compra con total tranquilidad:</strong> Procesamiento de pedidos seguro y protegido en una plataforma ágil y sencilla.</li>
                    <li><strong>Atención personalizada:</strong> Nuestro excelente servicio al cliente está aquí para ayudarte en lo que necesites.</li>
                    <li><strong>Envíos a toda tu localidad:</strong> Llevamos nuestros diseños exclusivos a cualquier rincón del país.</li>
                    <li><strong>Fomentamos tu confianza digital:</strong> Te acompañamos para que te sientas seguro/a comprando por internet.</li>
                    <li><strong>Beneficios exclusivos:</strong> Disfruta de promociones y descuentos especiales de forma continua.</li>
                </ul>
            </div>
            <div>
                <Image 
                    src="https://i.pinimg.com/originals/b5/86/17/b586175e1ba2d5574965d6daaf2bfba0.jpg" 
                    alt="Imagen de EcoMachines Aynimar generada por IA" 
                    width={375} 
                    height={500} 
                    layout="responsive" // Recomendado para que la imagen se adapte al contenedor
                />
            </div>
        </>
    );
};

export default aboutUs;