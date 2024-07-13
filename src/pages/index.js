import Image from "next/image";
import Link from "next/link";
import logo from "@assets/logos/logoAynimar.svg";
import useWave from "use-wave";

export default function Home() {
  const wave = useWave();
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">

          <div>
            <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
              <nav className="relative flex items-center justify-between sm:h-10 lg:justify-start" aria-label="Global">
                <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
                  <div className="flex items-center justify-between w-full md:w-auto">
                    <a href="#">
                      <span className="sr-only">Workflow</span>
                      <Image className="h-8 w-auto sm:h-10" src={logo} />
                    </a>
                    <div className="-mr-2 flex items-center md:hidden">
                      <button type="button" className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" aria-expanded="false">
                        <span className="sr-only">Abre el menu</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block md:ml-10 md:pr-4 md:space-x-8">
                  <a href="#" className="font-medium text-gray-500 hover:text-gray-900">Pagina principal</a>

                  <a href="#" className="font-medium text-gray-500 hover:text-gray-900">Características</a>

                  <a href="#" className="font-medium text-gray-500 hover:text-gray-900">Compañía</a>

                  <Link href="/login">
                    <a className="font-medium text-indigo-600 hover:text-indigo-500">Iniciar sesión</a>
                  </Link>
                </div>
              </nav>
            </div>
            <div className="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
              <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                <div className="px-5 pt-4 flex items-center justify-between">
                  <div>
                    <Image className="h-8 w-auto" src={logo} alt="Logo" />
                  </div>
                  <div className="-mr-2">
                    <button type="button" className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                      <span className="sr-only">Cerrar menu</span>
                    </button>
                  </div>
                </div>
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Pagina principal</a>

                  <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Características</a>

                  <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Compañía</a>
                </div>
                <Link href="/login">
                  <a ref={wave} className="block w-full px-5 py-3 text-center font-medium text-indigo-600 bg-gray-50 hover:bg-gray-100"> Inicia sesión </a>
                </Link>
              </div>
            </div>
          </div>

          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Registrate como dueño de</span>
                <span className="block text-indigo-600 xl:inline ml-2">
                  tu negocio
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">Bienvenido a nuestra nueva sección que ofrecremos para nuestros colaboradores, podrás tener tus productos y comprar la materia prima que necesites.</p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link href="/create-owner-business">
                    <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"> Empezar </a>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img className="h-56 w-full object-cover rounded sm:h-72 md:h-96 lg:w-full lg:h-full" src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80" alt="" />
      </div>
    </div>
  );
}
