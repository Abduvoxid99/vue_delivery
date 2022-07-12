<template>
  <div>
    <a-card :title="$t('branch_user_list')" style="width: 100%">
      <a-button type="primary" slot="extra" @click="addData">{{ $t('add') }}</a-button>
      <a-row style="margin: 10px 0">
        <a-col :span="16"></a-col>
        <a-col :span="8">
          <a-input v-debounce="search" :placeholder="$t('search')" />
        </a-col>
      </a-row>
      <a-table
        :columns="columns"
        :data-source="allBranchUser"
        :loading="loadBranchUser"
        :rowKey="item => item.id"
        :pagination="paginationBranchUser"
        @change="changePagination"
        bordered
      >
        <template slot="status" slot-scope="is_active">
          <a-tag v-if="is_active" color="green">Active</a-tag>
          <a-tag v-else color="red">Deactive</a-tag>
        </template>
        <template slot="action" slot-scope="item">
          <a-tooltip>
            <template slot="title">{{ $t('update') }}</template>
            <a-button style="margin: 0 2px" id="buttonUpdate" type="primary" @click="editUser(item)" icon="edit"></a-button>
          </a-tooltip>
          <a-popconfirm
            placement="topRight"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="removeShipper(item)"
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
    <!--    <cropper ref="imageCrop"></cropper>-->
    <category-create ref="createUser" :editable="false" :params="params"/>
    <category-create ref="editUser" :editable="true" :slug="slug" :params="params"/>
    <!-- <category-edit ref="editUser" :editable="true" :params="params"/> -->
  </div>
</template>
<script>
import createUser from './BranchUserListCreateWithUpdate'
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    'category-create': createUser
  },
  data () {
    return {
      visible: false,
      loading: false,
      slug: null,
      columns: [
        {
          title: this.$t('name'),
          dataIndex: 'name'
        },
        {
          title: this.$t('phone'),
          dataIndex: 'phone'
        },
        {
          title: this.$t('status'),
          dataIndex: 'is_active',
          scopedSlots: { customRender: 'status' }
        },
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
        branch_id: this.$route.params.branchId
      },
    }
  },
  methods: {
    ...mapActions(['getBranchUsers', 'getRoles', 'deleteBranchUsers']),
    cropper () {
      this.$refs.imageCrop.show()
    },
    editUser (item) {
      console.log(item)
      const _data = { ...item }
      this.$refs.editUser.show(_data)
    },
    changePagination (e) {
      this.params.pagination = e
      this.getBranchUsers(this.params)
    },
    search (value) {
      console.log(value)
      this.params.search = value
      this.getBranchUsers(this.params)
    },
    removeShipper (item) {
      console.log(item)
      this.deleteBranchUsers(item.id).then(res => {
        this.getBranchUsers(this.params)
      })
    },
    addData () {
      this.$refs.createUser.show()
    }
  },
  computed: {
    ...mapGetters(['loadBranchUser', 'allBranchUser', 'paginationBranchUser']),
  },
  mounted () {
    this.getRoles({
      pagination: {
        current: 1,
        pageSize: 1000,
        total: null,
      },
    })
    this.getBranchUsers(this.params)
  },
}
</script>
<style>
.ant-table-row:hover {
  cursor: pointer;
}
.imagePreview img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
</style>
