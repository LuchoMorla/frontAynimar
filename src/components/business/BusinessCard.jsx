import { PlusIcon } from '@heroicons/react/solid';
import Image from 'next/image';
import useWave from 'use-wave';
import BusinessModal from './BusinessModal';
import Link from 'next/link';

const BusinessCard = ({ business, setBusiness, isAddeable = false, businessOwner }) => {
  // const fommatter = new Intl.NumberFormat('es-ES', {
  //   currency: 'PEN',
  //   minimumFractionDigits: 2,
  // });
  const wave = useWave();

  if (isAddeable) {
    return (
      <BusinessModal setBusiness={setBusiness} businessOwner={businessOwner}>
        {({ setShowModal }) => (
          <article onClick={() => setShowModal(true)} ref={wave} className="cursor-pointer w-48 min-h-[10rem] rounded-lg shadow-md flex flex-col">
            <div className="flex flex-col flex-1 items-center justify-center">
              <PlusIcon className="w-12" />

              <h2 className="font-bold text-center">Agrega un nuevo negocio</h2>
            </div>
          </article>
        )}
      </BusinessModal>
    );
  }

  return (
    <Link href={`/dashboard/business/${business.id}`}>
      <a>
        <article ref={wave} className="cursor-pointer w-48 max-w-full p-3 rounded shadow-md">
          <header className="overflow-hidden">
            <img className="w-30 rounded-t" src={business.image} alt={`Imagen de ${business.name}`} width={200} height={200} />
          </header>
          <div className="py-2">
            <h2 className="font-bold text-lg">{business.name}</h2>
            <p className="text-gray-500 text-sm">{business.description}</p>
          </div>
          <footer className="flex items-center justify-center py-3"></footer>
        </article>
      </a>
    </Link>
  );
};

export default BusinessCard;
