<template>
  <a-card>
    <a-form-model :colon="false" ref="ruleForm" :model="form" :rules="rules">
      <a-row type="flex">
        <a-col offset="2" span="16">
          <a-form-model-item ref="name" label="Филиалы" prop="name">
            <a-select @search="fetchBranches" @change="getOneBranch" show-search :filter-option="false">
              <a-select-option
                v-for="item in listItems"
                :value="item.id"
                :key="item.id"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item ref="name" label="Iiko" prop="name">
            <a-select v-model="selectedItem" show-search>
              <a-select-option
                v-for="item in ikkoMenu"
                :value="item.id"
                :key="item.id"
                :disbaled="item.isAttached"
              >{{ item.name }}</a-select-option>
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
      },
      rules: {},
      listItems: [],
      selectedItem: undefined,
      ikkoMenu: []
    }
  },
  methods: {
    getIikoBranch (id) {
      console.log(id)
      this.$store.dispatch('getIikoBranches', id).then(res => {
        console.log(res)
        this.ikkoMenu = res.branches
      })
    },
    patchBranch () {
      const form = { ...this.form, iiko_id: this.selectedItem }
      console.log(form)
      this.$store.dispatch('updateBranch', form).then(res => {
        this.$alertMessage('success', 'Updated', 'Updated successfully', this)
        this.$router.go(-1)
      })
    },
    getOneBranch (e) {
      console.log(e)
      this.getIikoBranch(e)
      this.form = this.listItems.filter(el => el.id === e).length > 0 ? this.listItems.filter(el => el.id === e)[0] : {}
    },
    fetchBranches (e) {
      console.log(e)
      this.getBranchesList({ page: 1, limit: 100, search: e, iiko: true })
    },
    getBranchesList (params) {
      this.$store.dispatch('getBranchesList', params).then((res) => {
        console.log(res)
        this.listItems = res.branches
      })
    },
  },
  created () {
    // this.getIikoBranches()
  },
}
</script>

<style scoped></style>
