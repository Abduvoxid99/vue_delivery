import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

const products = {
    state: {
      Disablet: true,
      products: [],
      productsPagination: {},
      productsMenu: [],
      loadProduct: false
    },
    getters: {
      productsData: state => state.products,
      Disablet: state => state.Disablet,
      productsWithDeliveryProduct: state => state.products.filter(e => e.name.toLowerCase().includes('доставка')),
      productsMenu: state => state.productsMenu,
      productsPagination: state => state.productsPagination,
      loadProduct: state => state.loadProduct
    },
    mutations: {
      GET_PRODUCTS: (state, products) => {
          state.products = products
      },
      GET_PRODUCTS_PAGINATION: (state, productsPagination) => {
          state.productsPagination = productsPagination
      },
      GET_PRODUCTS_MENU: (state, products) => {
        state.productsMenu = products
      },
      GET_LOAD_PRODUCTS: (state, payload) => {
        state.loadProduct = payload
      },
      GET_DISABLET_PRODUCTS: (state, payload) => {
        state.Disablet = payload
      },
    },
    actions: {
      setPraducktDisablet ({ commit }, payolad) {
        commit('GET_DISABLET_PRODUCTS', payolad)
      },
      getProducts ({ commit }, payload) {
        if (!payload.page) {
          payload.page = { current: 1, pageSize: 10, total: null }
        }
        console.log('ddddd', payload)
        commit('GET_LOAD_PRODUCTS', true)
        return new Promise((resolve, reject) => {
        request({
            url: '/product',
            headers: headers,
            params: { page: payload.page.current, limit: payload.page.pageSize, search: payload.search, is_active: payload.page.is_active }
        })
          .then(result => {
          const pagination = { ...payload.page }
          pagination.total = parseInt(result.count)
          console.log(result)
          console.log('results')
          commit('GET_PRODUCTS_PAGINATION', pagination)
          commit('GET_PRODUCTS', result.products)
          resolve(result)
        })
        .catch(error => {
          reject(error)
        })
          .finally(() => {
            commit('GET_LOAD_PRODUCTS', false)
          })
      })
    },
    async getProductList ({ commit }, params) {
      return request({
        url: '/product',
        params
      }).then(res => res).catch(err => console.log(err))
    },
      getProductsMenu ({ commit }) {
      return new Promise((resolve, reject) => {
        const page = { current: 1, pageSize: 1000, total: null }
        return request({
            url: '/product',
            headers: headers,
            params: { page: page.current, limit: page.pageSize }
        })
          .then(result => {
            resolve(result)
          commit('GET_PRODUCTS_MENU', result.products)
        })
        .catch(error => {
          console.log(error)
        })
      })
  },
    getCrmProductMenu ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        return request({
            url: '/jowi/menu',
            params: { search: payload }
        })
          .then(result => {
            resolve(result)
        })
        .catch(error => {
          console.log(error)
        })
      })
    },
    getProductsList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        return request({
            url: '/product',
            params
        })
          .then(result => {
            resolve(result)
        })
        .catch(error => {
          console.log(error)
        })
      })
    },
    updateProductById ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        return request({
            url: `product/${payload.id}`,
            method: 'put',
            data: payload
        })
          .then(result => {
            resolve(result)
        })
        .catch(error => {
          console.log(error)
        })
      })
  },
  }
}
  export default products
