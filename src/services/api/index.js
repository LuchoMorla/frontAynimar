const API = process.env.NEXT_PUBLIC_API_URL;
const VERSION = process.env.NEXT_PUBLIC_API_VERSION;
 console.log(API)
const endPoints = {
  products:{
    getProduct: (id) => `${API}/api/${VERSION}/products/${id}`,
    postProducts: `${API}/api/${VERSION}/products/`,
    getProducts: (limit, offset) => `${API}/api/${VERSION}/products?limit=${limit}&offset=${offset}&price_min=0&price_max=10000000`,
    putProduct: (id) => `${API}/api/${VERSION}/products/${id}`,
    deleteProduct: (id) => `${API}/api/${VERSION}/products/${id}`
  },
  wastes:{
    getProducts: (limit, offset) => `${API}/api/${VERSION}/wastes?limit=${limit}&offset=${offset}&price_min=0&price_max=10000000`,
    postProducts: `${API}/api/${VERSION}/wastes/`,
    getProduct: (id) => `${API}/api/${VERSION}/wastes/${id}`,
    putProduct: (id) => `${API}/api/${VERSION}/wastes/${id}`,
    deleteProduct: (id) => `${API}/api/${VERSION}/wastes/${id}`
  },
  users: {
    getUser: (id) => `${API}/api/${VERSION}/users/${id}`,
    /* postUsers: `${API}/api/${VERSION}/users`, */
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
    getItem: (id) =>`${API}/api/${VERSION}/orders/add-item/${id}`,
    postItem: `${API}/api/${VERSION}/orders/add-item`,
    editItem: (id) => `${API}/api/${VERSION}/orders/add-item/${id}`,
    deleteItem: (id) => `${API}/api/${VERSION}/orders/add-item/${id}`
  },
  auth: {
    login: `${API}/api/${VERSION}/auth/login`,
    autoLogin: `${API}/api/${VERSION}/auth/auto-login`,
    recovery: `${API}/api/${VERSION}/auth/recovery`,
    changePassword: `${API}/api/${VERSION}/auth/change-password`/* ,
    profile: `${API}/api/${VERSION}/auth/profile` */
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
    contact: `${API}/api/${VERSION}/mail/contact`
  }
};

export default endPoints;