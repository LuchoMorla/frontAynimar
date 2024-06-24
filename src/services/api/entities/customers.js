import axios from 'axios';
import endPoints from '@services/api';

const addCustomer = async (body) => {
  const config = {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.post(endPoints.customers.postCustomers, body, config);
  return response.data;
};

const updateCustomer = async (id, body) => {
  const config = {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.patch(endPoints.customers.updateCustomer(id), body, config);
  return response.data;
};

const createCustomerByRecycler = async () => {
  const config = {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.post(endPoints.profile.createClientBR, config);
  return response.data;
};

export { addCustomer, updateCustomer, createCustomerByRecycler };