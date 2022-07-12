<template>
  <div>
    <a-card title="Payme" style="width: 100%">
      <a-button type="primary" slot="extra" @click="()=> { allPayme ? editItem() : addItem() }">{{ allPayme ? $t('update') : $t('add') }}</a-button>
    </a-card>
    <a-card v-if="allPayme" style="width: 100%">
      <a-row style="margin: 0; padding: 0">
        <a-col :span="8">
          <div>
            <img class="click" src="./payme.png">
          </div>
        </a-col>
        <a-col :span="14" :offset="2">
          <a-spin :spinning="paymeLoad">
            <p><strong>{{ $t('key') }}:</strong> {{ ' ' + allPayme.key }}</p>
            <p><strong>{{ $t('username') }}:</strong> {{ ' ' + allPayme.login }}</p>
            <p><strong>{{ $t('merchant_id') }}:</strong> {{ ' ' + allPayme.merchant_id }}</p>
            <p><strong>{{ $t('createdAt') }}:</strong> {{ ' ' + allPayme.created_at }}</p>
            <p><a-button type="danger" :loading="deleting" @click="remove" ghost>{{ $t('delete') }}</a-button></p>
          </a-spin>
        </a-col>
      </a-row>
    </a-card>

    <!-- MODALS -->
    <item-component ref="createItem" :editable="false"/>
    <item-component ref="editItem" :editable="true" :data="allPayme"/>
  </div>
</template>
<script>
import createItem from './PaymeCreateWithUpdate'
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    'item-component': createItem
  },
  data () {
    return {
      visible: false,
      loading: false,
      deleting: false
    }
  },
  methods: {
    ...mapActions(['getPayme', 'deletePayme']),
    editItem () {
      this.$refs.editItem.show(this.allPayme)
    },
    addItem () {
      this.$refs.createItem.show()
    },
    remove () {
      this.deleting = true
      this.deletePayme().then(res => {
        this.deleting = false
      })
    }
  },
  computed: {
    ...mapGetters(['allPayme', 'paymeLoad']),
  },
  mounted () {
    this.getPayme()
  }
}
</script>
<style lang="less" scoped>
.click {
  border-radius: 5px;
  width: 100%;
  box-shadow: 2px 2px 15px #02f6dc;
}
.click:hover {
  box-shadow: 4px 4px 15px #07aad9;
}
</style>
