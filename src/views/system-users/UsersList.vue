<template>
  <div>
    <a-row v-action:get>
      <a-col :span="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>{{ $t('operators') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>

      <a-col :span="12">
        <router-link v-action:add to="././create">
          <a-button style="float: right" shape="round" type="primary link" icon="plus">{{ $t('add') }}</a-button>
        </router-link>
      </a-col>
    </a-row>

    <a-card v-action:get :title="$t('list')">
      <div slot="extra">
        <a-form layout="horizontal" :form="form">
          <a-row>
            <a-col :span="24" style="padding: 5px">
              <a-form-item style="margin: 0">
                <a-input id="inputSearch" v-debounce="search" :placeholder="$t('search') + '...'" v-decorator="['search']"/>
              </a-form-item>
            </a-col>
<!--            <a-col :span="12" style="padding: 5px">-->
<!--              <a-form-item style="margin: 0">-->
<!--                <a-button id="buttonSearch" type="default" html-type="submit" icon="search">{{ $t('search') }}</a-button>-->
<!--              </a-form-item>-->
<!--            </a-col>-->
          </a-row>
        </a-form>
      </div>

      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="systemUsers"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template slot="action" slot-scope="text, row">
          <a-tooltip><template slot="title">{{ $t('read') }}</template>
            <a-button id="buttonPreview" type="default" @click="showPreviewModal(row.id)" icon="eye"></a-button>
          </a-tooltip>
          <a-tooltip><template slot="title">{{ $t('update') }}</template>
            <router-link :to="{ name: 'UsersUpdate', params: { id: row.id}}">
              <a-button v-action:update type="primary" icon="edit"></a-button>
            </router-link>
          </a-tooltip>
          <a-popconfirm
            v-action:delete
            placement="topRight"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="deleteUser($event, row.id)"
            :okText="$t('yes')"
            :cancelText="$t('no')"
          >
            <a-tooltip><template slot="title">{{ $t('delete') }}</template>
              <a-button v-action:delete id="buttonDelete" type="danger" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
        <template slot="role" slot-scope="item">
          {{ roleName(item.user_role_id) }}
        </template>
      </a-table>
    </a-card>
    <a-modal v-model="previewVisible" width="800px" title="Информация об операторе">
      <a-descriptions layout="vertical" bordered>
        <a-descriptions-item :label="$t('fullName')">
          {{ selectedUser.name }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('username')">
          {{ selectedUser.username }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('phone')">
          {{ selectedUser.phone }}
        </a-descriptions-item>
      </a-descriptions>
      <template slot="footer">
        <a-button id="buttonCancel" key="back" @click="handleCancel">
          {{ $t('cancel') }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import request from '@/utils/request'
export default {
  data () {
    return {
      value: '',
      data: [],
      loading: true,
       columns: [
        {
          title: this.$t('fullName'),
          dataIndex: 'name'
        },
        {
          title: this.$t('username'),
          dataIndex: 'username'
        },
        {
          title: this.$t('phone'),
          dataIndex: 'phone'
        },
         {
          title: this.$t('role'),
           scopedSlots: { customRender: 'role' }
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '20%',
          scopedSlots: { customRender: 'action' }
        }
      ],
      form: this.$form.createForm(this, { name: 'coordinated' }),
      previewVisible: false,
      selectedUser: {},
      parentCategory: '',
      filterParams: {}
    }
  },
  computed: {
    ...mapGetters(['systemUsers', 'allRoles', 'paginationSystemUsers']),
    getPagination () {
      return this.paginationSystemUsers
    }
  },
  mounted () {
    this.getSystemUsers().then(() => {
      this.loading = false
      console.log(this.systemUsers)
    })
    this.getRoles({
      current: 1,
      pageSize: 1000,
      user_type_id: '2a1efd4a-d527-4cc2-adfa-a7546021f0f6'
    })
  },
  beforeDestroy () {
  },
  methods: {
    ...mapActions(['getSystemUsers', 'getRoles']),
    roleName (id) {
      if (this.allRoles) {
        for (var i = 0; i < this.allRoles.length; i++) {
          if (id === this.allRoles[i].id) return this.allRoles[i].name
        }
        return 'Not Role'
      }
    },
    handleTableChange (pagination) {
      this.getSystemUsers(pagination)
    .then((res) => console.log(res))
    .catch(err => this.requestFailed(err))
    },
    showPreviewModal (tariffId) {
      console.log(tariffId)
      this.getSelectedUser(tariffId)
      this.previewVisible = true
    },
    getSelectedUser (selectedUser) {
      request({
        url: '/shipper-users/' + selectedUser,
        method: 'get'
      }).then((response) => {
        this.selectedUser = response
      })
    },
    handleCancel () {
      this.previewVisible = false
    },
    deleteUser (e, id) {
      request({
              url: '/shipper-users/' + id,
              method: 'delete'
          }).then(res => {
              console.log(res)
              this.$message.success(this.$t('successfullyDeleted'))
              this.getSystemUsers()
          }).then(err => {
        if (err) {
          this.$message.error(this.$t('error'))
        }
      })
    },
    search (e) {
      this.getSystemUsers({ current: 1, pageSize: 10, total: null, search: e })
    }
  }
}
</script>
