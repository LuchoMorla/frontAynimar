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

const updateRecycler = async (id, body) => {
  const config = {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.patch(endPoints.recyclers.updateRecycler(id), body, config);
  return response.data;
};

const createRecyclerByCustomer = async () => {
  const config = {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.post(endPoints.profile.createRecyclerBC, config);
  return response.data;
};

export { addRecycler, updateRecycler, createRecyclerByCustomer };