import axios from 'axios';
import endPoints from '@services/api';

const updateOrder = async (id, body) => {
    const config = {
        headers: {
            accept: '*/*',
            'Content-Type': 'application/json',
        },
    };

    try {
        const response = await axios.patch(endPoints.orders.updateOrder(id), body, config);
        return response.data;
    } catch (err) {
        console.log(err);
    }

};

export { updateOrder };