<template>
  <div style="display: flex; width: 100%; height: 32px">
    <a-input :readOnly="isHaveNumber" style="width: 100%" :placeholder="$t('customerName')" v-model="userData.name"></a-input>
    <a-tooltip>
      <template slot="title">
        <span>{{ $t('updateClient') }}</span>
      </template>
      <a-button v-if="isHaveNumber" type="default" @click="openModal" icon="edit" class="copyBtn"/>
    </a-tooltip>
    <a-modal width="500px" v-model="visible" :title="$t('updateClient')">
      <template slot="footer">
        <a-button key="back" @click="cancel">
          {{ $t('cancel') }}
        </a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="changeName">
          {{ $t('save') }}
        </a-button>
      </template>
      <a-row>
        <a-col style="margin-top: 5px" :span="6">{{ $t('customerName') }}:</a-col>
        <a-col :span="18">
          <a-input style="width: 100%" v-model="newName"></a-input>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: undefined,
      default: () => {
        return undefined
      }
    }
  },
  data () {
    return {
      visible: false,
      loading: false,
      newName: '',
      userData: {},
      isHaveNumber: false
    }
  },
  methods: {
    changeName () {
      if (this.newName) {
        this.loading = true
        this.$store.dispatch('customerUpdate', {
          id: this.userData.id,
          data: {
            phone: this.userData.phone,
            name: this.newName
          }
        }).then(res => {
          console.log(res)
          this.userData.name = this.newName
          this.visible = false
          this.$message.success('New name updated')
        })
        .finally(() => {
          this.loading = false
        })
      } else this.$message.error('New name field empty')
    },
    openModal () {
      this.visible = true
    },
    cancel () {
      this.visible = false
      this.newName = ''
    },
    clear () {
      this.visible = false
      this.loading = false
      this.newName = ''
      this.userData = {}
      this.isHaveNumber = false
    },
    validation () {
      if (!this.userData && !this.userData.name) return false
      return true
    }
  }
}
</script>

<style lang="less" scoped>
.copyBtn {
  height:100%;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  padding-right: 5px;
  padding-left: 5px;
  transform: translateX(-2px);
  z-index: 5;
}
</style>
