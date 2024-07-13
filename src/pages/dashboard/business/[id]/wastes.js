import { useState } from 'react';
import axios from 'axios';
import endPoints from '@services/api';
import useAlert from '@hooks/useAlert';
import ALert from '@common/Alert';
import { deleteProduct } from '@services/api/products';
import ProductCard from '@components/product/ProductCard';
import WasteAdd from '@components/wastes/WasteAdd';
import WasteCard from '@components/wastes/WasteCard';
import BusinessNav from '@components/business/BusinessNav';

export const getServerSideProps = async (context) => {
  const { id } = context.params;

  const { data } = await axios.get(endPoints.business.getOne(id), {
    headers: {
      'Authorization': `Bearer ${context.req.cookies.token}`
    }
  });

  return {
    props: {
      business: data
    }
  }
}

export default function Wastes({ business }) {
  const [open, setOpen] = useState(false);
  const [wastes, setWastes] = useState(business.wastes);
  const { alert, setAlert, toggleAlert } = useAlert();


  return (
    <section className="w-full mx-auto grid grid-rows-1 md:grid-cols-[10%_90%]">
      <BusinessNav business={business} />
      <ALert alert={alert} handleClose={toggleAlert} />
      <div className="flex flex-1 flex-col p-4 ">
        <div className='flex flex-col gap-2'>
          <h2 className="text-4xl font-bold">Materia prima</h2>
          <p className="text-gray-600 mb-4 first-letter:uppercase">Vea su materia prima disponible.</p>
        </div>

        <WasteAdd business={business} setWastes={setWastes} />
        <div className={
          "flex gap-2 flex-wrap pt-3 flex-1 items-center".concat(wastes.length <= 0 ? " justify-center" : " justify-start")
        }>
          {wastes.length <= 0 ? (
            <h4 className='font-semibold text-3xl'>Aún no tienes materia prima creada.</h4>
          ) : wastes.map((waste) => {
            return (
              <WasteCard setWastes={setWastes} waste={waste} key={waste.id} />
            )
          })}
        </div>
      </div>

    </section>
  );
}
