<template>
  <a-card>
    <a-tabs v-model="currentTab" @change="handleTabChange" type="card">
      <a-tab-pane :tab="$t('clients')" :key="'1'" type="card">
          <Clients :postSms="postSms" />
      </a-tab-pane>
      <a-tab-pane :tab="$t('couriers')" :key="'12'" type="card">
          <div><CourierList :postSms="postSms"/></div>
      </a-tab-pane>
      <!-- <a-tab-pane :tab="$t('operators')" :key="'128'" type="card">
          <div>hello world</div>
      </a-tab-pane> -->
    </a-tabs>
  </a-card>
</template>

<script>
import CourierList from './components/Couriers.vue'
import Clients from './components/Clients.vue'

export default {
    components: {
        CourierList,
        Clients
    },
    data () {
        return {
            currentTab: '1',
        }
    },
    methods: {
        handleTabChange (e) {
            console.log(e)
        },
        postSms (item = {}, t) {
            console.log(item)
            t.buttonLoading = true
            this.$store.dispatch('postSms', item).then(res => {
                console.log(res)
                this.$notification.success({
                message: 'SMS sent successfully'
                })
                t.phoneNumbers = []
                t.form = {}
                t.visible = false
            }).catch(err => {
                console.log(err)
            }).finally(el => {
                console.log(el)
                t.buttonLoading = false
            })
        }
    }
}
</script>

<style>

</style>
