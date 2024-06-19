import axios from 'axios';
import endPoints from '@services/api';

const sendTransaction = async (body) => {
    const config = {
        headers: {
            accept: '*/*',
            'Content-Type': 'application/json',
        },
    };

    try {
        const response = await axios.post(endPoints.transaction.debits, body, config);
        return response;
    } catch (err) {
        console.log(err);
    }

};

export { sendTransaction };