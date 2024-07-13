import { useRef, useState } from 'react';
import axios from 'axios';
import endPoints from '@services/api';
import useAlert from '@hooks/useAlert';
import ALert from '@common/Alert';
import { getKeyValue, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';
import BusinessNav from '@components/business/BusinessNav';
import { toast, Toaster } from 'sonner';
import Cookies from 'js-cookie';

export const getServerSideProps = async (context) => {
  const { id } = context.params;

  const { data } = await axios.get(endPoints.business.getOne(id), {
    headers: {
      'Authorization': `Bearer ${context.req.cookies.token}`
    }
  });

  const { data: offers } = await axios.get(endPoints.offers.getOffers(data.id), {
    headers: {
      'Authorization': `Bearer ${context.req.cookies.token}`
    }
  });

  return {
    props: {
      business: data,
      offers,
    }
  }
}

export default function Offers({ business, offers: offersBusiness }) {
  const [open, setOpen] = useState(false);
  const [offers, setOffers] = useState(offersBusiness);
  const { alert, setAlert, toggleAlert } = useAlert();

  const wave = useRef(null);

  const handleClickOffer = (offer) => {
    location.href = `/dashboard/business/${business.id}/offers/${offer.id}`;
  }

  const handleClickDelete = async offer => {
    try {
      await axios.delete(endPoints.offers.removeOffer(offer.id), {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });
      setOffers((offers) => offers.filter((w) => w.id !== offer.id));
      toast.success("Oferta eliminada");
    } catch (err) {
      console.log(err)
      toast.error("Error al eliminar la oferta");
    }
  }
  const statusText = {
    accepted: 'Aceptada',
    rejected: 'Rechazada',
    pending: 'Pendiente',
  }

  const offersMapped = offers.map(offer => (
    {
      status: statusText[offer.status],
      buyener: offer.payment.recycler.name,
      key: offer.id,
      name: offer.payment.commodities[0].name,
      date: new Date(offer.createdAt).toLocaleString(),
      priceOffer: offer.payment.total,
      accion: (<div className='flex gap-1'>
        <button
          onClick={() => handleClickOffer(offer)}
          ref={wave}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
          </svg>

          Ver detalle
        </button>
        <button
          onClick={() => handleClickDelete(offer)}
          ref={wave}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>

          Eliminar oferta
        </button>
      </div>)
    }
  ))

  const columns = [
    {
      key: "name",
      label: "Nombre de la materia prima",
    },
    {
      key: "date",
      label: "Fecha de la oferta",
    },
    {
      key: "priceOffer",
      label: "Precio oferta",
    },
    {
      key: "buyener",
      label: "Reciclador",
    },
    {
      key: "status",
      label: "Estado",
    },
    {
      key: "accion",
      label: "Accion",
    },
  ];

  return (
    <section className="w-full mx-auto grid grid-rows-1 md:grid-cols-[10%_90%]">
      <BusinessNav business={business} />
      <ALert alert={alert} handleClose={toggleAlert} />
      <div className="flex flex-1 flex-col p-4 ">
        <div className='flex flex-col gap-2'>
          <h2 className="text-4xl font-bold">Ofertas</h2>
          <p className="text-gray-600 mb-4 first-letter:uppercase">Visualize  las ofertas de su materia prima.</p>
        </div>


        <div className={'flex'.concat(offers.length <= 0 ? " items-center justify-center flex-1" : "")}>
          {offers.length <= 0 ? <article>
            <div className='flex items-center justify-center flex-col gap-1'> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
              <h3 className='text-2xl'>Su materia prima no tienen ofertas por el momento</h3></div>

          </article> : (
            <><Table className='hidden md:block' aria-label="Example table with dynamic content">
              <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key} className='first-letter:uppercase'>{column.label}</TableColumn>}
              </TableHeader>
              <TableBody items={offersMapped}>
                {(item) => (
                  <TableRow key={item.key}>
                    {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                  </TableRow>
                )}
              </TableBody>
            </Table>
              <div className='block md:hidden'>
                {
                  offersMapped.map((offer) => (
                    <article key={offer.key} className="bg-white shadow-md rounded my-6">
                      <div className="px-4 py-3 flex justify-between items-center flex-wrap">
                        <div className='flex-[100%]'>
                          <h3 className="text-lg"><span className="font-bold">Nombre del producto: </span>{offer.name}</h3>
                          <span className="font-bold text-lg">Fecha del producto: </span>
                          <time dateTime={offer.date} className="text-gray-600">{offer.date}</time>
                        </div>
                        <div className='flex-[100%]'>
                          <h3 className="text-lg"><span className="font-bold">Precio total de la oferta:</span> {offer.priceOffer}</h3>
                          <p className="text-lg"><span className="font-bold">Ofertador: </span>{offer.buyener}</p>
                        </div>
                        <div>
                          <p className="text-lg"><span className="font-bold">Estado de la oferta:</span> {offer.status}</p>
                          <div className='py-2'>
                            {offer.accion}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))
                }
              </div>
            </>
          )}
        </div>

      </div>

      <Toaster richColors closeButton />

    </section>
  );
}
