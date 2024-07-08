import Image from 'next/image';
import WasteEdit from './WasteEdit';

const WasteCard = ({ waste, setWastes }) => {
  const fommatter = new Intl.NumberFormat('es-ES', {
    currency: 'PEN',
    minimumFractionDigits: 2,
  });

  return (
    <article className="w-48 rounded shadow-md">
      <header className="overflow-hidden">
        <img className="w-30 rounded-t" src={product.image} alt={`Imagen de ${product.name}`} />
      </header>
      <div className="px-3 py-2">
        <h2 className="font-bold">{waste.name}</h2>
        <h3>Precio: ${fommatter.format(waste.price)}</h3>
        <p className="text-gray-500">{waste.description}</p>
      </div>
      <footer className="flex items-center justify-center py-3">
        <WasteEdit waste={waste} setWastes={setWastes} />
      </footer>
    </article>
  );
};

export default WasteCard;
