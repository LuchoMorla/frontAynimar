import { PlusIcon } from '@heroicons/react/solid';
import useWave from 'use-wave';
import ProductModal from './ProductModal';

const ProductAdd = ({ business, setProducts }) => {
  const wave = useWave();
  return (
    <ProductModal business={business} setProducts={setProducts}>
      {({ setShowModal }) => (
        <button
          onClick={() => setShowModal(true)}
          ref={wave}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-1/3 gap-1"
        >
          <PlusIcon className="w-5" />
          Añadir producto
        </button>
      )}
    </ProductModal>
  );
};

export default ProductAdd;
