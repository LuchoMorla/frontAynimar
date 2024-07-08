import ProductEdit from './ProductEdit';

const ProductCard = ({ product, setProducts }) => {
  const fommatter = new Intl.NumberFormat('es-ES', {
    currency: 'PEN',
    minimumFractionDigits: 2,
  });

  return (
    <article className="w-48 rounded shadow-md">
      <header className="overflow-hidden max-h-44">
        <img className="w-30 rounded-t" src={product.image} alt={`Imagen de ${product.name}`} />
      </header>
      <div className="px-3 py-2">
        <h2 className="font-bold">{product.name}</h2>
        <h3>Precio: ${fommatter.format(product.price)}</h3>
        <p className="text-gray-500">{product.description}</p>
      </div>
      <footer className="flex items-center justify-center py-3">
        <ProductEdit product={product} setProducts={setProducts} />
      </footer>
    </article>
  );
};

export default ProductCard;
