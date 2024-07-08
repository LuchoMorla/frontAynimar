import { useEffect, useRef, useState } from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { UploadIcon } from '@heroicons/react/outline';
import { ArrowLeftIcon, CameraIcon, CloudUploadIcon } from '@heroicons/react/solid';
import fromUriToBlob from 'libs/fromUriToBlob';
import useWave from 'use-wave';

const Upload = ({ className = '', textButton = 'Subir foto del producto (Opcional)', modalTitle = 'Subir imagen de producto', blobImage }) => {
  const [showModal, setShowModal] = useState(false);
  const [isCamera, setCamera] = useState(false);
  const [image, setImage] = useState(null);
  const fileEl = useRef(null);
  const lastAction = useRef('');
  const buttonFileUpload = useRef(null);

  const onOpen = () => setShowModal(true);
  const onClose = () => setShowModal(false);

  const handleClickIntenseUploadImage = (e) => {
    e.stopPropagation();

    fileEl.current.click();
  };

  const handleChangeUploadImage = (e) => {
    const [file] = e.target.files;
    if (file.type.startsWith('image')) setImage(file);
    lastAction.current = 'submit-photo';
  };

  useEffect(() => {
    if (!showModal) {
      setImage(null);
      setCamera(false);
    }
  }, [showModal]);

  const handleDragOver = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleDragLeave = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const notChild = !e.relatedTarget || ![...e.target.childNodes].some((ch) => ch.nodeName === e.relatedTarget.nodeName);

    if (e.target.nodeName === 'BUTTON' && notChild) {
      buttonFileUpload.current.classList.remove('bg-[rgba(239,244,255,0.15)]');
    }
  };

  const handleDragEnter = (e) => {
    e.stopPropagation();
    e.preventDefault();

    buttonFileUpload.current.classList.add('bg-[rgba(239,244,255,0.15)]');
  };

  const handleDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const dt = e.dataTransfer;
    const [file] = dt.files;

    if (file.type.startsWith('image')) setImage(file);
    lastAction.current = 'submit-photo';
  };

  const handlePressToggleCamera = () => {
    setCamera(!isCamera);
  };

  const handleTakePhoto = (uri) => {
    setImage(fromUriToBlob(uri));
    lastAction.current = 'take-photo';
  };

  const handleRefreshImage = () => {
    if (lastAction.current === 'take-photo') {
      setCamera(true);
    }
    setImage(false);
  };

  useEffect(() => {
    const handlePaste = async (e) => {
      let imageFind = false;

      if (e instanceof ClipboardEvent) {
        [...e.clipboardData.items].forEach((item) => {
          if (imageFind) return;

          if (item.type.startsWith('image')) {
            setImage(item.getAsFile());
            imageFind = true;
          }
        });
      }
    };

    document.addEventListener('paste', handlePaste);

    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  const handleSubmitImage = () => {
    blobImage.current = image;
    onClose();
  };

  const waveRef = useWave();

  return (
    <>
      <button type="button" ref={waveRef} onClick={onOpen} className={'bg-slate-100 rounded p-2 flex-[100%] items-center flex flex-col '.concat(className)}>
        <UploadIcon className="w-12" />
        {blobImage.current ? `Archivo escogido: ${blobImage.current.name}` : textButton}
      </button>
      {showModal && (
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative w-auto my-6 mx-auto max-w-3xl">
            {/*content*/}
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              {/*header*/}
              <header className="flex items-start justify-between px-5 py-3 border-b border-solid border-blueGray-200 rounded-t">
                <h3 className="text-xl font-semibold">{modalTitle}</h3>
                <button className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none" onClick={onClose}>
                  <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
                </button>
              </header>
              {/*body*/}
              <div className="relative p-6 flex-auto flex flex-col gap-2 has-[img]:items-center max-w-md">
                {!image ? (
                  <>
                    {isCamera ? (
                      <>
                        <Camera onTakePhotoAnimationDone={handleTakePhoto} />
                        <button ref={waveRef} onClick={handlePressToggleCamera} className="rounded py-2 flex items-center justify-center bg-teal-600 gap-2 text-foreground-100 font-semibold" size="lg">
                          <ArrowLeftIcon className="w-7" />
                          Volver atrás
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          ref={buttonFileUpload}
                          onClick={handleClickIntenseUploadImage}
                          className="flex flex-col gap-2 items-center shadow-[0_0_0_0.15rem_theme(colors.gray.700)] py-3 rounded transition-background duration-[0.25s]"
                          onDragEnter={handleDragEnter}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                            />
                          </svg>

                          <h3>Sube tu imagen o arrastralo</h3>
                          <input ref={fileEl} onChange={handleChangeUploadImage} type="file" className="hidden" accept="image/*" />
                        </button>
                        <button ref={waveRef} onClick={handlePressToggleCamera} className="justify-center text-sm p-2 rounded-lg flex items-center bg-teal-600 gap-2 text-foreground-100 font-semibold">
                          <CameraIcon className="w-6" />
                          Tomar foto
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <img src={URL.createObjectURL(image)} alt="Imagen de testeo" className="max-h-96" />
                    <button onClick={handleRefreshImage} ref={waveRef} className="flex items-center justify-center py-2 bg-teal-600 gap-2 text-foreground-100 font-semibold rounded-md px-2" size="lg">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.25} stroke="currentColor" className="w-5">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                        />
                      </svg>
                      Reehacer o reelegir imagen
                    </button>
                  </>
                )}
              </div>
              {/*footer*/}

              <footer className="flex items-center gap-2 justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                <button className="text-red-600" onClick={onClose}>
                  Cancelar
                </button>
                <button ref={waveRef} className="bg-gray-800 text-slate-50 py-2 px-4 rounded" type="button" onClick={handleSubmitImage}>
                  Subir
                </button>
              </footer>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Upload;
