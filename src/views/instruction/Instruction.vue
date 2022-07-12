<template>
  <a-card>
    <a-divider orientation="left">
      {{ $route.query.guid }} <span style="margin: 0 10px"> >> </span> {{ $route.query.name }}
    </a-divider>
    <div v-html="content"></div>
  </a-card>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      content: null
    }
  },
  methods: {
    ...mapActions(['getInstruction'])
  },
  mounted () {
    this.getInstruction({
      guid: this.$route.params.guid,
      insid: this.$route.params.insid
    }).then(res => {
      this.content = res.body.uz
      console.log(res)
    })
  }
}
</script>

<style scoped>

</style>
