<template>
  <a-card>
    <a-form-model :colon="false" ref="ruleForm" :model="form" :rules="rules">
      <a-row type="flex">
        <a-col offset="2" span="16">
          <a-form-model-item ref="name" label="Филиалы" prop="name">
            <a-select @change="getOneBranch" show-search :filter-option="filterOption">
              <a-select-option
                v-for="item in listItems"
                :value="item.iiko_id"
                :key="item.id"
                :disabled="item.iiko_id ? false: true"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item ref="name" label="Выберите терминал" prop="selectedItem">
            <a-select v-model="form.selectedItem">
              <a-select-option
                v-for="item in terminals"
                :value="item.id"
                :key="item.id"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-row type="flex" :gutter="8">
            <a-col span="auto">
              <a-button type="outline" @click="$router.go(-1)">{{ $t("cancel") }}</a-button>
            </a-col>
            <a-col span="auto">
              <a-button type="primary" @click="patchBranch">{{ $t("save") }}</a-button>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-form-model>
  </a-card>
</template>

<script>
export default {
  data () {
    return {
      form: {
        selectedItem: undefined,
      },
      rules: {},
      listItems: [],
      terminals: []
    }
  },
  methods: {
    getIikoTerminal (id) {
      console.log(id)
      this.$store.dispatch('getIikoTerminal', id).then(res => {
        console.log(res)
        this.terminals = res.terminals
      })
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    patchBranch () {
      const _form = { ...this.form }
      _form.iiko_terminal_id = _form.selectedItem
      delete _form.selectedItem
      this.$store.dispatch('updateBranch', _form).then(res => {
        this.$alertMessage('success', 'Updated', 'Updated successfully', this)
        this.$router.go(-1)
      })
    },
    getOneBranch (e) {
      console.log(e)
      this.getIikoTerminal(e)
      this.form = this.listItems.filter(el => el.iiko_id === e).length > 0 ? { ...this.listItems.filter(el => el.iiko_id === e)[0], ...this.form } : {}
    },
    fetchBranches (e) {
      console.log(e)
      this.getBranchesList({ page: 1, limit: 100, search: e, iiko: false })
    },
    getBranchesList (params) {
      this.$store.dispatch('getBranchesList', params).then((res) => {
        console.log(res)
        this.listItems = res.branches.map(el => ({ ...el }))
      })
    },
  },
  mounted () {
    this.getBranchesList({ page: 1, limit: 1000, iiko: false })
  },
  created () {
    // this.getIikoBranches()
  },
}
</script>
