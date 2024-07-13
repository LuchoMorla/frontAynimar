import { useRef, useState } from 'react';
import axios from 'axios';
import endPoints from '@services/api';
import useAlert from '@hooks/useAlert';
import ALert from '@common/Alert';
import useWave from 'use-wave';
import BusinessNav from '@components/business/BusinessNav';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';



export const getServerSideProps = async (context) => {
  const { id, idOffer } = context.params;

  const { data } = await axios.get(endPoints.business.getOne(id), {
    headers: {
      'Authorization': `Bearer ${context.req.cookies.token}`
    }
  });

  const { data: offer } = await axios.get(endPoints.offers.getOffer(idOffer), {
    headers: {
      'Authorization': `Bearer ${context.req.cookies.token}`
    }
  })

  return {
    props: {
      business: data,
      offer: offer
    }
  }
}

export default function Offer({ business, offer: offerOriginal }) {
  const [offer, setOffer] = useState(offerOriginal);
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState(business.products);
  const { alert, setAlert, toggleAlert } = useAlert();
  const router = useRouter();

  const wave = useWave();

  const handleClickReject = async () => {
    await axios.patch(endPoints.offers.getOffer(offer.id), {
      status: 'rejected'
    }, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`
      }
    })
    toast.success('Oferta rechazada con éxito');
    router.push("/dashboard/business/" + business.id + "/offers");

  };

  const handleClickAccept = async () => {
    await axios.patch(endPoints.offers.getOffer(offer.id), {
      status: 'accepted'
    }, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`

      }
    })
    setOffer({ ...offer, status: 'accepted' });
    toast.success('Oferta aceptada con éxito');
  };

  const statusText = {
    accepted: 'Aceptada',
    rejected: 'Rechazada',
    pending: 'Pendiente',
  }

  const formatter = new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
  });


  return (
    <section className="w-full mx-auto grid grid-rows-1 md:grid-cols-[10%_90%] grid-cols-1">
      <BusinessNav business={business} />
      <ALert alert={alert} handleClose={toggleAlert} />
      <div className="flex flex-1 flex-col p-4 ">
        <div className='flex flex-col gap-2'>
          <h2 className="text-4xl font-bold">Oferta #{offer.id}</h2>
          <p className="text-gray-600 mb-4 first-letter:uppercase">Visualize  su oferta.</p>
        </div>

        <div className='flex flex-col gap-2'>
          <h2><span className='font-semibold'>Ofertador:</span> {offer.payment.recycler.name}</h2>

          <div className='items-center flex'>
            <h3><span className='font-semibold'>Cantidad:</span> {offer.payment.commodities[0].PaymentWaste.amount}</h3>
          </div>

          <div className='items-center flex'>
            <h3><span className='font-semibold'>Precio:</span> {formatter.format(offer.payment.total)}</h3>
          </div>

          <div className='items-center flex'>
            <h3><span className='font-semibold'>Materia prima:</span> {offer.payment.commodities[0].name}</h3>
          </div >

          <div className='items-center flex'>
            <h3><span className='font-semibold'>Fecha de la oferta:</span> {new Date(offer.createdAt).toLocaleString()}</h3>
          </div>

          {
            offer.status === "pending" ? (
              <div className='flex gap-2 my-2'>
                <button
                  onClick={handleClickAccept}
                  ref={wave}
                  className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 w-48 focus:ring-offset-2 focus:ring-indigo-500 gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                  </svg>

                  Aceptar oferta
                </button>
                <button
                  onClick={handleClickReject}
                  ref={wave}
                  className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 w-48 focus:ring-offset-2 focus:ring-red-500 gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>


                  Rechazar oferta
                </button>
              </div>) : offer.status === "accepted" && (
                <>
                  <h3><span className='font-semibold'>Estado de la oferta:</span> {statusText[offer.status]}</h3>
                  <div className='flex flex-col md:flex-row gap-4'>
                    <article className='shadow rounded w-fit'><div className='p-4 items-start flex flex-col gap-2'>
                      <div className="flex flex-col gap-1">
                        <h4 className='font-semibold'>Contacto del reciclador:</h4>
                        <ul className='flex gap-2 flex-wrap'>
                          <li className='flex gap-1'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                            <span>{offer.payment.recycler.name}{" "}{offer.payment.recycler.lastName}</span>

                          </li>
                          <li className='flex gap-1'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                            </svg>



                            <span>{offer.payment.recycler.user.email}</span>
                          </li>

                          {offer.payment.recycler.phone && (<li className='flex gap-1'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                            </svg>


                            <span>{offer.payment.recycler.phone}</span>
                          </li>)}

                          {offer.payment.recycler.phoneTwo && (<li className='flex gap-1'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                            </svg>


                            <span>{offer.payment.recycler.phoneTwo}</span>
                          </li>)}
                        </ul>
                      </div>
                      <div className="flex flex-col gap-1">
                        <h4 className='font-semibold'>Ubicación del reciclador:</h4>
                        <ul className="flex gap-2">
                          {
                            !offer.payment.recycler.countryOfResidence && !offer.payment.recycler.city && !offer.payment.recycler.streetAddress && <li className='flex gap-1'>
                              <h5>El reciclador no ha ofrecido su ubicación.</h5>
                            </li>
                          }
                          {
                            offer.payment.recycler.countryOfResidence && (<li className='flex gap-1'>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m6.115 5.19.319 1.913A6 6 0 0 0 8.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 0 0 2.288-4.042 1.087 1.087 0 0 0-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 0 1-.98-.314l-.295-.295a1.125 1.125 0 0 1 0-1.591l.13-.132a1.125 1.125 0 0 1 1.3-.21l.603.302a.809.809 0 0 0 1.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 0 0 1.528-1.732l.146-.292M6.115 5.19A9 9 0 1 0 17.18 4.64M6.115 5.19A8.965 8.965 0 0 1 12 3c1.929 0 3.716.607 5.18 1.64" />
                              </svg>

                              <span>{offer.payment.recycler.countryOfResidence}</span>
                            </li>)
                          }
                          {
                            offer.payment.recycler.city && <li className='flex gap-1'>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                              </svg>

                              <span>{offer.payment.recycler.city}</span>
                            </li>
                          }
                          {
                            offer.payment.recycler.streetAddress && <li className='flex gap-1'>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                              </svg>


                              <span>{offer.payment.recycler.streetAddress}</span>
                            </li>
                          }
                        </ul>
                      </div>
                      <div className="flex flex-col gap-0">
                        <h4 className='font-semibold'>Preferencias de pago del reciclador:</h4>
                        <p className='pb-1 text-small text-gray-500'>Recomendamos primero coordinar con el reciclador.</p>
                        <ul className="flex gap-2">
                          {
                            !offer.payment.recycler.paymentType && !offer.payment.recycler.countNumber && !offer.payment.recycler.bank && <li className='flex gap-1'>
                              <h5>El reciclador no hay ofrecido preferencias de pago.</h5>
                            </li>
                          }

                          {
                            offer.payment.recycler.paymentType && <li className='flex gap-1'>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                              </svg>


                              <span className='first-letter:uppercase'>{offer.payment.recycler.paymentType}</span>
                            </li>
                          }
                          {
                            offer.payment.recycler.countNumber && <li className='flex gap-1'>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                              </svg>


                              <span>{offer.payment.recycler.countNumber}</span>
                            </li>
                          }

                          {offer.payment.recycler.bank && <li className='flex gap-1'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
                            </svg>



                            <span className='first-letter:uppercase'>{offer.payment.recycler.bank}</span>
                          </li>}
                        </ul>
                      </div>

                    </div></article>
                    <section>
                      <div>
                        <h2 className='font-semibold'>¿Algún problema con la oferta?</h2>
                        <p className='pb-1 text-small text-gray-500'>Aún puedes rechazar la oferta, recuerda solo hacer esto en caso haya problemas con el reciclador.</p>
                        <button
                          onClick={handleClickReject}
                          ref={wave}
                          className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 w-48 focus:ring-offset-2 focus:ring-red-500 gap-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>


                          Rechazar oferta
                        </button>
                      </div>
                    </section>
                  </div>
                </>


              )
          }
        </div >

      </div >
      <Toaster />
    </section>
  );
}
