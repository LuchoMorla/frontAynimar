import useWave from 'use-wave';
import WasteDeleteModal from './WasteDeleteModal';

const WasteDelete = ({ waste, setWastes }) => {
  const wave = useWave();

  return (
    <WasteDeleteModal waste={waste} setWastes={setWastes}>
      {({ setShowModal }) => (
        <button
          ref={wave}
          onClick={() => setShowModal(true)}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Eliminar
        </button>
      )}
    </WasteDeleteModal>
  );
};

export default WasteDelete;
