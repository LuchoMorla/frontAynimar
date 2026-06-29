import { useState, useEffect } from 'react';
import axios from 'axios';

const useGetProducts = (endPoint, initialData = []) => {
  const [data, setData] = useState(initialData);

  async function fetchData() {
    const response = await axios.get(endPoint);
    setData(response.data);
  }

  useEffect(() => {
    try {
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, [endPoint]);

  return data;
};

export default useGetProducts;