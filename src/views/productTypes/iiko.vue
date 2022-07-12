<template>
  <a-card>
      <a-row justify="start" type="flex">
          <a-col span="24">
            <a-tabs default-active-key="1" v-model="selectedTab" @change="onSelectedTab">
                <a-tab-pane key="#credentials" tab="Полномочия" force-render>
                    <Credentials />
                </a-tab-pane>
                <a-tab-pane key="#branchlist" tab="Филиалы" force-render>
                    <Branchlist />
                </a-tab-pane>
                <a-tab-pane key="#product" tab="Товары" force-render>
                    <ProductsList />
                </a-tab-pane>
                <a-tab-pane key="#terminal" tab="Терминал" force-render>
                    <TerminalsList />
                </a-tab-pane>
            </a-tabs>
          </a-col>
      </a-row>
  </a-card>
</template>
<script>
import Credentials from './Tabs/Credentials'
import TerminalsList from './Tabs/TerminalsList'
import ProductsList from './Tabs/ProductsList'
import Branchlist from './Tabs/BranchesList'

export default {
    data () {
        return {
            list: [],
            selectedTab: false || '#credentials'
        }
    },
    components: {
        Credentials,
        Branchlist,
        ProductsList,
        TerminalsList
    },
    methods: {
        onSelectedTab (e) {
            console.log(e)
            this.$router.replace({ hash: e }).catch(() => {})
        },
        getConsole () {
            console.log('asdasd')
        }
    },
    created () {
        this.selectedTab = this.$route.hash ? this.$route.hash : '#credentials'
        console.log(this.$route.hash)
    }

}
</script>

<style scoped>

</style>
