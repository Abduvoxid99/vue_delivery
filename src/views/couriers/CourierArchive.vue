<template>
  <div>
    <a-table
      bordered
      :pagination="pagination"
      :loading="loading"
      @change="tableChangeHandler"
      :dataSource="tableData"
      :columns="columns"
    >
      <template slot="action" slot-scope="text, row">
        <a-tooltip :style="{marginRight: '5px'}">
          <template slot="title">{{ $t('send_message') }}</template>
          <a-button icon="message" type="default" id="buttonPreview" @click="showPreviewModal(row.phone)"> </a-button>
        </a-tooltip>
        <a-tooltip>
          <template slot="title">{{ $t('revert') }}</template>
          <a-button icon="rollback" type="default" id="buttonPreview" @click="revertCourier(row, true)"> </a-button>
        </a-tooltip>
      </template>
    </a-table>
    <a-modal v-model="previewVisible" :title="$t('send_message')">
      <a-form-model :model="form">
        <a-form-model-item :label="$t('text')" prop="text">
          <a-input type="textarea" v-model="form.message" />
        </a-form-model-item>
      </a-form-model>
      <template slot="footer">
        <a-button key="cancel" @click="handlePreviewCancel">
          {{ $t('cancel') }}
        </a-button>
        <a-button key="send" @click="handlePreviewSend">
          {{ $t('send') }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import request from '@/utils/request'
import { mapActions } from 'vuex'

export default {
  // eslint-disable-next-line
  props: ['searchText'],
  data: () => ({
    tableData: [],
    loading: false,
    pagination: {
      current: 1,
      total: 1,
      pageSize: 50
    },
    previewVisible: false,
    columns: [
      {
        title: 'Имя',
        dataIndex: 'first_name'
      },
      {
        title: 'Фамилия',
        dataIndex: 'last_name'
      },
      {
        title: 'Номер телефона',
        dataIndex: 'phone',
        key: 'phone'
      },
      {
        title: 'Дата создания',
        dataIndex: 'created_at',
        key: 'created_at'
      },
      {
        title: 'Дата удаления',
        dataIndex: 'deleted_at',
        key: 'deleted_at'
      },
      {
        title: 'Действия',
        key: 'action',
        align: 'center',
        width: '10%',
        scopedSlots: { customRender: 'action' }
      }
    ],
    form: {
      message: '',
      phone: ''
    },
  }),
  mounted () {
    this.fetchTableData()
  },
  watch: {
    searchText () {
      this.pagination.current = 1
      this.fetchTableData()
    }
  },
  methods: {
    ...mapActions(['getCourierArchive']),
    fetchTableData () {
      this.loading = true
      this.getCourierArchive({
        limit: 50,
        page: this.pagination.current,
        search: this.searchText
      })
        .then((res) => {
          this.tableData = res.reports
          this.pagination.total = res.count
        })
        .finally(() => {
          this.loading = false
        })
    },
    tableChangeHandler (pagination) {
      this.pagination = pagination
      this.fetchTableData()
    },
    showPreviewModal (phone) {
      this.form.phone = phone
      this.previewVisible = true
    },
    handlePreviewCancel () {
      this.previewVisible = false
      this.form.message = ''
    },
    revertCourier (row, val) {
      this.loading = true
      const dataForm = {
        form: { created_at: row.created_at, first_name: row.first_name, id: row.id, last_name: row.last_name, phone: row.phone, is_active: val },
        courier_id: row.id
      }
      this.$store
        .dispatch('courierUpdate', dataForm)
        .then(res => {
          this.$message.success(this.$t('courierStatusChanged'))
          this.fetchTableData()
        })
        .finally(() => {
          this.loading = false
        })
    },
    handlePreviewSend () {
      request({
        url: '/courier-sms-inform',
        method: 'post',
        data: this.form
      })
        .then((res) => {
          this.$message.success(res.Message)
          this.form.message = ''
        })
        .finally(() => {
          this.previewVisible = false
        })
    },
  },
}
</script>
