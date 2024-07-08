import RegisterPage from "@components/RegisterPage";
import { BriefcaseIcon, TruckIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function CreateOwnerBusiness() {
  const [dataBusinessOwner, setDataBusinessOwner] = useState(false);
  const [passRegister, setPassRegister] = useState(false);

  const handleSubmit = (e) => {
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    e.preventDefault();
    setDataBusinessOwner(data);
    setPassRegister(true);
  };

  if (passRegister) {
    return <RegisterPage title="Ahora, creemos tu cuenta" dataBusinessOwner={dataBusinessOwner} />
  }

  return (
    <main className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 flex-col gap-4">
      <section className="max-w-md w-full space-y-8">
        <div>
          <img className="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="Workflow" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 [text-wrap:_balance]">Registrate como Dueño de Negocio</h2>
        </div>
      </section>
      <section className="max-w-md w-full space-y-8">
        <form onSubmit={handleSubmit} className="rounded-md shadow-sm -space-y-px gap-2 flex flex-col">
          <div>
            <label htmlFor="name-owner-business" className="sr-only">
              Nombre
            </label>
            <input
              id="name-owner-business"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Nombre"
            />
          </div>
          <div>
            <label htmlFor="name-owner-business" className="sr-only">
              Apellido
            </label>
            <input
              id="name-owner-business"
              name="lastName"
              type="name"
              autoComplete="name"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Apellido"
            />
          </div>
          <div>
            <label htmlFor="name-owner-business" className="sr-only">
              DNI
            </label>
            <input
              id="name-owner-business"
              name="identityNumber"
              type="number"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="DNI"
              minLength={8}
            />
          </div>

          <Link href="/login">
            <a className="text-gray-900 ">Ya tengo cuenta, quisiera loguearme</a>
          </Link>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">

              <BriefcaseIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
            </span>
            Siguiente
          </button>
        </form>
      </section>
    </main>
  )
}