export const ProductService = {
  getProductsData() {
    return [
      {
        id: 1,
        code: "f230fh0g3",
        name: "Bamboo Watch",
        description: "Product Description",
        price: 65,
        category: "Accessories",
        avaliable: true,
      },
      {
        id: 2,
        code: "nvklal433",
        name: "Black Watch",
        description: "Product Description",
        price: 72,
        category: "Accessories",
        avaliable: true,

      },
    ];
  },

  getProductsWithOrdersData() {
    return [
      {
        id: 1,
        code: "f230fh0g3",
        name: "Bamboo Watch",
        description: "Product Description",
        price: 65,
        category: "Accessories",
        avaliable: true,
      },
    ];
  },

  getProductsMini() {
    return Promise.resolve(this.getProductsData().slice(0, 5));
  },

  getProductsSmall() {
    return Promise.resolve(this.getProductsData().slice(0, 10));
  },

  getProducts() {
    return Promise.resolve(this.getProductsData());
  },

  getProductsWithOrdersSmall() {
    return Promise.resolve(this.getProductsWithOrdersData().slice(0, 10));
  },

  getProductsWithOrders() {
    return Promise.resolve(this.getProductsWithOrdersData());
  },
};
