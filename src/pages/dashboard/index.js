import React, { useState } from 'react';
import useBusinessOwner from '@hooks/useBusinessOwner.js';
import BusinessCard from '@components/business/BusinessCard';
import endPoints from '@services/api';
import axios from 'axios';
import BusinessNav from '@components/business/BusinessNav';

export const getServerSideProps = async (context) => {
  const { data: profile } = await axios.get(endPoints.auth.profile, {
    headers: {
      'Authorization': `Bearer ${context.req.cookies.token}`
    }
  });
  const { data: businessOwner } = await axios.get(endPoints.businessOwner.getBusinessOwnerByUser(profile.sub), {
    headers: {
      'Authorization': `Bearer ${context.req.cookies.token}`
    }
  });

  return {
    props: {
      businessOwner,
    }
  }
}

export default function Dashboard({ businessOwner: owner }) {
  // const request = new NextRequest();
  // console.log(request)
  const [businessOwner, {
    business,
    setBusiness
  }] = useBusinessOwner(owner);


  // console.log(businessOwner)
  /* trabajamos lo que es el paginado de la impresion de productos */

  const PRODUCT_LIMIT = 10;

  const [offsetProducts, setOffsetProducts] = useState(0);

  return (
    <section className="w-full mx-auto grid grid-rows-1 grid-cols-1 sm:grid-cols-[10%_90%]">
      <BusinessNav business={business} />
      <div className="flex flex-col p-4">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle min-w-full sm:px-6 lg:px-8 flex flex-col gap-2">
            <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
            <p>Podrás revisar tus negocios desde aquí con un solo click</p>
            <div className='flex gap-2 py-3 flex-wrap'>
              {
                business.length <= 0 ? <BusinessCard businessOwner={businessOwner} setBusiness={setBusiness} isAddeable /> :
                  <>
                    {business?.map((business) => (
                      <BusinessCard key={business.id} business={business} />
                    ))}
                    <BusinessCard businessOwner={businessOwner} setBusiness={setBusiness} isAddeable />
                  </>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}