<template>
  <a-modal
    v-model="visible"
    :title="$t(isFinished ? 'finishReason' : 'reason')"
    footer=""
    width="900px">
    <a-descriptions bordered>
      <a-descriptions-item :label="$t(isFinished ? 'finishReason' : 'reason')">
        {{ description }}
      </a-descriptions-item>
      <a-descriptions-item :label="$t(isFinished ? 'finishTime' : 'cancelTime')">
        {{ order.status_notes ? order.status_notes[order.status_notes.length - 1].created_at : '' }}
      </a-descriptions-item>
    </a-descriptions>
  </a-modal>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      order: {},
      isFinished: false
    }
  },
  computed: {
    description () {
      const notes = this.order.status_notes
      if (!notes?.length) return '---'
      const length = notes.length
      const description = notes[length - 1].description
      if (this.isFinished) return description.split('Finished reason: ')[1] || '---'
      return description || '---'
      // return order.status_notes ? order.status_notes[order.status_notes.length - 1].description : ''
    }
  },
  methods: {
    show (data, isFinished) {
      this.order = data
      this.visible = true
      this.isFinished = isFinished
    }
  }
}
</script>

<style scoped>

</style>
