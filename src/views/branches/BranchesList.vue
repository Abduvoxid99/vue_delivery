<template>
  <div>
    <a-card size="small" v-action:get :title="$t('branch.list')">
      <div slot="extra">
      <a-row type="flex" justify="end" :gutter="8">
         <a-col span="auto">
            <router-link :to="{ name: 'BranchCreate' }">
            <a-button v-action:add type="primary" icon="plus">{{ $t('add') }}</a-button>
          </router-link>
         </a-col>
      </a-row>
      </div>
      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :name="(record, i) => i"
        :dataSource="branches"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
      >
         <template slot="status" slot-scope="is_active, row">
          <!-- <a-switch :default-checked="is_active" @change="changeBranchStatus" /> -->
          <a-switch v-if="is_active" default-checked @change="changeBranchStatus(false, row)" />
          <a-switch v-else @change="changeBranchStatus(true, row)" />
        </template>
        <template slot="phone_El" slot-scope="text">
          <!-- {{$phoneFormatter(text.phone)}} -->
          <a style="color: black" :href="'tel:'+ text.phone" v-text="$phoneFormatter(text.phone)" />
        </template>
        <template slot="action" slot-scope="text, row">
          <a-tooltip><template slot="title">{{ $t('branch_user') }}</template>
            <a-button size="small" :user="text.name" style="margin: 0 2px" type="default" @click="enterBranchUser(row.id)" icon="team"></a-button>
          </a-tooltip>
          <a-tooltip><template slot="title">{{ $t('addCourier') }}</template>
            <a-button size="small" :add="text.name" style="margin: 0 2px" type="primary" @click="$refs.modal.openModal(row.id)" icon="car"></a-button>
          </a-tooltip>
          <a-tooltip><template slot="title">{{ $t('read') }}</template>
            <a-button size="small" :read="text.name" style="margin: 0 2px" type="default" @click="showPreviewModal(row.id)" icon="eye"></a-button>
          </a-tooltip>
          <router-link :to="{ name: 'BranchUpdate', params: { id: row.id } }">
            <a-tooltip><template slot="title">{{ $t('update') }}</template>
              <a-button :update="text.name" size="small" style="margin: 0 2px" v-action:update id="buttonUpdate" type="primary" icon="edit"></a-button>
            </a-tooltip>
          </router-link>
          <a-popconfirm
            placement="topRight"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="deleteVendor($event, row.id)"
            :okText="$t('yes')"
            :cancelText="$t('no')"
          >
            <a-tooltip><template slot="title">{{ $t('delete') }}</template>
              <a-button :delete="text.name" size="small" style="margin: 0 2px" v-action:delete id="buttonDelete" type="danger" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model="previewVisible" width="700px" :title="$t('previewBranch')">
      <a-descriptions layout="vertical" bordered>
        <a-descriptions-item :label="$t('name')">
          {{ selected_branch.name }}
        </a-descriptions-item>
