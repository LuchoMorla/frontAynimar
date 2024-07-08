import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import endPoints from '@services/api';
import Upload from '@components/shared/Upload';
import Cookies from 'js-cookie';
import { AnimatePresence, motion } from 'framer-motion';

const ProductEditModal = ({ children, product, setProducts }) => {
  const [isOther, setOther] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const blobImage = useRef(null);
  const blobCategory = useRef(null);

  const handleSubmitEditModal = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { name, description, categoryOther, category: categoryKey, price } = Object.fromEntries(formData.entries());

    let categoryId = +categoryKey;
    let productFileURL = '';

    if (blobImage.current) {
      const { data: productFile } = await axios.post(
        endPoints.files.addImage,
        {
          img: blobImage.current,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      productFileURL = productFile.file.url;
    }

    if (isOther) {
      const { data: categoryFile } = await axios.post(
        endPoints.files.addImage,
        {
          img: blobCategory.current,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const { data: category } = await axios.post(endPoints.categories.addCategory, {
        name: categoryOther,
        image: categoryFile.file.url,
      });
      categoryId = category.id;
    }

    const body = {
      name,
      description,
      price: +price,
      image: productFileURL,
      categoryId,
    };

    const bodyFiltered = Object.fromEntries(Object.entries(body).filter(([key, value]) => value && value !== product[key]));

    const { data: productUpdated } = await axios.patch(endPoints.products.updateProducts(product.id), bodyFiltered);

    setProducts((products) => products.map((product) => (product.id === +productUpdated.id ? productUpdated.rta : product)));

    handleClickClose();
  };

  const gettingCategories = async () => {
    const { data } = await axios.get(endPoints.categories.getCategoriesList, {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    });
    setCategories(data);
  };

  useEffect(() => {
    gettingCategories();
  }, []);

  const handleChangeSelectCategory = (e) => {
    setOther(e.target.value === 'other');
  };

  const handleClickClose = () => {
    blobImage.current = null;
    blobCategory.current = null;
    setOther(false);
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
                    <h3 className="text-xl font-semibold">Edita el producto</h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    >
                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                    <form onSubmit={handleSubmitEditModal} id="form-create-product" className="flex flex-col gap-2">
                      <div>
                        <label htmlFor="name-product" className="sr-only">
                          Nombre
                        </label>
                        <input
                          defaultValue={product.name}
                          id="name-product"
                          name="name"
                          type="text"
                          autoComplete="name"
                          required
                          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                          placeholder="Nombre del producto"
                        />
                      </div>
                      <div>
                        <label htmlFor="description-product" className="sr-only">
                          Descripción
                        </label>
                        <input
                          defaultValue={product.description}
                          id="description-product"
                          name="description"
                          type="text"
                          required
                          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                          placeholder="Descripción del producto"
                        />
                      </div>
                      <div>
                        <label htmlFor="price-product" className="sr-only">
                          Precio
                        </label>
                        <input
                          defaultValue={product.price}
                          id="price-product"
                          name="price"
                          type="number"
                          min={0}
                          required
                          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                          placeholder="Precio del producto"
                        />
                      </div>
                      <div>
                        <label htmlFor="category-product" className="sr-only">
                          Categoría
                        </label>
                        <select
                          onChange={handleChangeSelectCategory}
                          id="category-product"
                          name="category"
                          type="text"
                          required
                          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                          placeholder="Categoría del producto"
                        >
                          {categories.map((category) => (
                            <option selected={category.id === product.categoryId} key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                          <option value="other">Otro</option>
                        </select>
                      </div>
                      <AnimatePresence>
                        {isOther && (
                          <motion.div
                            className="flex flex-col items-center justify-center gap-2"
                            initial={{
                              opacity: 0,
                            }}
                            animate={{
                              opacity: 1,
                            }}
                            exit={{
                              opacity: 0,
                            }}
                          >
                            <label htmlFor="category-other-product" className="sr-only">
                              Nueva categoria
                            </label>
                            <input
                              id="category-other-product"
                              name="categoryOther"
                              type="text"
                              required
                              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                              placeholder="Otra categoría"
                            />
                            <Upload className="w-full bg-teal-100" textButton="Sube la imagen de la categoría" modalTitle="Subir imagen de la categoría" blobImage={blobCategory} />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <Upload textButton="Sube la nueva imagen del producto" modalTitle="Subir la nueva imagen del producto" blobImage={blobImage} />
                    </form>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={handleClickClose}
                    >
                      Cerrar
                    </button>
                    <button
                      form="form-create-product"
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-4 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="submit"
                    >
                      Editar producto
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.25 }} exit={{ opacity: 0 }} className="opacity-25 fixed inset-0 z-40 bg-black"></motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductEditModal;
