export const ProductService = {
  getProductsData() {
    return [
      {
        id: 1,
        code: "f230fh0g3",
        name: "Bamboo Watch",
        price: 65,
        category: "Accessories",
        avaliable: true,
      },
      {
        id: 2,
        code: "nvklal433",
        name: "Black Watch",
        price: 72,
        category: "Accessories",
        avalialbe: false,

      },
      {
        id: 3,
        code: "nvklal433",
        name: "Black Watch",
        price: 72,
        category: "Accessories",
        avalialbe: false,

      },
    ];
  },

  getProductsWithOrdersData() {
    return [
      {
        id: 1,
        code: "f230fh0g3",
        name: "Bamboo Watch",
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
