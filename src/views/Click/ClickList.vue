<template>
  <div>
    <a-card title="Click" style="width: 100%">
      <a-button type="primary" slot="extra" @click="()=> { allClick ? editItem() : addItem() }">{{ allClick ? $t('update') : $t('add') }}</a-button>
    </a-card>
    <a-card v-if="allClick" style="width: 100%">
      <a-row style="margin: 0; padding: 0">
        <a-col :span="8">
          <div>
            <img class="click" src="./click.png">
          </div>
        </a-col>
        <a-col :span="14" :offset="2">
          <a-spin :spinning="clickLoad">
            <p><strong>{{ $t('key') }}:</strong> {{ ' ' + allClick.key }}</p>
            <p><strong>{{ $t('merchant_id') }}:</strong> {{ ' ' + allClick.merchant_id }}</p>
            <p><strong>{{ $t('merchant_user_id') }}:</strong> {{ ' ' + allClick.merchant_user_id }}</p>
            <p><strong>{{ $t('service_id') }}:</strong> {{ ' ' + allClick.service_id }}</p>
            <p><strong>{{ $t('createdAt') }}:</strong> {{ ' ' + allClick.created_at }}</p>
            <p><a-button type="danger" :loading="deleting" @click="remove" ghost>{{ $t('delete') }}</a-button></p>
          </a-spin>
        </a-col>
      </a-row>
    </a-card>

    <!-- MODALS -->
    <item-component ref="createItem" :editable="false"/>
    <item-component ref="editItem" :editable="true" :data="allClick"/>
  </div>
</template>
<script>
import createItem from './ClickCreateWithUpdate'
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
    ...mapActions(['getClick', 'deleteClick']),
    editItem () {
      this.$refs.editItem.show(this.allClick)
    },
    addItem () {
      this.$refs.createItem.show()
    },
    remove () {
      this.deleting = true
      this.deleteClick().then(res => {
        this.deleting = false
      })
    }
  },
  computed: {
    ...mapGetters(['allClick', 'clickLoad']),
  },
  mounted () {
    this.getClick()
  }
}
</script>
<style>
.click {
  border-radius: 5px;
  width: 100%;
  box-shadow: 4px 4px 15px #06799a;
}
.click:hover {
  box-shadow: 4px 4px 15px #07aad9;
}
</style>
