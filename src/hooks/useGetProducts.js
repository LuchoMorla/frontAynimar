import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchProducts = (endPoint) => {
  const [data, setData] = useState([]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endPoint]);

  return data;
};

export default useFetchProducts;