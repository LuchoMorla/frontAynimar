import ProductCard from "@components/product/ProductCard";
import endPoints from "@services/api";
import axios from "axios";
import { useState } from "react";
import ProductAdd from "@components/product/ProductAdd";
import WasteAdd from "@components/wastes/WasteAdd";
import WasteCard from "@components/wastes/WasteCard";
import OffersChar from "@components/business/offers/OffersChar";

import BusinessLastSalesProducts from "@components/business/BusinessLastSalesProducts";
import BusinessNav from "@components/business/BusinessNav";

export const getServerSideProps = async (context) => {
  const { id } = context.params;

  const { data } = await axios.get(endPoints.business.getOne(id), {
    headers: {
      'Authorization': `Bearer ${context.req.cookies.token}`
    }
  });

  const { data: orders } = await axios.get(endPoints.orders.getOrdersByBusinessId(data.id), {
    headers: {
      'Authorization': `Bearer ${context.req.cookies.token}`
    }
  });

  return {
    props: {
      business: data,
      orders,
    }
  }
}

const BusinessPage = ({ business, orders }) => {
  return (
    <section className="w-full mx-auto grid grid-rows-1 grid-cols-1 md:grid-cols-[10%_90%]">
      <BusinessNav business={business} />

      <section className="flex gap-2 flex-col">
        <div className="flex flex-col gap-8">
          <div className="w-full h-[30dvh] overflow-hidden" style={{
            backgroundImage: `url(${business.image})`,
            backgroundPosition: "center",
            backgroundPositionY: "-30dvh",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundClip: "border-box",
          }}>

          </div>
          <div className="px-4 pb-4 flex flex-col">
            <h1 className="text-5xl font-bold mb-4 first-letter:uppercase">{business.name}</h1>
            <p className="text-gray-600 mb-4 first-letter:uppercase">{business.description}</p>
            <article className="">
              <div className="flex justify-center flex-col gap-3">
                <h3 className="text-2xl font-semibold">Últimos productos vendidos</h3>

                <BusinessLastSalesProducts orders={orders} />

              </div>
            </article>
          </div>
        </div>
      </section>
    </section>
  );
}

export default BusinessPage;