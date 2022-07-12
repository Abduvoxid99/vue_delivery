<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
</template>

<script>
import { domTitle, setDocumentTitle } from '@/utils/domUtil'
// import { mapActions } from 'vuex'
import { i18nRender } from '@/locales'
import firebaseInitialize from './firebase'
export default {
  data () {
    return {
    }
  },
  created () {
    const shId = localStorage.getItem('shipper_id').split('"').join('').trim()
    console.log('shipper', shId ?? '--')
    if (shId) {
      firebaseInitialize(shId)
    }
  },
  computed: {
    locale () {
      const { title } = this.$route.meta
      title && (setDocumentTitle(`${i18nRender(title)} - ${domTitle}`))
      return this.$i18n.getLocaleMessage(this.$store.getters.lang).antLocale
    }
  },
  // methods: {
  //   ...mapActions(['connectSocket'])
  // },
  // created () {
  //   this.connectSocket()
  // },
}
</script>

<style>
  .truncate {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ant-table-tbody > tr.table-row-yellow {
   background-color: yellow;
  }
  .ant-table-tbody > tr.table-row-red {
    background-color: red;
  }
  .ant-table-tbody > tr.table-row-skyblue {
    background-color: skyblue;
  }
  .ant-table-tbody > tr.table-row-green {
    background-color: green;
  }
  .ant-table-tbody > tr.table-row-burlywood {
    background-color: burlywood;
  }

  .ant-table-tbody > tr.table-row-yellow.ant-table-row:hover > td {
    background: none !important;
  }
  .ant-table-tbody > tr.table-row-red.ant-table-row:hover > td {
    background: none !important;
  }
  .ant-table-tbody > tr.table-row-skyblue.ant-table-row:hover > td {
    background: none !important;
  }
  .ant-table-tbody > tr.table-row-green.ant-table-row:hover > td {
    background: none !important;
  }
  .ant-table-tbody > tr.table-row-burlywood.ant-table-row:hover > td {
    background: none !important;
  }
</style>
