import useWave from 'use-wave';
import WasteEditModal from './WasteEditModal';

const WasteEdit = ({ waste, setWastes }) => {
  const wave = useWave();

  return (
    <WasteEditModal waste={waste} setWastes={setWastes}>
      {({ setShowModal }) => (
        <button
          ref={wave}
          onClick={() => setShowModal(true)}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
        >
          Editar
        </button>
      )}
    </WasteEditModal>
  );
};

export default WasteEdit;
