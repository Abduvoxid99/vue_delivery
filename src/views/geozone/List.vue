<template>
  <div>
    <a-card v-action:get :title="$t('geozone.list')" style="width: 100%">
      <a-button type="primary" slot="extra" @click="$router.push({ name: 'GeozoneCreate' })">{{ $t('add') }}</a-button>
      <a-table
        :columns="columns"
        :data-source="allGeozone"
        :loading="geozoneLoad"
        :rowKey="item => item.id"
        :pagination="geozonePagination"
        @change="changePagination"
        bordered
      >
        <template slot="status" slot-scope="is_blocked">
          <a-tag v-if="!is_blocked" color="#108ee9">{{ $t('active') }}</a-tag>
          <a-tag v-else color="#f00">{{ $t('inactive') }}</a-tag>
        </template>
        <template slot="action" slot-scope="item">
          <a-tooltip>
            <template slot="title">{{ $t('update') }}</template>
            <a-button style="margin: 0 2px" id="buttonUpdate" type="primary" @click="edit(item)" icon="edit"></a-button>
          </a-tooltip>
          <a-popconfirm
            placement="topRight"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="remove(item)"
            :okText="$t('yes')"
            :cancelText="$t('no')"
          >
            <a-tooltip>
              <template slot="title">{{ $t('delete') }}</template>
              <a-button
                style="margin: 0 2px"
                type="danger"
                icon="delete"
              ></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>

    <!-- MODALS -->
    <!--    <customer-create ref="customerCreate" :params="params"></customer-create>-->
    <!--    <customer-create ref="customerEdit" :params="params" :edit="true"></customer-create>-->
    <!--    <customer-view ref="customerView"></customer-view>-->
  </div>
</template>
<script>
// import CustomerCreate from './CustomerCreate'
// import CustomerView from './PreviewCustomer'
import { mapActions, mapGetters } from 'vuex'
export default {
  // components: {
  //   'customer-create': CustomerCreate,
  //   'customer-view': CustomerView
  // },
  data () {
    return {
      visible: false,
      loading: false,
      slug: null,
      columns: [
        {
          title: this.$t('name'),
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
        },
        // {
        //   title: this.$t('phone'),
        //   dataIndex: 'phone',
        // },
        // {
        //   title: this.$t('status'),
        //   dataIndex: 'is_blocked',
        //   align: 'center',
        //   scopedSlots: { customRender: 'status' },
        // },
        {
          title: this.$t('action'),
          key: 'action',
          align: 'center',
          width: '20%',
          scopedSlots: { customRender: 'action' },
        },
      ],
      params: {
        pagination: {
          current: 1,
          pageSize: 10,
          total: null,
        },
        search: '',
      },
    }
  },
  methods: {
    ...mapActions(['getGeozoneList', 'deleteGeozone']),
    edit (item) {
      this.$router.push({
        name: 'GeozoneEdit',
        params: {
          id: item.id
        }
      })
      console.log(item)
    },
    changePagination (e) {
      this.params.pagination = e
      this.getGeozoneList(this.params)
    },
    // search (value) {
    //   console.log(value)
    //   this.params.search = value
    //   this.getGeozoneList(this.params)
    // },
    remove (item) {
      this.deleteGeozone(item.id).then(res => {
        this.getGeozoneList(this.params)
      })
    },
    // addCustomer () {
    //   this.$refs.customerCreate.show()
    // }
  },
  computed: {
    ...mapGetters(['allGeozone', 'geozoneLoad', 'geozonePagination']),
  },
  mounted () {
    this.getGeozoneList(this.params)
  },
}
</script>
