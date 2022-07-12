<template>
  <h1> hello</h1>
</template>
<script>
export default {
 data () {
   return {
     hello: false
   }
 },
  methods: {
   global () {
     // console.log(e.data)
     // const stringToJSON = JSON.parse(e.data)
     // if (stringToJSON.url) {
     //   console.log('stringToJSON.url ==>>', typeof stringToJSON.url)
     //   const elm = document.createElement('a')
     //   elm.setAttribute(
     //     'href',
     //     `${JSON.stringify(stringToJSON.url)}`
     //   )
     //   elm.setAttribute('download', '')
     //   console.log(elm)
     //   elm.click()
     // } else {
     //   // console.log('hello i else')
     // }
   }
  }
}
</script>
<style scoped>
div{
  color: #0ea2e7;
}
</style>