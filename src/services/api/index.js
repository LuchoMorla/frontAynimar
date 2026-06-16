const API = process.env.NEXT_PUBLIC_API_URL;
const VERSION = process.env.NEXT_PUBLIC_API_VERSION;

const endPoints = {
  products: {
    getProduct: (id) => `${API}/api/${VERSION}/products/${id}`,
    postProducts: `${API}/api/${VERSION}/products/`,
    // getProducts: (limit, offset) => `${API}/api/${VERSION}/products?limit=${limit}&offset=${offset}&price_min=0&price_max=10000000&show_shop=true`,
    getProducts: (limit, offset, price_min = 0, price_max = 10000) => `${API}/api/${VERSION}/products?limit=${limit}&offset=${offset}&price_min=${price_min}&price_max=${price_max}`,
    /* enlaces que probamos en los nuevos feactures que estamos metiendo
    getProducts: (limit, offset,  price_min = 0, price_max = 10000) => `${API}/api/${VERSION}/products?limit=${limit}&offset=${offset}&price_min=${price_min}&price_max=${price_max}`,
 *//*     getProducts: (limit, offset,  price_min = 0, price_max = 10000, showShop=true ) => `${API}/api/${VERSION}/products?limit=${limit}&offset=${offset}&price_min=${price_min}&price_max=${price_max}&showShop=${showShop}`, */
    putProduct: (id) => `${API}/api/${VERSION}/products/${id}`,
    deleteProduct: (id) => `${API}/api/${VERSION}/products/${id}`
  },
  wastes: {
    getProducts: (limit, offset) => `${API}/api/${VERSION}/wastes?limit=${limit}&offset=${offset}&price_min=0&price_max=10000000`,
    postProducts: `${API}/api/${VERSION}/wastes/`,
    getProduct: (id) => `${API}/api/${VERSION}/wastes/${id}`,
    putProduct: (id) => `${API}/api/${VERSION}/wastes/${id}`,
    deleteProduct: (id) => `${API}/api/${VERSION}/wastes/${id}`
  },
  users: {
    getUser:    (id) => `${API}/api/${VERSION}/users/${id}`,
    deleteUser: (id) => `${API}/api/${VERSION}/users/${id}`,
  },
  recyclers: {
    getRecycler: (id) => `${API}/api/${VERSION}/recyclers/${id}`,
    postRecyclers: `${API}/api/${VERSION}/recyclers`,
    updateRecycler: (id) => `${API}/api/${VERSION}/recyclers/${id}`,
    deleteRecycler: (id) => `${API}/api/${VERSION}/recyclers/${id}`
  },
  customers: {
    getCustomer: (id) => `${API}/api/${VERSION}/customers/${id}`,
    postCustomers: `${process.env.NEXT_PUBLIC_API_URL}/api/${VERSION}/customers`,
    updateCustomer: (id) => `${API}/api/${VERSION}/customers/${id}`,
    deleteCustomer: (id) => `${API}/api/${VERSION}/customers/${id}`
  },
  payments: {
    getPayment: (id) => `${API}/api/${VERSION}/payment/${id}`,
    postPayment: `${API}/api/${VERSION}/payments`,
    postCommodity: `${API}/api/${VERSION}/payments/add-commodity`
  },
  orders: {
    getOrder: (id) => `${API}/api/${VERSION}/orders/${id}`,
    getOrderByUI: (id) => `${API}/api/${VERSION}/orders/userId/${id}`,
    getOrderByState: `${API}/api/${VERSION}/orders/user/state`,
    postOrder: `${API}/api/${VERSION}/orders`,
    getItem: (id) => `${API}/api/${VERSION}/orders/add-item/${id}`,
    postItem: `${API}/api/${VERSION}/orders/add-item`,
    postGuestOrder: `${API}/api/${VERSION}/orders/guest-order`,       // <-- NUEVA
    postItemToGuest: `${API}/api/${VERSION}/orders/add-item-guest`,  // <-- NUEVA
    associateOrder: `${API}/api/${VERSION}/orders/associate-order`, // <-- NUEVA
    getGuestOrder: (id) => `${API}/api/${VERSION}/orders/guest-order/${id}`, // <-- NUEVA
     deleteItemGuest: (id) => `${API}/api/${VERSION}/orders/item-guest/${id}`, // <-- NUEVA
    editItem: (id) => `${API}/api/${VERSION}/orders/add-item/${id}`,
    editItemGuest: (id) => `${API}/api/${VERSION}/orders/item-guest/${id}`,
    deleteItem: (id) => `${API}/api/${VERSION}/orders/add-item/${id}`,
    updateOrder: (id) => `${API}/api/${VERSION}/orders/${id}`,
    checkout: `${API}/api/${VERSION}/orders/checkout`,
  },
  transaction: {
    debits: `${API}/api/${VERSION}/debits/`,
  },
  auth: {
    login: `${API}/api/${VERSION}/auth/login`,
    autoLogin: `${API}/api/${VERSION}/auth/auto-login`,
    recovery: `${API}/api/${VERSION}/auth/recovery`,
    changePassword: `${API}/api/${VERSION}/auth/change-password`,
    profile: `${API}/api/${VERSION}/auth/profile`
  },
  /*   categories:{
      getCategories: `${API}/api/${VERSION}/categories`,
      postCategories: `${API}/api/${VERSION}/categories`,
      getCategoriesProduct: (id) => `${API}/api/${VERSION}/categories/${id}/products`,
      putCategories: (id) => `${API}/api/${VERSION}/categories/${id}`,
    },
    wasteCategories:{
      getCategories: `${API}/api/${VERSION}/waste-categories`,
      postCategories: `${API}/api/${VERSION}/waste-categories`,
      getCategoriesProduct: (id) => `${API}/api/${VERSION}/waste-categories/${id}/wastes`,
      putCategories: (id) => `${API}/api/${VERSION}/waste-categories/${id}`,
    },
    files:{
      postFiles: `${API}/api/${VERSION}/files/upload`,
      getFiles: (fileName) => `${API}/api/${VERSION}/${fileName}`
    } */
  profile: {
    orders: '',
    credits: '',
    reciclajes: '',
    clientData: `${API}/api/${VERSION}/profile/my-customer-data`,
    recyclerData: `${API}/api/${VERSION}/profile/my-recycler-data`,
    createClientBR: `${API}/api/${VERSION}/profile/my-customer-data`,
    createRecyclerBC: `${API}/api/${VERSION}/profile/my-recycler-data`,
  },
  mail: {
    contact: `${API}/api/${VERSION}/mail/contact`,
    vendingContact: `${API}/api/${VERSION}/mail/vendingContact`,
    vendingProspectContact: `${API}/api/${VERSION}/mail/vendingProspectContact`,
  },
  wallet: {
    myBalance: `${API}/api/${VERSION}/wallets/my-wallet`,
  },
  coupons: {
    validate: `${API}/api/${VERSION}/coupons/validate`,
  },
  reviews: {
    getReviews: (productId, { rating = null, withPhotos = false, page = 1, limit = 10 } = {}) => {
      let url = `${API}/api/${VERSION}/reviews?productId=${productId}&page=${page}&limit=${limit}`;
      if (rating)     url += `&rating=${rating}`;
      if (withPhotos) url += `&withPhotos=true`;
      return url;
    },
    postReview: `${API}/api/${VERSION}/reviews`,
  },
  admin: {
    allOrders: `${API}/api/${VERSION}/orders`,
    updateOrder: (id) => `${API}/api/${VERSION}/orders/${id}`,
    productsByProvider: (provider) => `${API}/api/${VERSION}/products?sourceProvider=${provider}&limit=200`,
    catalogPreview: (provider, page = 1, limit = 20, keyword = '') => {
      const base = `${API}/api/${VERSION}/import/catalog?provider=${provider}&page=${page}&limit=${limit}`;
      return keyword ? `${base}&keyword=${encodeURIComponent(keyword)}` : base;
    },
    importProduct: `${API}/api/${VERSION}/import/product`,
    importDropi: `${API}/api/${VERSION}/import/dropi`,
    importEffi: `${API}/api/${VERSION}/import/effi`,
    syncAllStock: `${API}/api/${VERSION}/import/sync-all`,
  },
};

export default endPoints;