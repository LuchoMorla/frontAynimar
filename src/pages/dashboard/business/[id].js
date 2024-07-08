import ProductCard from "@components/product/ProductCard";
import endPoints from "@services/api";
import axios from "axios";
import { useState } from "react";
import ProductAdd from "@components/product/ProductAdd";
import WasteAdd from "@components/wastes/WasteAdd";
import WasteCard from "@components/wastes/WasteCard";

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

const BusinessPage = ({ business }) => {
  const [products, setProducts] = useState(business.products);
  const [wastes, setWastes] = useState(business.wastes);

  return (
    <main className="container mx-auto">
      <img className="w-full object-cover" src={business.image} alt={business.name} />

      <h1 className="text-5xl font-bold mb-4 first-letter:uppercase">{business.name}</h1>
      <p className="text-gray-600 mb-4">{business.description}</p>

      <section className="grid grid-cols-2">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Productos</h2>

          <ProductAdd business={business} setProducts={setProducts} />
          <div className="flex gap-2 flex-wrap">
            {products.map((product) => (
              <ProductCard setProducts={setProducts} product={product} key={product.id} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Materia prima</h2>
          <WasteAdd business={business} setWastes={setWastes} />
          <div className="flex gap-2 flex-wrap">
            {wastes.map((waste) => (
              <WasteCard key={waste.id} waste={waste} setWastes={setWastes} />
            ))}
          </div>
        </div>
      </section>
    </main>);
}

export default BusinessPage;