import React from 'react';
import Script from 'next/script';
import styles from '@styles/Blog.module.scss'

const blog = () => {
    
    return (
        <div className={styles.blogContainter}>
            <p>Como estamos en nuestros inicios, nos encontramos haciendo una campaña de Crownfounding y conseguir ese financiamiento para darte un mejor servicio.</p>
                                <div id="widgets"></div>
                        <Script src='https://www.hazvaca.com/project/widgets_code/s/red/3408'
                                type='text/javascript'></Script>
        </div>
    );
}
export default blog;