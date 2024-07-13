import ProductDelete from './ProductDelete';
import ProductEdit from './ProductEdit';

const ProductCard = ({ product, setProducts }) => {
  const fommatter = new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
  });

  return (
    <article className="w-48 max-h-80 rounded shadow-md">
      <header className="overflow-hidden h-44">
        <div
          className="w-full h-full overflow-hidden"
          style={{
            backgroundImage: `url(${product.image})`,
            backgroundPosition: 'center',
            backgroundPositionY: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundClip: 'border-box',
          }}
        ></div>
      </header>
      <div className="px-3 py-2">
        <h2 className="font-bold">{product.name}</h2>
        <h3>Precio: ${fommatter.format(product.price)}</h3>
        <p className="text-gray-500">{product.description}</p>
      </div>
      <footer className="flex items-center justify-center py-3 gap-2">
        <ProductEdit product={product} setProducts={setProducts} />
        <ProductDelete product={product} setProducts={setProducts} />
      </footer>
    </article>
  );
};

export default ProductCard;
