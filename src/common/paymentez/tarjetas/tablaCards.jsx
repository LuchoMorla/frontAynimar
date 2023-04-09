import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import DeleteCard from '../deleteCard';
import Referencia from '../reference';
import Debito from '../debitCard';
export default function TablaCards({ cards, uId, email }) {
    const [listCards, setList] = useState([
        {
            nombre: '',
            tipo: '',
            expira: '',
            estado: '',
            token: ""
        }
    ]);

    useEffect(() => {
        let _cards = []
        cards.map((c) => {
            _cards.push({
                nombre: c.holder_name,
                tipo: c.type,
                expira: c.expiry_year,
                estado: c.status,
                token: c.token
            })
        })
        setList(_cards)

    }, [cards])

    const eliminarCard = async (token) => {
        const eliminar = await DeleteCard(token, uId)
        console.log(eliminar)
    }

    const InitDebito = async (e) => {
        const _card = {
            "number": e.number,
            "holder_name": e.holder_name,
            "expiry_month": e.expiry_month,
            "expiry_year": e.expiry_year,
            "cvc": "123",
            "type": e.type
        }
        const initReferencia = await Referencia(uId, email)
        console.log(initReferencia)

        const _reference = initReferencia.data.reference
        /**Opcional pago con una referencia */
        window.location.href = initReferencia.data.checkout_url
        /************* */

        /***Debito con tarjeta de credito */
        const _debito = await Debito(uId, email, _card, _reference, e.token)
        /*****corregir autentificacion, api devuelte error 403 */

        console.log(_debito)
    }
    const Acciones = (e) => {
        console.log("de acciones", e)
        return (
            <>
                <div className='d-flex justify-content-between align-items-center'>
                    <Button severity="success" onClick={() => InitDebito(e)} >Pagar</Button>
                    <Button severity='danger' onClick={() => eliminarCard(e.token)}>Eliminar</Button>
                </div>
            </>
        )
    }

    return (
        <div className="card">
            <DataTable value={listCards} >
                <Column field="nombre" header="Nombre"></Column>
                <Column field="tipo" header="tipo Tarjeta"></Column>
                <Column field="expira" header="Expira"></Column>
                <Column field="estado" header="Estado"></Column>
                <Column field="estado" body={Acciones} header="Acciones"></Column>
            </DataTable>
        </div>
    );
}