<!--        <a-descriptions-item :label="$t('username')">-->
<!--          {{ selected_branch.username }}-->
<!--        </a-descriptions-item>-->
<!--        <a-descriptions-item :label="$t('password')">-->
<!--          {{ selected_branch.password }}-->
<!--        </a-descriptions-item>-->
        <a-descriptions-item :label="$t('phone')">
          <a :href="'tel:'+selected_branch.phone"></a> {{ $phoneFormatter(selected_branch.phone) }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('createdAt')">
          {{ selected_branch.created_at }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('address')">
          {{ selected_branch.address }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('destination')">
          {{ selected_branch.destination == "not given" ? "Hе указан": selected_branch.destination }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('status')">
          {{ (selected_branch.is_active ? $t('active') : $t('blocked')) }}
        </a-descriptions-item>
      </a-descriptions>
      <template slot="footer">
        <a-button key="back" @click="handlePreviewCancel">
          {{ $t('cancel') }}
        </a-button>
      </template>
    </a-modal>
    <add-courier v-action:get ref="modal"/>
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions, mapGetters } from 'vuex'
import AddCourier from './modals/AddCouries'
import request from '@/utils/request'
export default {
  data () {
    return {
      data: [],
      type: false,
      loading: false,
      isBtnClicked: false,
      location: {},
      fetching: false,
      updateLoading: false,
      address: '',
      selectedBranchPhone: '',
      dataGeo: [],
      valueGeo: '',
      fetchIdGeo: null,
      timeOut: null,
      columns: [
        {
          title: this.$t('name'),
          dataIndex: 'name'
        },
        // {
        //   title: this.$t('username'),
        //   dataIndex: 'username'
        // },
        {
          title: this.$t('phone'),
          // dataIndex: 'phone',
          key: 'phone',
          scopedSlots: { customRender: 'phone_El' }
        },
        {
          title: this.$t('status'),
          dataIndex: 'is_active',
          align: 'center',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: this.$t('action'),
          key: 'action',
          align: 'center',
          width: '25%',
          scopedSlots: { customRender: 'action' }
        }
      ],
      previewVisible: false,
      updateVisible: false,
      spinning: true,
      givenAddresses: [],
      filterParams: {}
    }
  },
  components: {
    AddCourier
  },
  created () {
    this.type = Object.keys(localStorage).includes('crm')
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'coordinated' })
  },
  computed: {
    ...mapGetters(['branches', 'pagination_branches', 'selected_branch']),
    getPagination () {
      return this.pagination_branches
    },
    getSelectedBranches () {
      return this.selected_branch
    }
  },
  mounted () {
    this.getBranches().then(() => { this.spinning = false })
  },
  beforeDestroy () {
  },
  methods: {
    ...mapActions(['getBranches', 'getSelectedBranch']),
    //   getAddressData (addressData, placeResultData, id) {
    //     this.address = addressData
    //     console.log(placeResultData)
    //     this.location = { lat: addressData.latitude, long: addressData.longitude }
    //     this.address = placeResultData.name + ',' + placeResultData.formatted_address
    // },

    // updateBranch () {
    //   this.isBtnClicked = true
    //   this.$store.dispatch('updateCrmBranch').then(res => {
    //     console.log(res)
    //     this.$message.success('Филиал успешно обновлен')
    //   }).finally(() => {
    //     this.isBtnClicked = false
    //   })
    // },
    fetchGeo (valueGeo) {
      this.fetching = true
      clearTimeout(this.timeOut)
      this.lastFetchIdGeo = 0
      this.lastFetchIdGeo += 1
      const fetchIdGeo = this.lastFetchIdGeo
      this.dataGeo = []
      this.timeOut = setTimeout(() => {
        axios({
          method: 'get',
          url: 'https://geocode-maps.yandex.ru/1.x/',
          params: {
            format: 'json',
            apikey: '63692694-f926-4124-92cb-8cf1dabbc883',
            geocode: valueGeo,
            lang: 'ru-RU',
            results: 5,
            ll: '69.241320,41.292906',
            spn: '1.5,1.5',
            rspn: 1
          }
        })
          .then(body => {
            if (fetchIdGeo !== this.lastFetchIdGeo) {
              // for fetch callback order
              return
            }
            this.fetching = false
            console.log(body.data, 'body')
            this.givenAddresses = body.data.response.GeoObjectCollection.featureMember
            const dataGeo = body.data.response.GeoObjectCollection.featureMember.map(phone => ({
              text: phone.GeoObject.metaDataProperty.GeocoderMetaData.Address.formatted,
              value: phone.GeoObject.metaDataProperty.GeocoderMetaData.Address.formatted
            }))
            this.dataGeo = dataGeo
            console.log(this.dataGeo)
          })
      }, 1000)
    },
    handleChangeGeo (valueGeo) {
      console.log(this.givenAddresses)
      this.dataGeo = []
      const handleDataGeo = this.givenAddresses.find(address => {
        if (address.GeoObject.metaDataProperty.GeocoderMetaData.Address.formatted === valueGeo) {
          return address
        }
      })
      console.log(handleDataGeo)
      const tempAddress = handleDataGeo.GeoObject.metaDataProperty.GeocoderMetaData.Address.formatted.split(',')
      this.address = tempAddress.reverse().join(', ')
      const coord = handleDataGeo.GeoObject.Point.pos.split(' ')
      this.location = { lat: coord[1], long: coord[0] }
    },
    enterBranchUser (id) {
      this.$router.replace({
        name: 'BranchUserList',
        params: {
          branchId: id
        }
      })
      console.log(id)
    },
    handleTableChange (pagination) {
      this.getBranches(pagination)
    .then((res) => console.log(res))
    .catch(err => this.requestFailed(err))
    },
    deleteVendor (e, id) {
      request({
              url: '/branches/' + id,
              method: 'delete'
          }).then(res => {
            this.$message.success(this.$t('successfullyDeleted'))
            this.getBranches()
          }).then(err => {
        if (err) {
          this.$message.error(this.$t('error'))
        }
      })
    },
    showPreviewModal (vendorId) {
      this.getSelectedBranch(vendorId).then(() => {
        this.selectedBranchPhone = this.selected_branch.phone.join(', ')
      })
      this.previewVisible = true
      console.log('selected_branch', this.selected_branch)
    },
    showUpdateModal (vendorId) {
      this.updateLoading = false
      this.form = this.$form.createForm(this, { name: 'coordinated' })
      this.getSelectedBranch(vendorId).then(() => {
        console.log(this.selected_branch)
        this.location = this.selected_branch.location
        this.address = this.selected_branch.address
        this.loading = false
      })
      this.updateVisible = true
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          var phoneNumbers = values['phone']
          const isArrayString = Array.isArray(phoneNumbers)
          console.log(isArrayString, 'isArray')
          if (!isArrayString) {
            phoneNumbers = phoneNumbers.split(',')
          }
          console.log(phoneNumbers)
          const body = {
            id: this.selected_branch.id,
            name: values['name'],
            username: values['user_name'],
            phone: phoneNumbers,
            destination: values['destination'],
            address: this.address,
            password: values['password'],
            shipper_id: 'e70deff2-3446-4cc0-872e-79e78af432b9',
            location: this.location
          }
          console.log(body, 'body branch')
            request({
                url: '/branches',
                method: 'put',
                data: body
            })
            .then(res => {
              this.updateLoading = true
              this.getBranches()
              this.updateVisible = false
              this.$message.success(this.$t('successfullyUpdated'))
            }).then(err => {
              if (err) {
                this.$message.success(this.$t('error'))
              }
            })
        }
      })
    },
    handlePreviewCancel () {
      this.previewVisible = false
    },
    validatePhone (rule, value, callback) {
      if (/^[+][9][9][8]\d{9}$/.test(value)) {
        callback()
      } else {
        callback(new Error(this.$t('incorrectPhone')))
      }
    },
    search (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.filterParams = values
          this.pagination.current = 1
        }
      })
    },
    changeBranchStatus (value, record) {
      this.loading = true
      const dataForm = { ...record, is_active: value }
      this.$store
        .dispatch('updateBranch', dataForm)
        .then(() => {
          this.$message.success(this.$t('branchStatusChanged'))
          this.getBranches()
        })
        .catch(() => {
          this.$message.error(this.$t('branchStatusNotChanged'))
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
