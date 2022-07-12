import Vue from 'vue'
// import storage from 'store'
// import notification from 'ant-design-vue/es/notification'
// import { ACCESS_TOKEN } from '@/store/mutation-types'
// const token = storage.get(ACCESS_TOKEN)

const pluginGloval = {
  install (Vue, options) {
    Vue.prototype.$date = data => {
      return new Date(data)
    }

    Vue.prototype.$phoneFormatter = (str) => {
      // Filter only numbers from the inpu
      if (!str) return
      if (str.length !== 13) return str
      const num = str.substring(0, 6) +
        ' ' + str.substring(6, 9) +
        ' ' + str.substring(9, 11) +
        ' ' + str.substring(11, 13)
      return num
    }

    Vue.prototype.$moneyFormat = str => {
      return str.replace(/(?=(\d{3})+(?!\d))/g, ' ')
    }

    Vue.prototype.$filterOption = (input, option) => {
        return (option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0)
    }

    Vue.prototype.$isValid = (t) => {
      let flag = null
      t.$refs.ruleForm.validate(valid => {
        if (valid) {
          flag = true
          return true
        } else {
          flag = false
          console.log('error submit!!')
          return false
        }
      })
      return flag
    }

    Vue.prototype.$isNumber = (evt) => {
      console.log(evt)
        evt = (evt) || window.event
        var charCode = (evt.which) ? evt.which : evt.keyCode
        if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
          evt.preventDefault()
        } else {
          return true
        }
    }

    Vue.prototype.$getBase64 = file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
    }

    Vue.prototype.$alertMessage = (type = 'success', title = '', desc = '', t) => {
        t.$notification[type]({
          message: t.$t(title),
          description: t.$t(desc),
          duration: 2
        })
    }

    Vue.prototype.$deleteFromList = (arr, id) => {
      arr.splice(arr.findIndex(el => el.id === id), 1)
    }

    Vue.prototype.$isNewForm = (params) => {
      if (Object.keys(params).length === 0 && params.constructor === Object) {
        return true
      } else return false
    }

    Vue.prototype.$uploadImage = async (file, fileList, t) => {
      const formData = new FormData()
      formData.append('file', file)
      const url = await t.$getBase64(file)
      t.$store.dispatch('uploadFile', formData).then(res => {
        console.log(res)
        fileList.push({
          uid: res.filename,
          name: res.filename,
          status: 'done',
          url: url
        })
        console.log(fileList)
      }).catch(err => console.log(err))
    }

    Vue.prototype.$truncate = (text, length, clamp) => {
      clamp = clamp || '...'
      return text.length > length ? text.slice(0, length) + clamp : text
    }

    Vue.prototype.$getRandomColor = () => {
      var letters = '0123456789ABCDEF'
      var color = '#'
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
      }
      return color
    }
  }
}

Vue.use(pluginGloval)
