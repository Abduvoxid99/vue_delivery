<template>
  <a-card :title="$t('couriers')">
    <div slot="extra" style="display: flex; align-items: center; gap: 10px">
      <a-form-item style="margin: 0">
        <a-input id="inputSearch" v-debounce="search" :placeholder="$t('search') + '...'" v-decorator="['search']" />
      </a-form-item>
      <router-link v-if="this.$route.query.keys !== '3'" :to="{ name: 'CourierCreate' }">
        <a-button v-action:add style="float: right" shape="round" type="primary link" icon="plus">{{
          $t('add')
        }}</a-button>
      </router-link>
    </div>

    <a-tabs type="card" @change="callback">
      <a-tab-pane key="1" tab="Список курьеров" type="card">
        <a-table
          :columns="columns"
          :rowKey="record => record.id"
          :dataSource="couriers"
          :pagination="getPagination"
          :loading="loading"
          @change="handleTableChange"
        >
          <!-- <template slot="status" slot-scope="text">
          <a-tag v-if="text.is_active" color="#108ee9">
            {{ $t('active') }}
          </a-tag>
          <a-tag v-else color="#f50">
            {{ $t('blocked') }}
          </a-tag>
        </template> -->
          <template slot="status" slot-scope="text, row">
            <a-tag @click="changer(row, false)" v-if="text.is_active" color="#108ee9">
              {{ $t('active') }}
            </a-tag>
            <a-tag @click="changer(row, true)" v-else color="#f50">
              {{ $t('blocked') }}
            </a-tag>
          </template>
          <template slot="courier_type" slot-scope="text">
            <span style="color: blue">{{ text.name }}</span>
          </template>
          <template slot="action" slot-scope="text, row">
            <a-tooltip
              ><template slot="title">{{ $t('read') }}</template>
              <a-button
                icon="eye"
                type="default"
                id="buttonPreview"
                :loading="isFetchingCourier === row.id"
                @click="showPreviewModal(row.id)"
              >
              </a-button>
            </a-tooltip>
            <a-tooltip
              ><template slot="title">{{ $t('update') }}</template>
              <a-button
                v-action:update
                id="buttonUpdate"
                type="primary"
                @click="showUpdateModal(row)"
                icon="edit"
              ></a-button>
            </a-tooltip>
            <a-popconfirm
              placement="topRight"
              slot="extra"
              :title="$t('deleteMsg')"
              @confirm="deleteCourier($event, row.id, row.first_name, row.last_name, row.phone)"
              :okText="$t('yes')"
              :cancelText="$t('no')"
            >
              <a-tooltip
                ><template slot="title">{{ $t('delete') }}</template>
                <a-button v-action:delete id="buttonDelete" type="danger" icon="delete"></a-button>
              </a-tooltip>
            </a-popconfirm>
          </template>
        </a-table>
      </a-tab-pane>
      <a-tab-pane key="2" tab="Баланс курьеров" type="card">
        <courier-billing :searchText="searchText" />
      </a-tab-pane>
      <a-tab-pane key="3" tab="Архив курьеров" type="card">
        <courier-archive :searchText="searchText" />
      </a-tab-pane>
    </a-tabs>
    <a-modal v-model="previewVisible" :title="$t('previewCourier')">
      <a-descriptions layout="vertical" bordered>
        <a-descriptions-item :label="$t('firstName')">
          {{ selectedCourier.first_name ? selectedCourier.first_name : '' }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('lastName')">
          {{ selectedCourier.last_name ? selectedCourier.last_name : '' }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('phone')">
          {{ selectedCourier.phone ? selectedCourier.phone : '' }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('status')">
          {{ selectedCourier.is_active ? $t('active') : $t('blocked') }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('branches')">
          <div style="display: inline-block" :key="branch.branch_id" v-for="(branch, i) in selectedCourier.branches">
            <a-tag style="margin: 2px" v-if="branch.branch_name.length" :color="tagColors[i % 7]">
              {{ branch.branch_name }}
            </a-tag>
          </div>
        </a-descriptions-item>
        <a-descriptions-item :label="$t('createdAt')">
          {{ selectedCourier.created_at ? selectedCourier.created_at : '' }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('shipper_user_name')">
          {{ selectedCourier.shipper_user_name ? selectedCourier.shipper_user_name : '' }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('total_orders_count')">
          {{ selectedCourier.total_orders_count ? selectedCourier.total_orders_count : '0' }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('average_delivery_time')">
          {{ selectedCourier.average_delivery_time ? selectedCourier.average_delivery_time : '' }}
        </a-descriptions-item>
      </a-descriptions>
      <template slot="footer">
        <a-button key="back" @click="handlePreviewCancel">
          {{ $t('cancel') }}
        </a-button>
      </template>
    </a-modal>
    <a-modal v-model="updateVisible" :title="$t('updateCourier')" footer="">
      <a-form layout="horizontal" :form="form" @submit="handleSubmit" ref="updateForm">
        <a-row>
          <a-col :span="12" :style="{ padding: '0 10px' }">
            <a-form-item :label="$t('firstName')">
              <a-input
                id="inputFirstName"
                v-decorator="[
                  'first_name',
                  {
                    initialValue: selectedCourier.first_name,
                    rules: [
                      {
                        required: true,
                        message: $t('required')
                      }
                    ]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12" :style="{ padding: '0 10px' }">
            <a-form-item :label="$t('lastName')">
              <a-input
                id="inputLastName"
                v-decorator="[
                  'last_name',
                  {
                    initialValue: selectedCourier.last_name,
                    rules: [
                      {
                        required: true,
                        message: $t('required')
                      }
                    ]
                  }
                ]"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12" :style="{ padding: '0 10px' }">
            <a-form-item :label="$t('phone') + ' (+998*********)'">
              <a-input
                id="inputPhone"
                v-decorator="[
                  'phone',
                  {
                    initialValue: selectedCourier.phone,
                    rules: [
                      {
                        required: true,
                        message: $t('required')
                      },
                      {
                        validator: validatePhone
                      }
                    ]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" :style="{ padding: '0 10px' }">
            <a-form-item>
              <a-button id="buttonSubmit" type="primary" html-type="submit">
                {{ $t('save') }}
              </a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import request from '@/utils/request'
import CourierBilling from './CourierBilling.vue'
import CourierArchive from './CourierArchive.vue'

export default {
  components: {
    CourierBilling,
    CourierArchive
  },
  data () {
    return {
      data: [],
      searchText: null,
      loading: false,
      isFetchingCourier: null,
      tagColors: ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple'],
      columns: [
        {
          title: this.$t('firstName'),
          dataIndex: 'first_name'
        },
        {
          title: this.$t('lastName'),
          dataIndex: 'last_name'
        },
        {
          title: this.$t('phone'),
          dataIndex: 'phone'
        },
        {
          title: this.$t('createdAt'),
          dataIndex: 'created_at'
        },
        {
          title: this.$t('courier_type'),
          dataIndex: 'courier_type',
          scopedSlots: { customRender: 'courier_type' }
        },
        {
          title: this.$t('status'),
          // dataIndex: 'is_active',
          scopedSlots: { customRender: 'status' }
        },
        // {
        //   title: this.$t('workHours'),
        //   dataIndex: 'created_at'
        // },
        {
          title: this.$t('action'),
          key: 'action',
          width: '20%',
          scopedSlots: { customRender: 'action' }
        }
      ],
      form: this.$form.createForm(this, { name: 'coordinated' }),
      selectedCourier: { first_name: '', last_name: '', phone: '', id: '' },
      previewVisible: false,
      updateVisible: false,
      filterParams: {},
      isShipperId: ''
    }
  },
  computed: {
    ...mapGetters(['couriers', 'paginationCourier']),
    getPagination () {
      return this.paginationCourier
    }
  },
  created () {
    this.isShipperId = localStorage.getItem('shipper_id').replace('"', '').replace('"', '')
  },
  mounted () {
    this.loading = true
    setTimeout(() => {
      this.loading = false
    }, 500)
    this.getCouriers()
  },
  beforeDestroy () {},
  methods: {
    ...mapActions(['getCouriers', 'getCourierArchive']),
    callback (key) {
      this.$router.push({ name: this.$route.name, query: { keys: key } })
    },
    changer (row, val) {
      this.loading = true
      console.log('hello', row)
      delete row.branches
      const dataForm = {
        form: { ...row, is_active: val },
        courier_id: row.id
      }
      this.$store
        .dispatch('courierUpdate', dataForm)
        .then(res => {
          this.$message.success(this.$t('courierStatusChanged'))
          this.getCouriers()
        })
        .catch(() => {
          this.$message.error(this.$t('courierStatusNotChanged'))
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleTableChange (pagination) {
      this.getCouriers(pagination)
        .then(res => console.log(res))
        .catch(err => this.requestFailed(err))
    },
    deleteCourier (e, id) {
      request({
        url: '/couriers/' + id,
        method: 'delete'
      })
        .then(res => {
          console.log(res)
          this.$message.success(this.$t('successfullyDeleted'))
          this.getCouriers()
        })
        .then(err => {
          if (err) {
            this.$message.error(this.$t('error'))
          }
        })
    },
    showPreviewModal (id) {
      this.isFetchingCourier = id
      request({
        url: '/couriers/' + id,
        method: 'get'
      }).then(res => {
        this.selectedCourier = res
        this.isFetchingCourier = null
        this.previewVisible = true
        console.log(res)
      })
      // this.selectedCourier = courier
    },
    showUpdateModal (courier) {
      // eslint-disable-next-line standard/object-curly-even-spacing
      this.$router.push({ name: `CourierEdit`, params: { id: courier.id } })
      this.form = this.$form.createForm(this, { name: 'coordinated' })
      this.selectedCourier = courier
      console.log(courier)
      // this.updateVisible = true
    },
    startCourier (id) {},
    stopCourier (id) {},
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          const body = {
            id: this.selectedCourier.id,
            first_name: values['first_name'],
            last_name: values['last_name'],
            phone: values['phone'],
            park_id: '5ac8e30c-0e8d-4938-86cd-fca6c5447efb'
          }
          console.log(body)
          request({
            url: `/couriers/${body.id}`,
            method: 'put',
            data: body
          })
            .then(res => {
              this.getCouriers()
              this.updateVisible = false
              this.$message.success(this.$t('successfullyUpdated'))
            })
            .then(err => {
              if (err) {
                this.$message.success(this.$t('error'))
              }
            })
        }
      })
    },
    blockCourier (e, id) {
      console.log(e, id)
      request({
        url: '/couriers/' + id + '/block',
        method: 'patch'
      })
        .then(res => {
          console.log(res)
          this.$message.success(this.$t('successfullyUpdated'))
          this.getCouriers(this.getPagination)
        })
        .then(err => {
          if (err) {
            console.log(err)
          }
        })
    },
    unblockCourier (e, id) {
      console.log(e, id)
      request({
        url: '/couriers/' + id + '/unblock',
        method: 'patch'
      })
        .then(res => {
          console.log(res)
          this.$message.success(this.$t('successfullyUpdated'))
          this.getCouriers(this.getPagination)
        })
        .then(err => {
          if (err) {
            console.log(err)
          }
        })
    },
    handlePreviewCancel () {
      this.previewVisible = false
    },
    validatePhone (rule, value, callback) {
      if (/^[+][9][9][8]\d{9}$/.test(value)) {
        callback()
        // if ('+998' + value === "777777777") {
        //   callback(this.$t('phoneExists'));
        // } else {
        //   callback();
        // }
        // let params = {
        //   phone: value
        // }
        // let headers = {
        //   'Content-Type': 'application/json'
        // }
        // this.$axios.$get('/v1/couriers/search-couriers-by-phone',{
        //   params: params,
        //   headers: headers
        // }).then(res => {
        //   if (value === "77777") {
        //     callback('Telefon raqam mavjud!');
        //   } else {
        //     callback();
        //   }
        // });
        // callback();
      } else {
        callback(new Error(this.$t('incorrectPhone')))
      }
    },
    search (e) {
      this.searchText = e
      this.getCouriers({ current: 1, pageSize: 10, total: null, search: e })
    }
  }
}
</script>
