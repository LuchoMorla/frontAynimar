import { useState } from 'react';
import axios from 'axios';
import endPoints from '@services/api';
import useAlert from '@hooks/useAlert';
import ALert from '@common/Alert';
import ProductAdd from '@components/product/ProductAdd';
import ProductCard from '@components/product/ProductCard';
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

export default function Products({ business }) {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState(business.products);
  const { alert, setAlert, toggleAlert } = useAlert();

  return (
    <section className="w-full mx-auto grid grid-rows-1 md:grid-cols-[10%_90%]">
      <BusinessNav business={business} />
      <ALert alert={alert} handleClose={toggleAlert} />
      <div className="flex flex-1 flex-col p-4">
        <div className='flex flex-col gap-2'>
          <h2 className="text-4xl font-bold">Productos</h2>
          <p className="text-gray-600 mb-4 first-letter:uppercase">Podrá ver todos sus productos actuales.</p>
        </div>

        <ProductAdd business={business} setProducts={setProducts} />
        <div className={
          "flex gap-2 flex-wrap pt-3 flex-1 items-center".concat(products.length <= 0 ? " justify-center" : " justify-start")
        }>
          {products.length <= 0 ? (
            <h4 className='font-semibold text-3xl'>Aún no tienes productos.</h4>
          ) : products.map((product) => (
            <ProductCard setProducts={setProducts} product={product} key={product.id} />
          ))}
        </div>
      </div>

    </section>
  );
}
