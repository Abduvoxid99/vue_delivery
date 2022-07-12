<template>
  <a-card title="Форма тарифа">
       <a-form-model ref="ruleForm" :model="tariff" :rules="chosenType==='percent' ? rules_percent : rules_order" :colon="false">
      <a-row type="flex" :gutter="[16,16]">
          <a-col span="14">
              <label for="item_id">Выберите тип формы</label>
              <a-select id="item_id" style="width: 100%" v-model="chosenType">
                <a-select-option value="percent">Процентов</a-select-option>
                <a-select-option value="order">Заказ</a-select-option>
              </a-select>
            </a-col>
      </a-row>
        <a-row type="flex" class="mb3" :gutter="[16,16]" v-if="chosenType">
            <a-col span="8">
                <a-form-model-item :label="$t('name')" prop="name">
                    <a-input type="text" v-model="tariff.name" placeholder="Название здесь"></a-input>
                </a-form-model-item>
            </a-col>
            <a-col span="8" v-if="chosenType === 'order'">
                <a-form-model-item :label="$t('Сумма')" prop="amount" >
                    <a-input type="number" v-model="tariff.amount" placeholder="Сумма здесь"></a-input>
                </a-form-model-item>
            </a-col>
            <a-col span="8" v-if="chosenType === 'percent'">
                <a-form-model-item :label="$t('День')" prop="day" >
                    <a-input type="number" min="1" max="31" v-model="tariff.day" placeholder="День"></a-input>
                </a-form-model-item>
            </a-col>
            <a-col span="8" v-if="chosenType === 'percent'">
                <a-form-model-item :label="$t('Процент')" prop="percent" >
                    <a-input type="number" min="1" max="100" v-model="tariff.percent" placeholder="Процент здесь"></a-input>
                </a-form-model-item>
            </a-col>
        <a-col span="8">
            <a-form-model-item :label="$t('Выберите статус')" prop="status_ids">
                <a-select allowClear mode="multiple" v-model="tariff.status_ids" default-value="list" style="width: 100%">
                    <a-select-option v-for="item in statusList" :key="item.id" :value="item.id"
                    :disabled="tariff.status_ids.includes('986a0d09-7b4d-4ca9-8567-aa1c6d770505')"> {{ item.label }} </a-select-option>
                </a-select>
            </a-form-model-item>
        </a-col>
        </a-row>
        <a-row class="my-2" type="flex" :gutter="[8,16]" v-if="chosenType">
        <a-col span="auto"><a-button @click="$router.go(-1)" type="outlined">{{ $t('cancel') }}</a-button></a-col>
        <a-col span="auto" v-if="isNew"><a-button :loading="loading" @click="postTariff" type="primary">{{ $t('save') }}</a-button></a-col>
        <a-col span="auto" v-else><a-button :loading="loading" @click="updateTariff" type="primary">{{ $t('update') }}</a-button></a-col>
        </a-row>
       </a-form-model>
  </a-card>
</template>

<script>
export default {
  data () {
    return {
      rules_percent: {
          name: [{ required: true, message: 'Обязательное поле для заполнения', trigger: 'blur' }],
          day: [{ required: true, message: 'Обязательное поле для заполнения', trigger: 'blur' }],
          percent: [{ required: true, message: 'Обязательное поле для заполнения', trigger: 'blur' }],
          status_ids: [{ required: true, type: 'array', message: 'Обязательное поле для заполнения', trigger: 'blur' }]
      },
      rules_order: {
          name: [{ required: true, message: 'Обязательное поле для заполнения', trigger: 'blur' }],
          amount: [{ required: true, message: 'Обязательное поле для заполнения', trigger: 'blur' }],
          status_ids: [{ required: true, type: 'array', message: 'Обязательное поле для заполнения', trigger: 'blur' }]
      },
      id: this.$route.params.id,
      loading: false,
      chosenType: null,
      isNew: true,
      tariff: {
        amount: null,
        day: null,
        name: '',
        percent: null,
        status_ids: [],
      }
    }
  },
  computed: {
      statusList () {
          return this.$store.state.billingTarif.tariffStatuslist
      }
  },
  methods: {
    returnBack () {
        this.$router.replace('/billing/tarifs/list')
    },
    postTariff () {
        console.log('hello world')
        if (!this.$isValid(this)) {
            return
        }
        let temp
        this.loading = true
        if (this.chosenType === 'order') {
            temp = {
                name: this.tariff.name,
                amount: parseInt(this.tariff.amount),
                status_ids: this.tariff.status_ids,
                day: null,
                percent: null
            }
        } else {
            temp = {
                percent: parseInt(this.tariff.percent),
                name: this.tariff.name,
                day: parseInt(this.tariff.day),
                status_ids: this.tariff.status_ids,
                amount: null
            }
        }
        this.$store.dispatch('postBillingTariff', temp).then(res => {
            console.log(res)
            this.returnBack()
        }).finally(() => {
            this.loading = false
        })
    },
    updateTariff () {
        console.log('Hello world edit', this.tariff)
    },
    getTariff (id) {
        this.$store.dispatch('getBillingTariffId', id).then(res => {
            console.log(res)
            this.tariff = res
        })
    }
  },
  created () {
      console.log(this.$route.params.id !== undefined, this.$route.params)
      if (this.$route.params.id !== undefined) {
          this.isNew = false
          this.getTariff(this.$route.params.id)
      }
  }
}
</script>

<style>
</style>
