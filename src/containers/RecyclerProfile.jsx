  import React, { useState } from "react";
  import axios from "axios";
  import endPoints from "@services/api";
  import { useRouter } from "next/router";
  import { createRecyclerByCustomer } from '@services/api/entities/recyclers';
  import Recycler from "@components/Recycler";

  const recyclerProfile = () => {
      const [recycler, setRecycler] = useState('vacio');
      const router = useRouter(); 
      
      const recyclerData = async () => {
        const { data: fetch } = await axios.get(endPoints.profile.recyclerData);
        setRecycler(fetch);
        return fetch;
      }
      if(recycler == 'vacio') {
        recyclerData()
        .catch((error) => {
          if (error.response?.status === 401) {
            window.alert('Probablemente necesites iniciar sesion de nuevo');
          } else if (error.response) {
            console.log('Algo salio mal: ' + error.response.status);
          }
          })
      }
      if(recycler == null) {
        const ejecutar = async () => {
          await createRecyclerByCustomer()
        }
        ejecutar()
          .then(() => {
            router.push('/mi_cuenta/recycler');
          })
          .catch((error) => {
            if (error.response) {
              window.alert('cbci => Algo salio mal: ' + error.response.status + ' presiona aceptar mientras lo arreglamos, si no sé soluciona despues de refrescar la pagina recuerda que puedes contactarnos.');
              router.reload(window.location.pathname);
            }
          });
      }
      
      return <Recycler recycler={recycler} />
  }
  export default recyclerProfile;