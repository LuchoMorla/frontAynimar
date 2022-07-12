const API = process.env.AYNIMAR_API_URL;
const VERSION = process.env.AYNIMAR_API_VERSION;

const endPoints = {
  products:{
    getProducts: `${API}/api/${VERSION}/products/`,
    postProducts: `${API}/api/${VERSION}/products/`,
    getProduct: (id) => `${API}/api/${VERSION}/products/${id}`,
    putProducts: (id) => `${API}/api/${VERSION}/products/${id}`,
    deleteProducts: (id) => `${API}/api/${VERSION}/products/${id}`
  },
  wastes:{
    getProducts: `${API}/api/${VERSION}/wastes/`,
    postProducts: `${API}/api/${VERSION}/wastes/`,
    getProduct: (id) => `${API}/api/${VERSION}/wastes/${id}`,
    putProducts: (id) => `${API}/api/${VERSION}/wastes/${id}`,
    deleteProducts: (id) => `${API}/api/${VERSION}/wastes/${id}`
  },
  users:{
    getUsers: `${API}/api/${VERSION}/users`,
    postUsers: `${API}/api/${VERSION}/users`,
  },
  payments: {
    getPayment: `${API}/api/${VERSION}/payment/${id}`,
    postPayment: `${API}/api/${VERSION}/payments`,
  },
  orders: {
    getorder: `${API}/api/${VERSION}/order/${id}`,
    postorder: `${API}/api/${VERSION}/orders`,
  },
  auth: {
    login: `${API}/api/${VERSION}/auth/login`,
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

export default endPoints