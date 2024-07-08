const API = process.env.NEXT_PUBLIC_API_URL;
const VERSION = process.env.NEXT_PUBLIC_API_API_VERSION;

const endPoints = {
  auth: {
    login: `${API}/api/${VERSION}/auth/login`,
    profile: `${API}/api/${VERSION}/auth/profile`,
  },
  wastes: {
    getWastes: `${API}/api/${VERSION}/wastes/`,
    updateWastes: (id) => `${API}/api/${VERSION}/wastes/${id}`,
  },
  products: {
    getProduct: (id) => `${API}/api/${VERSION}/products/${id}/`,
    getProducts: (limit, offset) => `${API}/api/${VERSION}/products?limit=${limit}&offset=${offset}&price_max=100`,
    getAllProducts: `${API}/api/${VERSION}/products/`,
    addProducts: `${API}/api/${VERSION}/products`,
    updateProducts: (id) => `${API}/api/${VERSION}/products/${id}`,
    deleteProduct: (id) => `${API}/api/${VERSION}/products/${id}`,
  },
  categories: {
    getCategoriesList: `${API}/api/${VERSION}/categories/`,
    addCategory: `${API}/api/${VERSION}/categories/`,
    getCategoryItems: (id) => `${API}/api/${VERSION}/categories/${id}/products/`,
    updateCategory: (id) => `${API}/api/${VERSION}/categories/${id}/`,
    getWastesCategories: `${API}/api/${VERSION}/waste-categories/`,
    addWastesCategory: `${API}/api/${VERSION}/waste-categories/`,
  },
  files: {
    addImage: `${API}/api/${VERSION}/files/upload/`,
  },
  businessOwner: {
    create: `${API}/api/${VERSION}/business-owner/`,
    getBusinessOwnerByUser: (id) => `${API}/api/${VERSION}/business-owner/by-user/${id}`,
  },
  users: {
    create: `${API}/api/${VERSION}/users/`,
    getUser: (id, searchParams = "") => `${API}/api/${VERSION}/users/${id}${searchParams}`,
  },
  business: {
    getAllBusiness: (id) => `${API}/api/${VERSION}/business/${id}`,
    create: `${API}/api/${VERSION}/business/`,
    getOne: (id) => `${API}/api/${VERSION}/business/${id}`,
  }

};

export default endPoints;