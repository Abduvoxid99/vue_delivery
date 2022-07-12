import request from '@/utils/request'

const billTariff = {
  state: {
    tariffStatuslist: [
      {
        label: 'New',
        id: '986a0d09-7b4d-4ca9-8567-aa1c6d770505'
      },
      {
        label: 'OperatorAccepted',
        id: 'ccb62ffb-f0e1-472e-bf32-d130bea90617'
      },
      {
        label: 'OperatorCancelled',
        id: 'b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1'
      },
      {
        label: 'VendorAccepted',
        id: '1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3'
      },
      {
        label: 'VendorCancelled',
        id: 'c4227d1b-c317-46f8-b1e3-a48c2496206f'
      },
      {
        label: 'VendorReady',
        id: 'b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd'
      },
      {
        label: 'CourierCancelled',
        id: '6ba783a3-1c2e-479c-9626-25526b3d9d36'
      },
      {
        label: 'CourierAccepted',
        id: '8781af8e-f74d-4fb6-ae23-fd997f4a2ee0'
      },
      {
        label: 'CourierPickedUp',
        id: '84be5a2f-3a92-4469-8283-220ca34a0de4'
      },
      {
        label: 'Delivered',
        id: '79413606-a56f-45ed-97c3-f3f18e645972'
      },
      {
        label: 'Finished',
        id: 'e665273d-5415-4243-a329-aee410e39465'
      },
    ],
  },
    actions: {
    getBillingTarif ({ commit }, params = { page: 1, limit: 50 }) {
        return new Promise((resolve, reject) => {
        request({
            url: '/tariff',
            method: 'get',
            params
        })
          .then(result => {
            resolve(result)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    updateBillingTarif ({ commit }, params) {
        return new Promise((resolve, reject) => {
        request({
            url: 'iiko/menu',
            method: 'update',
            params
        })
          .then(result => {
            resolve(result)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    postBillingTariff ({ commit }, data) {
        return new Promise((resolve, reject) => {
        request({
            url: '/tariff',
            method: 'post',
            data
        })
          .then(result => {
            resolve(result)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getBillingTariffId ({ commit }, id) {
        return new Promise((resolve, reject) => {
        request({
            url: '/tariff/' + id,
            method: 'get'
        })
          .then(result => {
            resolve(result)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    deleteBillingTariffId ({ commit }, id) {
      return new Promise((resolve, reject) => {
      request({
          url: '/tariff/' + id,
          method: 'delete'
      })
        .then(result => {
          resolve(result)
      })
      .catch(error => {
        reject(error)
      })
    })
  },
  }
}
  export default billTariff
