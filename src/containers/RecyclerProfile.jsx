  import React, { useState } from "react";
  import axios from "axios";
  import endPoints from "@services/api";
  import Recycler from "@components/Recycler";

  const recyclerProfile = () => {
      const [recycler, setRecycler] = useState('vacio');
      
      const recyclerData = async () => {
        const { data: fetch } = await axios.get(endPoints.profile.recyclerData);
        setRecycler(fetch);
        return fetch;
      }
      if(recycler == 'vacio') {
        recyclerData()
        .catch((error) => {
          if (error.response?.status === 401) {
            alert('Probablemente necesites iniciar sesion de nuevo');
          } else if (error.response) {
            console.log('Algo salio mal: ' + error.response.status);
          }
          })
      }
      
      return <Recycler recycler={recycler} />
  }
  export default recyclerProfile;