import React, { useState } from 'react';
import useBusinessOwner from '@hooks/useBusinessOwner.js';
import BusinessCard from '@components/business/BusinessCard';
import endPoints from '@services/api';
import axios from 'axios';

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
  // const business = useFetch(endPoints.business.getAllBusiness);
  // const products = useFetch(endPoints .products.getProducts(PRODUCT_LIMIT, offsetProducts), offsetProducts);
  // const totalProducts = useFetch(endPoints.products.getProducts(0, 0)).length;

  /* vamos a extraer la información que tenemos de nuestros productos para crear una grafica con chart */

  // const categoryName = products?.map((product) => product.category);
  // const categoryCount = categoryName?.map((category) => category.name);



  // console.log(business)
  // const countOcurrences = (arr) => arr.reduce((prev, curr) => ((prev[curr] = ++prev[curr] || 1), prev), {});

  // const data = {
  //   datasets: [{
  //     label: 'Categories',
  //     data: countOcurrences(categoryCount),
  //     borderWindth: 2,
  //     backgroundColor: ['#ffbb11', '#ff0000', '#c0c0c0', '#50AF95', '#f3ba', '#61d1ed', '#2a71d0'],
  //   }]
  // }
  return (
    <>
      {/* {totalProducts > 0 && <Pagination totalItems={totalProducts} itemsPerPage={PRODUCT_LIMIT} setOffset={setOffsetProducts} neighbours={3}></Pagination>} */}
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle min-w-full sm:px-6 lg:px-8 flex flex-col gap-2">
            <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
            <p>Podrás revisar tus negocios desde aquí con un solo click</p>
            <div className='flex gap-2 py-3'>
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
    </>
  );
}