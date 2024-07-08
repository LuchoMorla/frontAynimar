import useWave from 'use-wave';
import ProductEditModal from './ProductEditModal';

const ProductEdit = ({ setProducts, product }) => {
  const wave = useWave();

  return (
    <ProductEditModal product={product} setProducts={setProducts}>
      {({ setShowModal }) => (
        <button
          ref={wave}
          onClick={() => setShowModal(true)}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
        >
          Editar
        </button>
      )}
    </ProductEditModal>
  );
};

export default ProductEdit;
