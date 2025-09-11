import React, { useState } from 'react';

const initialState = {
  cart: [],
  orderIsOpen: false,
  menuIsOpen: false,
  metacircle: [],
  paymentIsOpen: false,
  havePaymentId: null,
  haveOrderId: null,
  navMenuIsOpen: false,
  showingPassword: true,
  orderData: null
};

const useInitialState = () => {
  const [state, setState] = useState(initialState);

  const showPassword = () => {
    setState(prevState => ({
      ...prevState,
      showingPassword: !prevState.showingPassword,
    }));
  };

  const getCart = (payload) => {
    setState(prevState => ({
      ...prevState,
      cart: payload,
    }));
  };

  const addToCart = (payload) => {
    console.log('addToCart', payload);
    setState(prevState => ({
      ...prevState,
      cart: prevState.cart.some((item) => item.id === payload.id) 
        ? prevState.cart 
        : [...prevState.cart, payload],
    }));
  };

  const removeFromCart = (payload) => {
    setState(prevState => ({
      ...prevState,
      cart: prevState.cart.filter((item) => item.id !== payload.id),
    }));
  };

  const toggleOrder = () => {
    setState(prevState => ({
      ...prevState,
      orderIsOpen: !prevState.orderIsOpen,
    }));
  };

  const addToMetacircle = (payload) => {
    setState(prevState => ({
      ...prevState,
      metacircle: prevState.metacircle.some((item) => item.id === payload.id)
        ? prevState.metacircle 
        : [...prevState.metacircle, payload],
    }));
  };

  const removeFromMetacircle = (payload) => {
    setState(prevState => ({
      ...prevState,
      metacircle: prevState.metacircle.filter((item) => item.id !== payload.id),
    }));
  };

  const togglePayment = () => {
    setState(prevState => ({
      ...prevState,
      paymentIsOpen: !prevState.paymentIsOpen,
    }));
  };

  const toggleMenu = () => {
    setState(prevState => ({
      ...prevState,
      menuIsOpen: !prevState.menuIsOpen,
    }));
  };

  const toggleNavMenu = () => {
    setState(prevState => ({
      ...prevState,
      navMenuIsOpen: !prevState.navMenuIsOpen,
    }));
  };

  const setPaymentId = (payload) => {
    setState(prevState => ({
      ...prevState,
      havePaymentId: payload
    }));
  };

  const setOrderId = (payload) => {
    setState(prevState => ({
      ...prevState,
      haveOrderId: payload
    }));
  };

  const setOrderData = (payload) => {
    setState(prevState => ({
      ...prevState,
      orderData: payload
    }));
  };

  // FUNCIÓN MEJORADA - Ahora es asíncrona para compatibilidad
  const clearCart = async () => {
    console.log('se uso clearCart');
    setState(prevState => ({
      ...prevState,
      cart: []
    }));
    // Pequeña pausa para asegurar que el estado se actualice
    return Promise.resolve();
  };

  return {
    state,
    addToCart,
    getCart,
    removeFromCart,
    toggleOrder,
    toggleMenu,
    addToMetacircle,
    removeFromMetacircle,
    togglePayment,
    setPaymentId,
    setOrderId,
    toggleNavMenu,
    showPassword,
    setOrderData,
    clearCart
  };
};

export const AppContext = React.createContext({});

export default useInitialState;