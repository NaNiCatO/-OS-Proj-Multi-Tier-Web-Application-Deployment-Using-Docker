import axios from 'axios';

export const ProductService = {
  getProducts() {
    return axios.get('http://api.example.com/products')
      .then(res => res.data)
      .catch(error => { throw error });
  },
  createProduct(product) {
    return axios.post('http://api.example.com/products', product)
      .then(res => res.data)
      .catch(error => { throw error });
  },
  updateProduct(product) {
    return axios.put(`http://api.example.com/products/${product.id}`, product)
      .then(res => res.data)
      .catch(error => { throw error });
  },
  deleteProduct(id) {
    return axios.delete(`http://api.example.com/products/${id}`)
      .then(res => res.data)
      .catch(error => { throw error });
  }
};