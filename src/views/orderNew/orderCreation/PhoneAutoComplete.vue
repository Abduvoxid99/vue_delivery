<template>
  <a-spin :spinning="loadingSearchingCustomers">
    <div style="display: flex; width: 100%; height: 32px">
      <a-button type="default" class="defBtn">+998</a-button>
      <a-auto-complete
        v-model="number"
        dropdown-class-name="dropdown"
        style="width: 100%;"
        :disabled="disabled"
        placeholder=" ( XX ) - XXX - XX - XX"
        @search="searchCustomer"
        @select="selectCustomer"
      >
        <template slot="dataSource">
            <a-select-option v-for="user in searchingCustomers" :value="user.phone" :key="user.id + ':' + user.phone +':' + user.name">
              <a-row>
                <a-col :span="4">
                  <a-icon style="font-size: 32px; margin-top: 5px" type="user" />
                </a-col>
                <a-col :span="20">
                  <p style="margin: 0; padding: 0"><strong>{{ user.name }}</strong></p>
                  <p style="margin: 0; padding: 0">{{ user.phone }}</p>
                </a-col>
              </a-row>
            </a-select-option>
        </template>
      </a-auto-complete>
      <a-tooltip>
        <template slot="title">
          <span>{{ number && isNumber ? $t('copy_number') : $t('error_number') }}</span>
        </template>
        <a-button v-clipboard:copy="userData && userData.phone ? userData.phone : `+998${number}`" v-clipboard:success="copySuccess" v-if="number && isNumber" type="default" icon="copy" class="copyBtn" />
      </a-tooltip>
      <a-popover>
        <template slot="content">
          <p>Это номер телефона с ошибкой</p>
          <p><strong>Hеверный</strong>: <span style="color: red">+998{{ number }}</span></p>
          <p><strong>Верный</strong>: <span style="color: green">+998 91 234 56 78</span></p>
        </template>
        <a-button v-if="number && !isNumber" type="danger" icon="exclamation-circle" class="copyBtn" />
      </a-popover>
    </div>
  </a-spin>
</template>

<script>
import { AutoComplete } from 'ant-design-vue'
import { mapGetters, mapActions } from 'vuex'
import debounce from 'lodash/debounce'

export default {
  components: {
    'a-auto-complete': AutoComplete
  },
  props: {
    disabled: {
      type: Boolean,
    }
  },
  data () {
    this.searchCustomer = debounce(this.searchCustomer, 1000)
    return {
      isNumber: false,
      number: '',
      userData: {
        name: '',
        phone: '',
        id: ''
      }
    }
  },
  // watch: {
  //   aggregatorValue: function (val) {
  //     this.number = val
  //     this.searchCustomer(val)
  //   }
  // },
  methods: {
    ...mapActions(['getPhoneCustomers']),
    clear () {
      this.isNumber = false
      this.number = ''
      this.userData = {
        name: '',
        phone: '',
        id: ''
      }
    },
    send () {
      this.$emit('input', {
        value: this.number,
        data: this.userData
      })
    },
    copySuccess (e) {
      this.$message.success(this.$t('numberCopied') + ':  ' + e.text)
    },
    searchCustomer (val) {
      console.log('phone', val)
      console.log('phone=>>', val)
      if (val) {
        if (/^\d{9}$/.test(val)) {
          this.isNumber = true
        } else {
          this.isNumber = false
        }
        if (val !== '' && /^[0-9]*$/.test(val) && !(val.length > 9)) {
          this.getPhoneCustomers({
            limit: 5,
            phone: '+998' + val
          }).then(res => {
            if (val.length === 9 && res.length === 1) {
              this.number = res[0].phone.slice(4)
              this.userData = {
                id: res[0].id,
                phone: res[0].phone,
                name: res[0].name
              }
              this.send()
            } else if (val.length === 9 && res.length === 0) {
              this.userData = null
              this.send()
            }
          })
        }
        this.send()
      } else {
        this.clear()
        this.send()
      }
    },
    selectCustomer (value, option) {
      this.number = value.slice(4)
      this.isNumber = true
      const k = option.key.split(':')
      if (!this.userData) this.userData = {}
      this.userData.id = k[0]
      this.userData.phone = k[1]
      this.userData.name = k[2]
      this.send()
      this.$emit('change', { value, option })
    },
    validation () {
      if (this.number && this.number.length === 9) return true
      return false
    }
  },
  computed: {
    ...mapGetters(['searchingCustomers', 'loadingSearchingCustomers'])
  },
  mounted () {
    this.$store.commit('GET_SEARCHING_CUSTOMER', [])
  }
}
</script>

<style lang="less" scoped>
.copyBtn {
  height: 100%;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  padding-right: 6px;
  padding-left: 6px;
  transform: translateX(-2px);
  z-index: 3;
}

.ant-select-auto-complete .ant-select .ant-input {
  height: 100%;
  border-left: none !important;
  line-height: 1.5;
  background: transparent;
  border-width: 1px;
}
.defBtn {
  height: 100%;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  z-index: 3;
  transform: translateX(2px);
}
.dropdown {
  margin: 0;
  padding: 0;
}
</style>
