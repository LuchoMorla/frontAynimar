import WasteDelete from './WasteDelete';
import WasteEdit from './WasteEdit';

const WasteCard = ({ waste, setWastes }) => {
  const fommatter = new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
  });

  return (
    <article className="w-48 rounded shadow-md">
      <header className="overflow-hidden h-44">
        <div
          className="w-full h-full overflow-hidden"
          style={{
            backgroundImage: `url(${waste.image})`,
            backgroundPosition: 'center',
            backgroundPositionY: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundClip: 'border-box',
          }}
        ></div>
      </header>
      <div className="px-3 py-2">
        <h2 className="font-bold">{waste.name}</h2>
        <h3>Precio: ${fommatter.format(waste.price)}</h3>
        <p className="text-gray-500">{waste.description}</p>
      </div>
      <footer className="flex items-center justify-center py-3 gap-2">
        <WasteEdit waste={waste} setWastes={setWastes} />
        <WasteDelete waste={waste} setWastes={setWastes} />
      </footer>
    </article>
  );
};

export default WasteCard;
