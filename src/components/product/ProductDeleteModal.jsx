import { useState } from 'react';
import axios from 'axios';
import endPoints from '@services/api';
import Cookies from 'js-cookie';
import { AnimatePresence, motion } from 'framer-motion';
import { toast, Toaster } from 'sonner';

const ProductDeleteModal = ({ children, product, setProducts }) => {
  const [showModal, setShowModal] = useState(false);

  const handleClickDelete = async () => {
    try {
      await axios.delete(endPoints.products.deleteProduct(product.id), {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });
      setProducts((products) => products.filter((p) => p.id !== product.id));
      toast.success('Producto eliminado correctamente.');
    } catch (err) {
      console.log(err);
      toast.error('Tienes ofertas de este producto, no puedes eliminarla.');
    }

    handleClickClose();
  };

  const handleClickClose = () => {
    setShowModal(false);
  };

  return (
    <>
      {children({ setShowModal, showModal })}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between px-5 py-3 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="text-xl font-semibold">Estas a punto de eliminar un producto</h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    >
                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto flex items-center flex-col">
                    <h3 className="font-semibold">Estas seguro de eliminar {`"${product.name}"`}.</h3>
                    <p className="text-small text-gray-500">Recuerda que este proceso es irreversible.</p>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="text-slate-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={handleClickClose}
                    >
                      Cerrar
                    </button>
                    <button
                      onClick={handleClickDelete}
                      className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-4 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="submit"
                    >
                      Eliminar producto
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.25 }} exit={{ opacity: 0 }} className="opacity-25 fixed inset-0 z-40 bg-black"></motion.div>
          </>
        )}
      </AnimatePresence>
      <Toaster richColors closeButton />
    </>
  );
};

export default ProductDeleteModal;
