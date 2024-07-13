import Link from 'next/link';
import logo from '@assets/logos/logoAynimar.svg';
import Image from 'next/image';
import useWave from 'use-wave';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const BusinessNav = ({ business }) => {
  const [isOpen, setIsOpen] = useState(true);
  const waveRef = useWave();
  const router = useRouter();

  const handleClickSignOut = async () => {
    Cookies.remove('token');
    router.push('/');
  };

  const isDashboardIndex = !Boolean(business.id);

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 640);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <>
      <motion.aside
        animate={{
          translateX: isOpen ? 0 : '-100%',
        }}
        className="col-span-1 row-span-3 bg-gray-800 text-gray-50 py-4 px-3 min-h-[100dvh] flex flex-col gap-2 fixed left-0 md:static md:translate-x-full z-50"
      >
        <button onClick={() => setIsOpen(!isOpen)} className="absolute -right-10 top-1 bg-slate-900 rounded-full p-2 md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <Image src={logo} alt="logo" />
        <nav className="flex flex-col flex-1">
          <ul className="flex flex-col gap-2">
            <li>
              <Link href={`/dashboard`}>
                <a className="text-small sm:text-medium">Principal</a>
              </Link>
            </li>
            <li>
              <Link href={`/dashboard/business/${business.id}`}>
                <a
                  className={isDashboardIndex ? 'pointer-events-none text-gray-400 text-small sm:text-medium' : 'text-small sm:text-medium'}
                  aria-disabled={isDashboardIndex}
                  tabIndex={isDashboardIndex ? -1 : undefined}
                >
                  Negocio
                </a>
              </Link>
            </li>
            <li>
              <Link href={`/dashboard/business/${business.id}/products`}>
                <a
                  className={isDashboardIndex ? 'pointer-events-none text-gray-400 text-small sm:text-medium' : 'text-small sm:text-medium'}
                  aria-disabled={isDashboardIndex}
                  tabIndex={isDashboardIndex ? -1 : undefined}
                >
                  Productos
                </a>
              </Link>
            </li>
            <li>
              <Link href={`/dashboard/business/${business.id}/wastes`}>
                <a
                  className={isDashboardIndex ? 'pointer-events-none text-gray-400 text-small sm:text-medium' : 'text-small sm:text-medium'}
                  aria-disabled={isDashboardIndex}
                  tabIndex={isDashboardIndex ? -1 : undefined}
                >
                  Materia prima
                </a>
              </Link>
            </li>
            <li>
              <Link href={`/dashboard/business/${business.id}/offers`}>
                <a
                  className={isDashboardIndex ? 'pointer-events-none text-gray-400 text-small sm:text-medium' : 'text-small sm:text-medium'}
                  aria-disabled={isDashboardIndex}
                  tabIndex={isDashboardIndex ? -1 : undefined}
                >
                  Ofertas
                </a>
              </Link>
            </li>
            <li>
              <Link href={`/dashboard/business/${business.id}/sales`}>
                <a
                  className={isDashboardIndex ? 'pointer-events-none text-gray-400 text-small sm:text-medium' : 'text-small sm:text-medium'}
                  aria-disabled={isDashboardIndex}
                  tabIndex={isDashboardIndex ? -1 : undefined}
                >
                  Ventas
                </a>
              </Link>
            </li>
          </ul>

          <div className="mt-auto">
            <button
              onClick={handleClickSignOut}
              ref={waveRef}
              className="inline-flex items-center justify-center p-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 gap-1 text-small sm:text-sm"
            >
              Cerrar sesión
            </button>
          </div>
        </nav>
      </motion.aside>
    </>
  );
};

export default BusinessNav;
