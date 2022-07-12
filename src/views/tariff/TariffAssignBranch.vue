<template>
  <a-modal width="400px" centered v-model="visible" @cancel="hide" :title="$t('assign_branch')">
    <template slot="footer">
      <a-button key="back" @click="hide">{{ $t('cancel') }}</a-button>
      <a-button type="primary" :loading="loading" @click="assignBranch">{{ $t('save') }}</a-button>
    </template>
    <a-select
      mode="multiple"
      v-model="assigned"
      style="width: 100%"
      @change="changeAssigned"
    >
      <a-select-option v-for="br in fareBranch" :key="br.id" :value="br.id" :disabled="disableSelectOptions(br)">
        {{ br.name }}
      </a-select-option>
    </a-select>
  </a-modal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  // eslint-disable-next-line
  props: ['params'],
  data () {
    return {
      loading: false,
      visible: false,
      fare: { },
      assigned: [],
      id: null,
      fare_branches: [],
    }
  },
  watch: {
    assigned (val) {
      console.log(val)
    }
  },
  computed: {
    ...mapGetters(['fareBranch', 'allBranches']),
    // filteredFareBranches () {
    //   return this.fareBranch.map (e => {
    //     return {
    //       disabled: e.has_fare,
    //     }
    //   })
    // }
    // filteredBranches () {
    //   let a = []
    //   for (let i = 0; i < this.fareBranch.length; i++) {
    //     for (let j = 0; j < this.allBranches.length; j++) {
    //       if (this.fareBranch[i].id === this.allBranches[j].id) return
    //     }
    //   }
    // }
  },
  methods: {
    ...mapActions(['assignBranchTariff', 'getAllTariff', 'getBranchNoFare']),
    hide () {
      this.visible = false
    },
    changeAssigned () {
      this.getBranchNoFare()
    },
    async show (data) {
      this.fare = data
      console.log(data)
      await this.getBranchNoFare()

      this.id = data.id
      this.visible = true
    },
    assignBranch () {
      this.assignBranchTariff({
        id: this.id,
        branch_ids: this.assigned
      }).then(res => {
        this.visible = false
        this.getAllTariff(this.params)
      })
      console.log('assign')
    },
    disableSelectOptions (br) {
      const fare = this.fare
      const hasFare = br.has_fare
      const isThisFare = !!(fare.branches && fare.branches.filter(b => b.id === br.id).length)

      // console.log(br.name)
      // console.log('hasFare', hasFare)
      // console.log('isThisFare', isThisFare)
      return !!(hasFare ^ isThisFare)
    }
  }
}
</script>

<style scoped>

</style>
