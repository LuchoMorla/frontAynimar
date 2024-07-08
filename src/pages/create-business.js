import { BriefcaseIcon } from "@heroicons/react/solid";

export default function CreateBusiness() {
  return (
    <main className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 flex-col gap-4">
      <section className="max-w-md w-full space-y-8">
        <div>
          <img className="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="Workflow" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Registra tu primer negocio</h2>
        </div>
      </section>
      <section className="max-w-md w-full space-y-8">
        <form className="rounded-md shadow-sm -space-y-px gap-2 flex flex-col">
          <div>
            <label htmlFor="name-business" className="sr-only">
              Nombre de tu negocio
            </label>
            <input
              id="name-business"
              name="text"
              type="name"
              autoComplete="name"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Nombre de tu negocio"
            />
          </div>
          <div>
            <label htmlFor="name-business" className="sr-only">
              Rubro de tu negocio
            </label>
            <input
              id="category-business"
              name="category"
              type="text"
              autoComplete="name"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Rubro de tu negocio"
            />
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">

              <BriefcaseIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
            </span>
            ¡Empezar con mi negocio!
          </button>
        </form>
      </section>
    </main>
  )
}