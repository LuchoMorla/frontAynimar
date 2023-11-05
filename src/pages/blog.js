import React from 'react';
import Script from 'next/script';
import styles from '@styles/Blog.module.scss';

const blog = () => {
    
    return (
        <div className={styles.blogContainter}>
            <p>Estamos en nuestras primeras etapas y actualmente llevamos a cabo una campaña de Crowdfunding para obtener el financiamiento necesario y poder ofrecerte un servicio de mayor calidad.</p>
                                <div id="widgets"></div>
                        <Script src='https://www.hazvaca.com/project/widgets_code/s/red/3408'
                                type='text/javascript'></Script>
        </div>
    );
};
export default blog;