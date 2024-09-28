import axios from 'axios';

// axios.defaults.baseURL = 'http://localhost:5001';
axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8'
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

export const ProductService = {
  async getProducts() {
    try {
      const response = await axios.get('http://localhost:5000/all_products');
      return response.data
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error
    }
    // return axios.get('http://localhost:5001/products')
    //   .then(res => res.data)
    //   .catch(error => { throw error });
  },
  async searchProducts(name, price, order_by, category, available) {
    return axios.get(`http://localhost:5000/search_products?name=${name}&price=${price}&order_by=${order_by}&category=${category}&available=${available}`)
      .then(res => res.data)
      .catch(error => { throw error });
  },
  async createProduct(product) {
    return axios.post('http://localhost:5000/create', product)
      .then(res => res.data)
      .catch(error => { throw error });
  },
  async pdateProduct(product) {
    return axios.put(`http://api.example.com/products/${product.id}`, product)
      .then(res => res.data)
      .catch(error => { throw error });
  },
  async deleteProduct(id) {
    return axios.delete(`http://api.example.com/products/${id}`)
      .then(res => res.data)
      .catch(error => { throw error });
  }
};