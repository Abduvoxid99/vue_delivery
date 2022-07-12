<template>
  <a-row>
    <a-col :span="1"></a-col>
    <a-col :span="6">
      <div style="display: flex">
        <a-icon type="shop" style="font-size: 32px; margin-right: 10px" />
        <a-select show-search style="width: 100%" v-model="branch.value" :placeholder="$t('branchName')" @change="selectBranch" option-filter-prop="name" :filter-option="filterOption">
          <a-select-option
            v-for="br in allBranchesList"
            :key="br.id + ':' + br.name + ':' + br.phone + ':' + br.address"
            :value="br.id"
          >
            {{ br.name }} ({{ br.real_time_orders_amount }})
          </a-select-option>
        </a-select>
      </div>
    </a-col>
    <a-col :span="2"></a-col>
    <a-col :span="6">
      <div style="display: flex">
        <a-icon type="environment" style="font-size: 32px; margin-right: 10px" />
        <a-input read-only :placeholder="$t('branch_adress')" v-model="branch.address"/>
      </div>
    </a-col>
    <a-col :span="2"></a-col>
    <a-col :span="6">
      <div style="display: flex">
        <a-icon type="phone" style="font-size: 32px; margin-right: 10px" />
        <a-input read-only v-model="branch.phone" :placeholder="$t('branch_phone')"/>
      </div>
    </a-col>
    <a-col :span="1"></a-col>
  </a-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  props: {
    orderList: {
      type: Object,
      required: true
    },
    distance: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      branch: {
        value: null,
        phone: null,
        address: null,
        name: null
      }
    }
  },
  methods: {
    ...mapActions(['getAllBranches']),
    calcultePrice (data) {
      console.log(data)
      this.$store.dispatch('calcultePrice', data).then(res => {
        console.log(res)
        this.distance.price = res.price
        this.distance.range = res.hasOwnProperty('distance') ? res.distance : null
      })
    },
    selectBranch (e, option) {
      console.log(e)
      this.calcultePrice({ long: this.orderList.coords[1], lat: this.orderList.coords[0], branch_id: e })
      const b = option.key.split(':')
      this.branch.value = b[0]
      this.branch.name = b[1]
      this.branch.phone = b[2]
      this.branch.address = b[3]
      this.$emit('update', {
        value: b[0],
        name: b[1],
        phone: b[2],
        address: b[3]
      })
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    set (data) {
      this.branch = data
    },
    clear () {
      this.branch = {
        value: null,
        phone: null,
        address: null,
        name: null
      }
    }
  },
  watch: {
    branch (e) {
      console.log(e)
    }
  },
  computed: {
    ...mapGetters(['allBranches', 'nearest']),
    allBranchesList () {
      return this.nearest.length ? this.nearest : this.allBranches
    }
  },
  created () {
    this.getAllBranches()
  }
}
</script>

<style lang="less" scoped>
.defBtn {
  height: 100%;
  position: relative;
  z-index: 5;
  text-align: center;
  padding-left: 10px;
  padding-right: 10px;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  transform: translateX(2px);
}
</style>
