import { useRef, useState } from 'react';
import axios from 'axios';
import endPoints from '@services/api';
import Upload from '@components/shared/Upload';

const BusinessModal = ({ children, businessOwner, business, setBusiness }) => {
  const [showModal, setShowModal] = useState(false);
  const blobImage = useRef(null);
  const handleSubmitAddBusiness = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { name, description } = Object.fromEntries(formData.entries());

    const { data } = await axios.post(
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

    const { data: newBusiness } = await axios.post(endPoints.business.create, {
      name,
      description,
      image: data.file.url,
      ownerId: businessOwner.id,
    });

    setBusiness((business) => [...business, newBusiness]);

    setShowModal(false);
  };
  return (
    <>
      {children({ setShowModal, showModal })}
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between px-5 py-3 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-xl font-semibold">Crear negocio</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <form onSubmit={handleSubmitAddBusiness} id="form-create-business" className="flex flex-col gap-2">
                    <div>
                      <label htmlFor="name-business" className="sr-only">
                        Nombre
                      </label>
                      <input
                        id="name-business"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Nombre del negocio"
                      />
                    </div>
                    <div>
                      <label htmlFor="description-business" className="sr-only">
                        Descripción
                      </label>
                      <input
                        id="description-business"
                        name="description"
                        type="text"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Descripción del negocio c"
                      />
                    </div>
                    <Upload textButton="Sube la imagen de tu negocio" modalTitle="Subir imagen del negocio" blobImage={blobImage} />
                  </form>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Cerrar
                  </button>
                  <button
                    form="form-create-business"
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-4 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="submit"
                  >
                    Crear negocio
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default BusinessModal;
