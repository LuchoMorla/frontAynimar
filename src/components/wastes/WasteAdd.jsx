import { PlusIcon } from '@heroicons/react/solid';
import useWave from 'use-wave';
import WasteModal from './WasteModal';

const WasteAdd = ({ business, setWastes }) => {
  const wave = useWave();
  return (
    <WasteModal business={business} setWastes={setWastes}>
      {({ setShowModal }) => (
        <button
          onClick={() => setShowModal(true)}
          ref={wave}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-56 gap-1"
        >
          <PlusIcon className="w-5" />
          Añadir materia prima
        </button>
      )}
    </WasteModal>
  );
};

export default WasteAdd;
