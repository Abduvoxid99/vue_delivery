<template>
  <a-card>
    <div slot="title">
      <span>{{ $t('couriers_type') }}</span>
    </div>
    <div slot="extra">
      <a-input-search icon="search"
                      v-model="params.search"
                      v-debounce="searchCourirerType"
    ></a-input-search></div>
    <a-card :bordered="false">
      <div slot="extra">
        <a-tooltip>
          <span slot="title">{{ $t('newCourierTypeAdd') }}</span>
          <a-button type="primary" @click="CreateCourier">
            <a-icon type="plus"></a-icon>
            {{ $t('add') }}</a-button>
        </a-tooltip>
      </div>
      <a-table
        bordered
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="fiflterTable"
        :pagination="filterPagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template slot="button" slot-scope="text" style="margin: auto">
          <span v-if="text">
            <a-tooltip placement="bottom">
        <template slot="title">
          <span>{{ $t('updatecourier') }}</span>
        </template>
            <a-button type="primary" @click="UpdateCurierTypeItemId(text.id)"><a-icon type="edit"></a-icon>
            </a-button>
          </a-tooltip>
             </span>
          <span v-if="text" style="margin-left: 10px">
            <a-popconfirm placement="top" ok-text="Yes" cancel-text="No" @confirm="deleteItem(text.id)">
        <template slot="title">
          <p>{{ $t('deletecouriermessege') }}</p>
        </template>
              <a-tooltip placement="bottom">
        <template slot="title">
          <span>{{ $t('deletecourier') }}</span>
        </template>
        <a-button type="danger"> <a-icon type="delete"></a-icon></a-button>
              </a-tooltip>
      </a-popconfirm>
          </span>
        </template>

      </a-table>
    </a-card>
  </a-card>
</template>

<script>
import { mapGetters } from 'vuex'
// import debounce from 'vue-debounce'
 export default {
  watch: {},
    data () {
      return {
        loading: false,
        columns: [
          {
            title: this.$t('Name'),
            dataIndex: 'name',
            key: 'name',
            align: 'center'
          },
          {
            title: this.$t('distance_from'),
            key: 'distance_from',
            dataIndex: 'distance_from',
            align: 'center'

          },
          {
            title: this.$t('distance_to'),
            dataIndex: 'distance_to',
            key: 'pickup',
            align: 'center'
          },
          // {
          //   title: 'tag',
          //   key: 'tag',
          //   scopedSlots: { customRender: 'tag' }
          // },
          {
            title: this.$t('Buttons'),
            key: 'button',
            align: 'center',
            width: '15%',
            scopedSlots: { customRender: 'button' }
          }
        ],
        params: {
          page: { page: 1, limit: 10, totle: null },
          search: '',
        }
      }
},
  methods: {
    UpdateCurierTypeItemId (id) {
      this.$router.push({ name: 'CourierTypeEdit', params: { id: id } })
    },

    handleTableChange (pagination) {
      this.loading = !this.loading
      this.$store.dispatch('getCourierTypesList', pagination)
        .finally(() => {
          this.loading = !this.loading
        })
    },
    searchCourirerType () {
      this.loading = true
      this.$store.dispatch('getCourierTypesList', this.params)
      .then(res => {
        console.log(res)
        // this.$notification.success({
        //   message: this.$t('курьер найден'),
        // })
      })
        .catch(error => {
          console.log(error)
          // this.$notification.error({
          //   message: this.$t('курьер не найден'),
          // })
        })
      .finally(() => {
        this.loading = false
      })
    },
    CreateCourier () {
      this.$router.push({ name: 'CourierTypeCreate' })
    },
    deleteItem (id) {
      this.loading = !this.loading
      this.$store.dispatch('RemoveTypeId', id)
      .then(res => {
        console.log('delete', res)
        this.$notification.success({
          message: 'Тип курьера успешно удалено',
          duration: 2
        })
        this.getCurierTypeList(this.params)
      })
        .catch(err => {
          if (err.response?.status === 400) {
             this.$notification.error({
            message: 'Прикрепленных курьеров невозможно удалить',
            duration: 2
          })
          } else {
            this.$notification.error({
            message: 'Ошибка удаления типа курьера',
            duration: 2
          })
          }
        })
      .finally(() => {
        this.loading = !this.loading
      })
    },
getCurierTypeList (valueParams) {
      this.loading = true
  this.$store.dispatch('getCourierTypesList', valueParams)
  .finally(() => {
    this.loading = false
  })
}
  },
  computed: {
    ...mapGetters(['courierTypeLIst', 'paginationCourierType']),
    fiflterTable () {
      return this.courierTypeLIst
    },
    filterPagination () {
      return this.paginationCourierType
    }
  },
  mounted () {
    this.params.page = { ...this.paginationCourierType }
    this.getCurierTypeList(this.params)
  },
  created () {

  }

 }
</script>

<style scoped>

</style>
