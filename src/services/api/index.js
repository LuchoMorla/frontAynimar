const API = process.env.NEXT_PUBLIC_API_URL;
const VERSION = process.env.NEXT_PUBLIC_API_VERSION;

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
    postUsers: `${API}/api/${VERSION}/users`,
  },
  recyclers: {
    getRecycler: (id) => `${API}/api/${VERSION}/recyclers/${id}`,
    postRecyclers: `${API}/api/${VERSION}/recyclers`,
    updateRecycler: (id) => `${API}/api/${VERSION}/recyclers/${id}`,
    deleteRecycler: (id) => `${API}/api/${VERSION}/recyclers/${id}`
  },
  customers: {
    getCustomer: (id) => `${API}/api/${VERSION}/customers/${id}`,
    postCustomers: `${API}/api/${VERSION}/customers`,
    updateCustomer: (id) => `${API}/api/${VERSION}/customers/${id}`,
    deleteCustomer: (id) => `${API}/api/${VERSION}/customers/${id}`
  },
  payments: {
    getPayment: (id) => `${API}/api/${VERSION}/payment/${id}`,
    postPayment: `${API}/api/${VERSION}/payments`,
  },
  orders: {
    getorder: (id) => `${API}/api/${VERSION}/order/${id}`,
    postorder: `${API}/api/${VERSION}/orders`,
  },
  auth: {
    login: `${API}/api/${VERSION}/auth/login`,
    autoLogin: `${API}/api/${VERSION}/auth/auto-login`,
    recovery: `${API}/api/${VERSION}/auth/recovery`,
    changePassword: `${API}/api/${VERSION}/auth/change-password`,
    profile: `${API}/api/${VERSION}/auth/profile`
  },
  categories:{
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
  }
  
}

export default endPoints;