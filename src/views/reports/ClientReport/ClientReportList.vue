<template>
<a-card>
  <div slot="title"><strong>{{ $t('clientreport') }}</strong></div>
  <ClientReportTable/>
</a-card>
</template>

<script>
import ClientReportTable from './clientReportTable'
export default {
  components: {
    ClientReportTable
  },
data () {
  return {}
},
  methods: {},
  computed: {},
  mounted () {},
  created () {}
}
</script>

<style scoped>

</style>
