<template>
  <a-card>
      <a-row justify="start" type="flex">
          <a-col span="24">
            <a-tabs v-model="selectedTab" default-active-key="#branches" @change="onTabChanged">
                <a-tab-pane key="#credentials" tab="Полномочия" force-render>
                    <Credentials />
                </a-tab-pane>
                <a-tab-pane key="#branches" tab="Филиалы" force-render>
                    <BranchesList />
                </a-tab-pane>
                <a-tab-pane key="#products" tab="Товары" force-render>
                    <ProductsList />
                </a-tab-pane>
            </a-tabs>
          </a-col>
      </a-row>
  </a-card>
</template>
<script>
import Credentials from './Tabs_jowi/Credentials'
import ProductsList from './Tabs_jowi/ProductsList'
import BranchesList from './Tabs_jowi/BranchesList'

export default {
    data () {
        return {
            list: [],
            selectedTab: '#branches',
        }
    },
    components: {
        Credentials,
        ProductsList,
        BranchesList
    },
    methods: {
        onTabChanged (e) {
            this.$router.replace({ hash: e })
        },
        getConsole () {
            console.log('asdasd')
        }
    },
    created () {
        this.selectedTab = this.$route.hash || '#branches'
    }

}
</script>

<style scoped>

</style>
