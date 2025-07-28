import React, { useEffect, useState } from 'react';
import Cookie from 'js-cookie';
import jwt from 'jsonwebtoken';
import endPoints from '@services/api/index';/* 
import useFetchOrders from '@hooks/useGetOrders'; */
import router from 'next/router';
import axios from 'axios';
import MostrarOrders from '@components/MostrarOrders';
import styles from '@styles/OrderCustomer.module.scss';
import { toast } from 'react-toastify';

const OrdersList = () => {

    const [uId, setUId] = useState('no hay Id');
    const [stockorders, setStockorders] = useState([]);
    const [mostrar, setMostrar] = useState(false);

    const efectivizar = async (userId) => {
        if (userId == 'no hay Id') {
          return;
        }
        const { data: orders } = await axios.get(endPoints.orders.getOrderByUI(userId));
        console.log('viendo ordenes');
        console.log(orders);
        setStockorders(orders);
        setMostrar(true);
    };

    const getCookieUser = () => {
        const token = Cookie.get('token');
        if(!token){
          toast.error('necesitas iniciar session');
          router.push('/login');
        } /* 
        setuId(token);*/
        return token;
     };
    
    useEffect( () => {

        const hiToken = getCookieUser();
        if (!hiToken) return;
        const decodificado = jwt.decode(hiToken, { complete: true });
        const userId = decodificado.payload.sub;
        setUId(userId);
        efectivizar(userId);
      }, []);

/*       if(uId != 'no hay Id') {
        efectivizar();
      } */

	return (
    <section className={styles["main-container"]}>
			<div className={styles.ProductList}>
				{ mostrar ? stockorders.map(order => (
					<MostrarOrders order={order} key={order.id} />
				))
        :
        <p>No tienes Ordenes</p>
      }
			</div>
		</section>
	);
}

export default OrdersList;