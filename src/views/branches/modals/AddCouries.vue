<template>
  <a-modal v-model="visible" :title="$t('assignCourier')" @ok="assignCourier" width="1000px">
    <div>
      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="couriersBranch"
        :pagination="paginationCourierBranch"
        :loading="loading"
        @change="handleTableChange"
      >
        <template slot="phone_El" slot-scope="text">
          <!-- {{$phoneFormatter(text.phone)}} -->
          <a style="color: black" :href="'tel:'+ text.phone" v-text="$phoneFormatter(text.phone)" />
        </template>
        <template slot="status" slot-scope="is_active">
          <a-tag v-if="is_active" color="#108ee9">
          </a-tag>
          <a-tag v-else color="#f50">
            {{ $t('blocked') }}
          </a-tag>
        </template>
        <template slot="action" slot-scope="text, row">
          <a-popconfirm
            placement="topRight"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="deleteCourier(row.id)"
            :okText="$t('yes')"
            :cancelText="$t('no')"
          >
            <a-tooltip><template slot="title">{{ $t('delete') }}</template>
              <a-button id="buttonDelete" type="danger" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
    <a-form-item :label="`Введите имя или телефон курьера:`">
      <a-select
        id="inputPhoneCourier"
        show-search
        label-in-value
        :value="value"
        :placeholder="$t('phone')"
        style="width: 100%"
        :filter-option="false"
        :not-found-content="fetching ? undefined : null"
        @search="fetchUser"
        @change="handleChange"
      >
        <a-spin v-if="fetching" slot="notFoundContent" size="small" />
        <a-select-option v-for="d in data" :key="d.value">
          {{ d.name + ' ' + $phoneFormatter(d.text) }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <template slot="footer">
      <a-button id="buttonSubmit" key="submit" type="primary" :loading="loading" @click="assignCourier">
        {{ $t('assignCourier') }}
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import request from '@/utils/request'
import debounce from 'lodash/debounce'
export default {
  data () {
    this.fetchUser = debounce(this.fetchUser, 800)
    return {
      couriersBranch: [],
      paginationCourierBranch: {},
      branchId: '',
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
          // dataIndex: 'phone',
          scopedSlots: { customRender: 'phone_El' }
        },
        {
          title: this.$t('createdAt'),
          dataIndex: 'created_at'
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '20%',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loading: false,
      visible: false,
      orderId: null,
      vendor: null,
      customer: null,
      value: [],
      fetching: false,
      data: [],
      courier_id: null
    }
  },
  methods: {
    async openModal (branchId) {
      this.branchId = branchId
      this.getCouriersBranch()
      this.visible = true
    },
    handleOk (e) {
      this.visible = false
    },
    handleChange (value) {
        // console.log(value)
        this.courier_id = value.key
      Object.assign(this, {
        value,
        data: [],
        fetching: false
      })
    },
     fetchUser (value) {
      console.log('fetching courier', value)
      this.data = []
      this.fetching = true
      request({
          url: '/couriers',
          params: { search: value },
          method: 'get'
        })
        .then(body => {
            console.log(body)
            // const couriersOfThisBranch = this.couriersBranch.map((c, i) => c.id)
            // var data = body.couriers.filter((c) => {
            //   return couriersOfThisBranch.indexOf(c.id) < 0
            // })
            const data = body.couriers.map(courier => {
              return {
                  name: courier.first_name + ' ' + courier.last_name,
                  text: `${courier.phone}`,
                  value: courier.id
              }
            })
            this.data = data
            this.fetching = false
        })
    },
    assignCourier () {
       request({
          url: `/branches/add-courier`,
          data: { courier_id: this.courier_id, branch_id: this.branchId },
          method: 'post'
      })
      .then(response => {
          this.value = ''
          this.visible = false
      })
    },
    deleteCourier (id) {
        request({
          url: `/branches/remove-courier`,
          data: { courier_id: id, branch_id: this.branchId },
          method: 'post'
      })
      .then(response => {
          console.log(response)
          this.value = ''
          this.getCouriersBranch(this.paginationCourierBranch)
      })
    },
    handleTableChange (pagination) {
      this.getCouriersBranch(pagination)
    .then((res) => console.log(res))
    .catch(err => this.requestFailed(err))
    },
    getCouriersBranch (page) {
      console.log(this.branchId, '    branchessssss')
      if (!page) {
          page = { current: 1, pageSize: 10, total: null }
        }
      this.loading = true
      request({
              url: '/branches/' + this.branchId + '/couriers',
              method: 'get',
              params: { page: page.current, limit: page.pageSize }
          }).then(res => {
              this.couriersBranch = res.couriers
              this.paginationCourierBranch = { ...page }
              this.paginationCourierBranch.total = parseInt(res.count)
              this.loading = false
            }).then(err => {
        if (err) {
          this.$message.error(this.$t('error'))
        }
      })
    }
  }
}
</script>
