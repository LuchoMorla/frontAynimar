import { BriefcaseIcon } from "@heroicons/react/solid";
import { useAuth } from "@hooks/useAuth";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import logoAynimar from "@assets/logos/logoAynimar.svg";
import Image from "next/image";
import { useState } from "react";

export default function CreateOwnerBusiness() {
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
      setLoading(true);
      await auth.signUpBusinessOwner({
        user: {
          email: data.email,
          password: data.password,
        },
        businessOwner: {
          name: data.name,
          lastName: data.lastName,
          identityNumber: data.identityNumber,
        },
      });
      setLoading(false);

      toast.success("Registrado correctamente");
      location.href = "/dashboard";
    } catch (err) {
      toast.error("Error");
    }
  };

  return (
    <main className="min-h-full flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 flex-col gap-4">
      <section className="max-w-md w-full space-y-8">
        <div className="flex items-center flex-col">
          <Image className="mx-auto h-12 w-auto" src={logoAynimar} alt="Workflow" />
          <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900 [text-wrap:_balance]">Registrate como Dueño de Negocio</h2>
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
            <label htmlFor="lastName-owner-business" className="sr-only">
              Apellido
            </label>
            <input
              id="lastName-owner-business"
              name="lastName"
              type="name"
              autoComplete="name"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Apellido"
            />
          </div>
          <div>
            <label htmlFor="dni-owner-business" className="sr-only">
              Número de célula
            </label>
            <input
              id="dni-owner-business"
              name="identityNumber"
              type="number"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Número de célula"
            />
          </div>
          <div>
            <label htmlFor="email-owner-business" className="sr-only">
              Correo
            </label>
            <input
              id="email-owner-business"
              name="email"
              type="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Correo"

            />
          </div>
          <div>
            <label htmlFor="password-owner-business" className="sr-only">
              Password
            </label>
            <input
              id="password-owner-business"
              name="password"
              type="password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"

            />
          </div>

          <Link href="/login">
            <a className="text-gray-900 ">Ya tengo cuenta, quisiera loguearme</a>
          </Link>

          <button
            disabled={loading}
            type="submit"
            className="disabled:pointer-events-none disabled:bg-indigo-200 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">

              <BriefcaseIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
            </span>
            Registrarse
          </button>
        </form>
      </section>
      <Toaster richColors closeButton />
    </main>
  )
}