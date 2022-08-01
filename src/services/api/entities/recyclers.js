import axios from 'axios';
import endPoints from '@services/api';

const addRecycler = async (body) => {
  const config = {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.post(endPoints.recyclers.postRecyclers, body, config);
  return response.data;
};

export { addRecycler };