<template>
  <div>
    <a-row style="margin-bottom: 10px" v-for="(p, i) in products" :key="i">
      <a-col :span="6" style="padding-right: 5px">
        <div>
          <p>{{ $t('product_name') }}</p>
          <a-select
            :disabled="isEdit"
            v-model="p.product_id"
            show-search
            style="width: 100%"
            :filter-option="filterOption"
            option-filter-prop="name"
            @select="selectProduct"
          >
            <a-select-option
              v-for="product in productsData"
              :key="product.id + ':' + product.price + ':' + i"
              :value="product.id"
            >
              {{ product.name }}
            </a-select-option>
          </a-select>
        </div>
      </a-col>
      <a-col :span="3" style="padding-left: 5px; padding-right: 5px">
        <div>
          <p>{{ $t('price') }}</p>
          <a-input v-model="p.price" read-only />
        </div>
      </a-col>
      <a-col :span="2" style="padding-left: 5px; padding-right: 5px">
        <div v-if="isShipperIn">
          <p>Кол..</p>
          <a-input
            v-model="p.quantity"
            type="number"
            onkeypress="return event.charCode >= 48 && event.charCode <= 57"
            min="1"
          />
        </div>
        <div v-else>
          <p>{{ $t('quantity') }}</p>
          <a-input
            v-model="p.quantity"
            type="number"
            min="1"
          />
        </div>
      </a-col>
      <a-col :span="6" style="padding-left: 5px; padding-right: 5px">
        <div>
          <p>{{ $t('description') }}</p>
          <a-input
            v-model="p.description"
            :read-only="isEdit"
            @input="
              () => {
                send()
              }
            "
          />
        </div>
      </a-col>
      <a-col :span="products.length > 1 ? 4 : 5" style="padding-left: 5px; padding-right: 5px">
        <div>
          <p>{{ $t('all_price') }}</p>
          <a-input read-only :value="`${parseInt(p.price * p.quantity)}` + ' ' + $t('sum')" />
        </div>
      </a-col>
      <a-col :span="2" style="padding-left: 5px; padding-right: 5px">
        <div>
          <p>{{ $t('action') }}</p>
          <a-button-group>
            <a-tooltip>
              <template slot="title">
                {{ $t('decrement') }}
              </template>
              <a-button :disabled="isEdit" @click="decrement(i)" ghost type="primary" icon="minus" />
            </a-tooltip>
            <a-tooltip>
              <template slot="title">
                {{ $t('increment') }}
              </template>
              <a-button :disabled="isEdit" @click="increment(i)" ghost type="primary" icon="plus" />
            </a-tooltip>
          </a-button-group>
        </div>
      </a-col>
      <a-col v-if="products.length > 1" :span="1" style="padding-left: 5px">
        <div>
          <p>{{ $t('delete') }}</p>
          <a-tooltip>
            <template slot="title">
              {{ $t('delete') }}
            </template>
            <a-button :disabled="isEdit" @click="deleteProduct(i)" type="danger" icon="delete" />
          </a-tooltip>
        </div>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="19">
        <a-button :disabled="isEdit" @click="addProduct" style="margin-top: 20px" type="primary">
          {{ $t('add_product') }}
        </a-button>
      </a-col>
      <a-col :span="5">
        <a-row
          v-if="isMaxWay && orderList.delivery_type !== 'self-pickup'"
          type="flex"
          style="margin-top: 10px"
          justify="space-between"
        >
          <a-col :span="24">
            <p>{{ $t('deliveryPrice') }}</p>
            <a-select
              :disabled="isEdit"
              style="width: 100%"
              v-model="delivery_price.product_id"
              option-filter-prop="name"
              @select="selectDeliveryProduct"
            >
              <a-select-option
                v-for="product in productsWithDeliveryProduct"
                :key="product.id + ':' + product.price + ':'"
                :value="product.id"
              >
                {{ product.name }}
              </a-select-option>
            </a-select>
          </a-col>
        </a-row>
        <a-row type="flex" style="margin-top: 10px" justify="space-between">
          <a-col span="auto"><h1>Сумма заказа:</h1></a-col>
          <a-col span="auto"
            ><h1>{{ new Intl.NumberFormat().format(totalPriceProduct) + ' ' + this.$t('sum') }}</h1></a-col
          >
          <a-col v-if="isMaxWay && orderList.delivery_type !== 'self-pickup'" span="auto"><h1>Расстояние:</h1></a-col>
          <a-col v-if="isMaxWay && orderList.delivery_type !== 'self-pickup'" span="auto">
            <h1>
              <span style="font-weight: 300;" v-if="distance.range">{{ distance.range + '  ' + 'km' }}</span>
            </h1></a-col
          >
        </a-row>
        <a-row v-if="!isMaxWay && orderList.delivery_type !== 'self-pickup'" type="flex" justify="space-between">
          <a-col span="auto"><h1>Сумма Доставка</h1></a-col>
          <a-col span="auto">
            <h1>
              {{ ' ' }}{{ new Intl.NumberFormat().format(distance.price ? distance.price : 0) + ' ' + this.$t('sum') }}
            </h1></a-col
          >
          <a-col span="auto"><h1>Расстояние:</h1></a-col>
          <a-col span="auto">
            <h1>
              <span style="font-weight: 300;" v-if="distance.range">{{ distance.range + '  ' + 'km' }}</span>
            </h1></a-col
          >
          <a-col span="24"><a-divider style="margin: 0px 0px"></a-divider></a-col>
        </a-row>
        <a-row type="flex" justify="space-between">
          <a-col span="auto"><h1>Итого</h1></a-col>
          <a-col span="auto"
            ><h1>
              {{
                new Intl.NumberFormat().format(
                  distance.price ? totalPriceProduct + distance.price : totalPriceProduct
                ) +
                  ' ' +
                  this.$t('sum')
              }}
            </h1></a-col
          >
        </a-row>
        <!-- <h1 style="margin-top: 20px; display: flex; justify-content: flex-end">{{ new Intl.NumberFormat().format(totalPriceProduct) + ' ' + this.$t('sum') }}</h1>
        <h1 style="display: flex; justify-content: flex-end">{{ new Intl.NumberFormat().format(this.distance.price) + ' ' + this.$t('sum') }}</h1>
        <h1 style="display: flex; justify-content: flex-end">=============</h1>
        <h1 style="display: flex; justify-content: flex-end">{{ new Intl.NumberFormat().format(totalPriceProduct + +this.distance.price) + ' ' + this.$t('sum') }}</h1> -->
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  // eslint-disable-next-line
  // props: ['value'],
  props: {
    sours: {
      type: String,
      required: true
    },
    orderList: {
      type: Object,
      required: true
    },
    value: {
      type: Array,
      required: true
    },
    distance: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      shipperIDS: [
        '19d96f2a-7808-4c69-b8ca-79310a29bfab',
        '938698df-44eb-4201-8d75-d82c561fb6d6',
        '48dbaa52-cf12-4fad-b258-15f29392aabd',
        'e2d30f35-3d1e-4363-8113-9c81fdb2a762',
        '988a7dec-aac0-4901-a952-1bb46088141c',
        'd4b1658f-3271-4973-8591-98a82939a664',
        '4e774998-b0b5-4841-8bfa-1a3fd5c4bb50'
      ],
      isShipperIn: false,
      deliveryId: 'faf3bd77-05f6-47b0-ae89-d7e97aff9d60',
      id: '0087fabf-d024-4d04-a312-ccfe1799e57e',
      deliveryId_4000: '0fcd323b-05e8-456e-9312-09bc48628187',
      order: {},
      delivery_price: {
        product_id: 'faf3bd77-05f6-47b0-ae89-d7e97aff9d60',
        quantity: 1,
        price: 9000,
        description: ''
      },
      isEdit:
        this.$route.name === 'OrderEditNew' && this.$route.query.status_id !== '986a0d09-7b4d-4ca9-8567-aa1c6d770505',
      isMaxWay: JSON.parse(localStorage.getItem('shipper_id')) === 'd0d0c7c9-e047-4ad8-9674-a94a27e3da73',
      products: [
        {
          product_id: null,
          quantity: 1,
          price: 0,
          description: ''
        }
      ],
      source: ''
    }
  },
  watch: {
    'orderList.coords' (e) {
      console.log(this.order)
      this.order.lat = e[0]
      this.order.long = e[1]
      this.order.branch_id = this.orderList.branch.value
      this.calcultePrice(this.order)
    },
    totalPriceProduct (e) {
      this.calcultePrice({ ...this.order, order_price: e })
    }
  },
  methods: {
    ...mapActions(['getProducts']),
    selectDeliveryProduct (e, options) {
      console.log(e, this.orderList)
      const data = options.key.split(':')
      // const index = data[2]
      const price = data[1]
      this.delivery_price.price = parseInt(price)
      this.send()
      console.log(this.delivery_price)
    },
    selectDelivery (e) {
      if (
        this.isMaxWay &&
        e === this.deliveryId_4000 &&
        !this.products.map(e => e.product_id).includes(this.deliveryId)
      ) {
        this.delivery_price.price = 6000
        // eslint-disable-next-line no-unused-expressions
        this.delivery_price.product_id = '0087fabf-d024-4d04-a312-ccfe1799e57e'
        this.id = '0087fabf-d024-4d04-a312-ccfe1799e57e'
        this.send()
      }
      if (
        this.isMaxWay &&
        e !== this.deliveryId_4000 &&
        !this.products.map(e => e.product_id).includes(this.deliveryId)
      ) {
        this.delivery_price.price = 9000
        // eslint-disable-next-line no-unused-expressions
        this.delivery_price.product_id = 'faf3bd77-05f6-47b0-ae89-d7e97aff9d60'
        this.send()
      }
      console.log(e, this.orderList, this.products)
      if (e === this.deliveryId_4000 && this.products.map(e => e.product_id).includes(this.deliveryId)) {
        console.log(e)
        for (let i = 0; i <= this.products.length; i++) {
          if (this.products[i].product_id === this.deliveryId) {
            this.products.splice(i, 1)
            this.products.push({
              description: null,
              price: 6000,
              product_id: '0087fabf-d024-4d04-a312-ccfe1799e57e',
              quantity: 1
            })
            this.delivery_price.product_id = '0087fabf-d024-4d04-a312-ccfe1799e57e'
            this.id = '0087fabf-d024-4d04-a312-ccfe1799e57e'
            this.send()
            // console.log(this.totalPriceProduct - 8000)
          }
        }
      } else {
        if (
          !e === this.deliveryId_4000 &&
          this.products.map(e => e.product_id).includes('0087fabf-d024-4d04-a312-ccfe1799e57e')
        ) {
          alert('salom')
        }
        for (let i = 0; i <= this.products.length; i++) {
          if (this.products[i].product_id === '0087fabf-d024-4d04-a312-ccfe1799e57e') {
            // deletItem = this.products[i]
            this.products.splice(i, 1)
            this.products.push(this.delivery_price)
            this.delivery_price.product_id = 'faf3bd77-05f6-47b0-ae89-d7e97aff9d60'
            this.id = 'faf3bd77-05f6-47b0-ae89-d7e97aff9d60'
            this.send()
            // console.log(this.totalPriceProduct - 8000)
          }
        }
      }
    },
    selectProduct (e, option) {
      console.log(e, option, this.products)
      const data = option.key.split(':')
      const index = data[2]
      const price = data[1]
      this.products[index].price = parseInt(price)
      this.send()
    },
    filterOption (input, option) {
      console.log(input, option)
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    addProduct () {
      this.products.push({
        product_id: null,
        quantity: 1,
        price: 0,
        description: ''
      })
      this.send()
    },
    deleteProduct (i) {
      this.products.splice(i, 1)
      this.send()
    },
    increment (i) {
      // eslint-disable-next-line
      if (this.products[i].product_id) {
        this.products[i].quantity++
      }
      this.send()
    },
    decrement (i) {
      // eslint-disable-next-line
      if (this.products[i].product_id && this.products[i].quantity > 1) this.products[i].quantity--
      this.send()
    },
    send () {
      const _products = [...this.products]
      if (
        this.isMaxWay &&
        this.products.length > 0 &&
        this.orderList.delivery_type !== 'self-pickup' &&
        !this.$route.params.id
      ) { _products.push(this.delivery_price) }
      this.$emit('input', _products)
    },
    clear () {
      this.products = [
        {
          product_id: null,
          quantity: 1,
          price: 0,
          description: ''
        }
      ]
    },
    productsValidation () {
      const array = this.products
      if (array.length > 1) {
        // eslint-disable-next-line
        let sortArray = []
        let havDublicate = true
        for (let i = 0; i < array.length; i++) {
          sortArray.push(Object.values(array[i])[2])
        }
        sortArray.filter((item, index) => {
          if (sortArray.indexOf(item) !== index) {
            this.$message.error(`${index} - ${index + 1} ${this.$t('dubProd')}`)
            havDublicate = false
          }
        })
        return havDublicate
      } else return true
    },
    validationFirstItem () {
      if (this.products.length < 1) {
        this.$message.error(this.$t('enterProduct'))
        return false
      }
      return true
    },
    spliceEmptyItems () {
      const p = [...this.products].filter(e => e.product_id !== null)
      this.products = p
      // console.log(this.products)
      return true
    },
    isValid () {
      if (this.spliceEmptyItems()) {
        if (this.validationFirstItem()) {
          return true
        } else return false
      }
    },
    calcultePrice (e) {
      console.log(e)
      if (this.orderList.delivery_type === 'self-pickup') {
        this.distance.price = 0
        this.distance.range = null
      } else {
        console.log(e)
        this.$store.dispatch('calcultePrice', e).then(res => {
          console.log(res)
          this.distance.price = res.price
          this.distance.range = res.hasOwnProperty('distance') ? res.distance : null
        })
      }
    }
  },
  computed: {
    ...mapGetters(['productsData', 'productsWithDeliveryProduct', 'Disablet']),
    totalPriceProduct () {
      console.log('delivery_type', this.orderList.delivery_type)
      const staticId = this.products.map(e => e.product_id).includes('faf3bd77-05f6-47b0-ae89-d7e97aff9d60')
      console.log('praducts =>', this.orderList, staticId, this.sours, this.isMaxWay)
      let totalPrice = 0
      for (let i = 0; i < this.products.length; i++) {
        const total = this.products[i].price * this.products[i].quantity
        totalPrice += total
      }
      if (this.isMaxWay && this.orderList.delivery_type !== 'self-pickup' && !this.$route.params.id) {
        totalPrice =
          totalPrice + (staticId ? 0 : this.products.length > 1 ? this.delivery_price.price : this.delivery_price.price)
      }
      return totalPrice
    }
  },
  mounted () {
    if (this.shipperIDS.includes(JSON.parse(localStorage.getItem('shipper_id')))) {
      this.isShipperIn = false
    } else {
      this.isShipperIn = true
    }
    if (this.$route.query.inputId) {
      console.log(this.Disablet)
      this.isEdit = false
      console.log('nimadir ')
    }

    this.getProducts({
      page: {
        current: 1,
        pageSize: 1000,
        is_active: true
      }
    }).then(res => {
      if (this.isMaxWay) {
        this.delivery_price.price = parseInt(
          res.products
            .filter(e => e.name.toLowerCase().includes('доставка'))
            .filter(p => p.id === 'd19eb5ea-c620-48f9-a3b1-1e199ceeaf69')[0].price
        )
      }
    })
  }
}
</script>

<style scoped></style>
