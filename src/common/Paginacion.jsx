import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';

const Paginate = ({ totalItems, itemsPerPage, neighbours, setOffset }) => {
  const items = [];
  const [current, setCurrent] = useState(1);
  const totalPage = Math.ceil(totalItems / itemsPerPage);
  const end = Math.min(Math.max(neighbours * 2 + 2, neighbours + current + 1), totalPage + 1);
  const start = Math.min(Math.max(end - (neighbours * 2 + 1), 1), Math.max(current - neighbours, 1));

  for (let i = start; i < end; i++) {
    items.push(
      <a
        key={`Paginador-${i}`}
        onClick={() => {
          setCurrent(i);
          setOffset((i - 1) * itemsPerPage);
        }}
        href="#"
        aria-current="page"
        className={`${getClassActive(i)} relative inline-flex items-center px-4 py-2 border text-sm font-medium`}
      >
        {i}
      </a>
    );
  }

  function getClassActive(i) {
    return i === current ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50';
  }

/*   function prevPage() {
    if (current > 1) {
      setCurrent(current - 1);
      setOffset((current - 2) * itemsPerPage);
    }
  }

  function nextPage() {
    if (current < totalPage) {
      setCurrent(current + 1);
      setOffset(current * itemsPerPage);
    }
  } */
  function prevPage() {
    const newCurrent = current - 1;
    if (newCurrent > 0) {
      setCurrent(newCurrent);
      setOffset((newCurrent - 1) * itemsPerPage);
    }
  }
  
  function nextPage() {
    const newCurrent = current + 1;
    if (newCurrent <= totalPage) {
      setCurrent(newCurrent);
      setOffset((newCurrent - 1) * itemsPerPage);
    }
  }

  return (
    <div className="flex justify-center mb-20">
      <div className="text-center font-bold">
        {/* { window.screen.width < 704 ? */} 
        <div>
          <p className="text-sm text-black">
            {/* Showing */}Mostrando <span className="font-medium">{itemsPerPage * (current - 1) + 1}</span> {/* to */} al {' '}
            <span className="font-medium">{current * itemsPerPage < totalItems ? current * itemsPerPage : totalItems}</span> {/* of */} de <span className="font-medium">{totalItems}</span> {/* results */} resultados
          </p>
        </div> {/* : null */ }
        <div>
          <nav className="text-black font-bold inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <a
              onClick={() => prevPage()}
              href="#"
              className="bg-gray-800 text-white p-2 rounded-l-md shadow-md hover:bg-purple-900"
            >
              <span className="sr-only">Previous</span>
              {/* <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" /> */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={50} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </a>
            {items}
            <a
              onClick={() => nextPage()}
              href="#"
              className="bg-gray-800 text-white p-2 rounded-r-md shadow-md hover:bg-purple-900"
            >
              <span className="sr-only">Next</span>
              {/* <ChevronRightIcon className="h-5 w-5" aria-hidden="true" /> */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none"  width={50} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Paginate;