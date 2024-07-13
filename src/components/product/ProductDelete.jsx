import useWave from 'use-wave';
import ProductDeleteModal from './ProductDeleteModal';

const ProductDelete = ({ product, setProducts }) => {
  const wave = useWave();

  return (
    <ProductDeleteModal product={product} setProducts={setProducts}>
      {({ setShowModal }) => (
        <button
          ref={wave}
          onClick={() => setShowModal(true)}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Eliminar
        </button>
      )}
    </ProductDeleteModal>
  );
};

export default ProductDelete;
