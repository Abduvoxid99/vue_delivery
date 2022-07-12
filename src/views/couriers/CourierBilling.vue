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
    <template slot="balance" slot-scope="text">
      <span :class="[{green: text > 0, blue: text == 0, red: text < 0}]" >{{ text.toLocaleString() }}</span>
    </template>
    <template slot="action" slot-scope="row">
      <a-tooltip><template slot="title">{{ $t('Показать транзакции') }}</template>
      <a-button
        icon="eye"
        type="default"
        id="buttonPreview"
        @click="showTransactions(row)"
      />
      </a-tooltip>
      <a-tooltip><template slot="title">{{ $t('Пополнить баланс') }}</template>
        <a-button style="margin: 0 10px" type="primary" @click="openModal(row, 'add')" icon="plus-circle" />
      </a-tooltip>
      <a-tooltip><template slot="title">{{ $t('Cписать деньги из баланса') }}</template>
        <a-button type="danger" @click="openModal(row, 'deduct')" icon="minus-circle" />
      </a-tooltip>

    </template>
  </a-table>
  <a-modal
    @ok="updateBalance"
    v-model="modalVisible"
    :title="`${modalType === 'add' ? 'Пополнить баланс' : 'Cписать деньги из баланса'}`"
    :okType="`${modalType === 'add' ? 'primary' : 'danger'}`"
    :okText="`${modalType === 'add' ? 'Добавить' : 'Снять'}`"
    :confirm-loading="modalLoading"
  >
    <p><strong>Курьер:</strong> {{ selectedCourier.courier_name }}</p>
    <div style="display: flex; align-items: center; justify-content: center; margin-top: 40px" >
      <a-form-item :validateStatus="inputError ? 'error' : ''" :required="true" :extra="inputError" style="width: 300px;" label="Сумма" :colon="true" labelAlign="left" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" >
        <a-input-number
          style="width: 100%"
          type="number"
          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :parser="value => value.replace(/\$\s?|(,*)/g, '')"
          v-model="inputedBalance"
          onkeypress='return event.charCode >= 48 && event.charCode <= 57'
        />
      </a-form-item>
    </div>
  </a-modal>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  // eslint-disable-next-line
  props: ['searchText'],
  data: () => ({
    tableData: [],
    loading: false,
    modalVisible: false,
    modalType: null,
    modalLoading: false,
    inputError: '',
    selectedCourier: {
      courier_name: '',
      courier_id: null
    },
    inputedBalance: 0,
    pagination: {
      current: 1,
      total: 1,
      pageSize: 10
    },
    columns: [
      {
        title: 'Имя курьера',
        dataIndex: 'courier_name',
        key: 'courier_name'
      },
      {
        title: 'Номер телефона',
        dataIndex: 'courier_phone',
        key: 'courier_phone'
      },
      {
        title: 'Баланс',
        dataIndex: 'balance',
        key: 'balance',
        align: 'center',
        scopedSlots: {
          customRender: 'balance'
        }
      },
      {
        title: 'Действия',
        align: 'center',
        scopedSlots: {
          customRender: 'action'
        }
      }
    ]
  }),
  mounted () {
    this.fetchTableData()
  },
  watch: {
    modalVisible (value) {
      if (value) this.inputedBalance = 0
    },
    searchText () {
      this.pagination.current = 1
      this.fetchTableData()
    },
    inputedBalance () {
      this.inputError = ''
    }
  },
  methods: {
    ...mapActions(['getCourier', 'updateCourierBalance']),
    fetchTableData () {
      this.loading = true
      this.getCourier({
        limit: 100,
        page: this.pagination.current,
        search: this.searchText
      })
        .then(res => {
          this.tableData = res.courier_balances
          this.pagination.total = res.count
        })
        .finally(() => { this.loading = false })
    },
    tableChangeHandler (pagination) {
      this.pagination = pagination
      this.fetchTableData()
    },
    openModal (data, type) {
      this.selectedCourier = data
      this.modalType = type
      this.modalVisible = true
    },
    updateBalance () {
      if (this.inputedBalance <= 0) {
        this.inputError = 'Сумма должна быть больше нуля'
        return null
      }
      this.modalLoading = true
      this.updateCourierBalance({ id: this.selectedCourier.courier_id, balance: this.inputedBalance, action: this.modalType })
        .then(res => {
          this.modalVisible = false
          this.fetchTableData()
        }).finally(() => { this.modalLoading = false })
    },
    showTransactions (data) {
      const id = data.courier_id
      this.$router.push({ name: `CourierTransactions`, params: { id } })
    }
  }
}
</script>

<style scoped>
  .blue {
    color: #1990FF;
  }

  .green {
    color: #76b35c;
  }

  .red {
    color: #F94C50;
  }
</style>
