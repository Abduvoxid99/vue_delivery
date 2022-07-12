<template>
  <a-modal
      :title="$t('leavingComment')"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-textarea :placeholder="$t('leavingComment')" :rows="4" v-model="comment" />
    </a-modal>
</template>

<script>
import request from '@/utils/request'
export default {
  data () {
    return {
      comment: '',
      client_id: '',
      visible: false,
      confirmLoading: false
    }
  },
  methods: {
    showModal (data) {
      this.visible = true
      this.client_id = data.client_id
    },
    handleOk () {
      if (!this.comment) {
        this.$message.warning(this.$t('required_message'))
        return
      }
      const id = JSON.parse(localStorage.getItem('user_id'))
      const data = {
        comment: this.comment,
        creator_id: id,
        customer_id: this.client_id
    }
      this.confirmLoading = true
      request({
        url: '/customer-comment',
        method: 'post',
        data
      })
      .then(() => {
        this.$message.success(this.$t('commentCreated'))
        this.visible = false
      })
      .finally(() => {
        this.confirmLoading = false
      })
    },
    handleCancel () {
      this.visible = false
      this.comment = ''
    }
  }
}
</script>
