import axios from 'axios'; 
import endPoints from '@services/api';
const addToPacket = async (orderId, productId, amount) => {
    const config = {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
        },
      };
    const packet = {
        orderId: orderId,
        productId: productId,
        amount: amount
    };
    const addProductToThePacked = await axios.post(endPoints.orders.postItem, packet, config);
    return addProductToThePacked;
};
export default addToPacket;