import endPoints from "@services/api";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const useBusiness = (businessOwner) => {
  const [business, setBussiness] = useState([]);

  const getBusiness = useCallback(async () => {
    // try {
    //   const { data } = await axios.get(endPoints.business.getAllBusiness(businessOwner.));
    //   setBussiness(data);
    // } catch (error) {
    //   console.error(error);
    // }
  }, [businessOwner]);

  useEffect(() => {
    getBusiness();
  }, [businessOwner, getBusiness]);
  return business;
}

export default useBusiness;