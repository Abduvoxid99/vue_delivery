<template>
  <div>
    <a-card v-action:get title="Список ролей" style="width: 100%">
      <a-form-model-item label="Тип пользователя">
        <a-select style="width: 100%" @change="changeUserTypeRole">
          <a-select-option value="2a1efd4a-d527-4cc2-adfa-a7546021f0f6">
            Пользователь админ панели
          </a-select-option>
          <a-select-option value="195899b2-bd4d-4c51-a09e-c66b9a6bd22a">
            Пользователь филиала
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-button v-action:add type="primary" slot="extra" @click="addRole">{{ $t('add') }}</a-button>
<!--      <a-row style="margin: 10px 0">-->
<!--        <a-col :span="16"></a-col>-->
<!--        <a-col :span="8">-->
<!--          <a-input v-debounce="search" :placeholder="$t('search')" />-->
<!--        </a-col>-->
<!--      </a-row>-->
      <a-table
        :columns="columns"
        :data-source="allRoles"
        :loading="loadRole"
        :rowKey="item => item.id"
        :pagination="paginationRole"
        @change="paginationHandler"
        bordered
      >
        <template slot="action" slot-scope="item">
          <a-tooltip>
            <template slot="title">{{ $t('update') }}</template>
            <a-button v-action:update style="margin: 0 2px" id="buttonUpdate" type="primary" @click="editItem(item)" icon="edit"></a-button>
          </a-tooltip>
          <a-popconfirm
            placement="topRight"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="removeItem(item)"
            :okText="$t(
              'yes')"
            :cancelText="$t('no')"
          >
            <a-tooltip>
              <template slot="title">{{ $t('delete') }}</template>
              <a-button
                v-action:delete
                style="margin: 0 2px"
                type="danger"
                icon="delete"
              ></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>

    <!-- MODALS -->
    <a-modal width="800px" centered v-model="visible" @cancel="hide" :title="isUpdate ? $t('updateRole') : $t('createRole') ">
      <template slot="footer">
        <a-button key="back" @click="hide">{{ $t('cancel') }}</a-button>
        <a-button v-if="!isUpdate" html-type="submit" type="primary" :loading="loading" @click="save">{{ $t('add') }}</a-button>
        <a-button v-if="isUpdate" html-type="submit" type="primary" :loading="loading" @click="update">{{ $t('update') }}</a-button>
      </template>
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-row>
          <a-col :span="11">
            <a-form-model-item :label="$t('name')" prop="name">
              <a-input v-model="form.name" />
            </a-form-model-item>
          </a-col>
          <a-col :span="11" :offset="1">
            <a-form-model-item label="Тип пользователя">
              <a-select style="width: 100%" v-model="form.user_type_id">
                <a-select-option value="2a1efd4a-d527-4cc2-adfa-a7546021f0f6">
                  Пользователь админ панели
                </a-select-option>
                <a-select-option value="195899b2-bd4d-4c51-a09e-c66b9a6bd22a">
                  Пользователь филиала
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-form-model-item :label="$t('accesses')" prop="permession">
          <a-transfer
          :data-source="allActions"
          show-search
          :titles="[$t('allPermission'), $t('customPermission')]"
          :show-select-all="true"
          v-model="transfer"
          :list-style="{
            width: '350px',
            height: '400px',
          }"
          :filter-option="filterOption"
          :target-keys="targetKeys"
          :render="item => item.title"
          @change="handleChange"
          @search="handleSearch"
          @selectChange="selectChange"
        />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { Transfer } from 'ant-design-vue'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    'a-transfer': Transfer
  },
  data () {
    const validateArray = (rule, value, callback) => {
      if (this.targetKeys.length > 0) {
        callback()
      } else {
        callback(new Error('Permession`s List is empty '))
      }
    }
    return {
      roles: [
        {
          name: 'Super Admin',
          key: 1,
          permissions: 3
        },
        {
          name: 'Admin',
          key: 2,
          permissions: 5
        }
      ],
      roleId: null,
      isUpdate: false,
      columns: [
        {
          title: 'Название должности',
          dataIndex: 'name',
        },
        {
          title: this.$t('action'),
          key: 'action',
          align: 'center',
          width: '20%',
          scopedSlots: { customRender: 'action' },
        },
      ],
      transfer: null,
      visible: false,
      loading: false,
      form: {
        name: '',
        user_type_id: '2a1efd4a-d527-4cc2-adfa-a7546021f0f6'
      },
      targetKeys: [],
      rules: {
        name: [{ required: true, message: 'Name required', trigger: 'blur' }],
        description: [{ required: true, message: 'Description required', trigger: 'blur' }],
        permession: [{ validator: validateArray, trigger: 'change' }],
      },
      page: {
        current: 1,
        pageSize: 10,
        total: null,
        search: '',
        user_type_id: null
      }
    }
  },
  computed: {
    ...mapGetters(['paginationRole', 'allRoles', 'loadRole', 'allActions'])
  },
  mounted () {
    this.getRoles(this.page)
    this.getAllActionList()
  },
  watch: {
    page () {
      this.getRoles(this.page)
    }
  },
  methods: {
    ...mapActions(['getRoles', 'getAllActionList', 'postRole', 'postPermission', 'getRolePermissionById', 'updateRole', 'deleteRole']),
    addRole () {
      console.log('Add role')
      this.visible = true
    },
    paginationHandler (page) {
      this.getRoles(page)
    },
    removeItem (item) {
      this.deleteRole(item.id).then(res => {
        this.getRoles(this.page)
        console.log(item)
      })
    },
    clear () {
      this.roleId = null
      this.isUpdate = false
      this.loading = false
      this.targetKeys = []
      this.form.name = ''
      this.form.user_type_id = '2a1efd4a-d527-4cc2-adfa-a7546021f0f6'
      this.$refs.ruleForm.resetFields()
    },
    editItem (item) {
      this.roleId = item.id
      this.isUpdate = true
      this.form.name = item.name
      this.form.user_type_id = item.user_type_id
      this.getRolePermissionById(item.id).then(res => {
        var permissions = []
        for (var i = 0; i < res.permissions.length; i++) {
          for (var j = 0; j < res.permissions[i].actions.length; j++) {
            permissions.push(res.permissions[i].actions[j].id)
          }
        }
        console.log(permissions)
        this.targetKeys = permissions
        this.visible = true
      })
    },
    hide () {
      this.clear()
      this.visible = false
    },
    save () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          var actions = []
          for (var i = 0; i < this.targetKeys.length; i++) {
            for (var j = 0; j < this.allActions.length; j++) {
              if (this.targetKeys[i] === this.allActions[j].key) {
                actions.push(this.allActions[j])
              }
            }
          }
          this.postRole(this.form).then(res => {
            if (res) {
              this.postPermission({
                path: res,
                data: { permissions: Object.values(this.permessionFilter(actions)) }
              }).then(res => {
                this.hide()
                this.getRoles(this.page)
              })
                .catch(error => {
                  console.log(error)
                  this.loading = false
                })
            }
          })
            .catch(error => {
              console.log(error.response.data.error.message)
              // this.$alertMessage('error', 'Created', 'Created data', this)

              this.loading = false
            })
        }
      })
    },
    update () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          var actions = []
          for (var i = 0; i < this.targetKeys.length; i++) {
            for (var j = 0; j < this.allActions.length; j++) {
              if (this.targetKeys[i] === this.allActions[j].key) {
                actions.push(this.allActions[j])
              }
            }
          }
          this.updateRole({
            data: this.form,
            path: this.roleId
          }).then(res => {
              this.postPermission({
                path: this.roleId,
                data: { permissions: Object.values(this.permessionFilter(actions)) }
              }).then(res => {
                this.hide()
                this.getRoles(this.page)
              })
                .catch(error => {
                  console.log(error)
                  this.loading = false
                })
          })
            .catch(error => {
              console.log(error)
              this.loading = false
            })
        }
      })
    },
    filterOption (inputValue, option) {
      // console.log(option.title.indexOf(inputValue))
      return option.title.toLowerCase().trim().startsWith(inputValue.toLowerCase().trim())
    },
    handleChange (targetKeys, direction, moveKeys) {
      console.log(targetKeys, direction, moveKeys)
      this.targetKeys = targetKeys
    },
    permessionFilter (array) {
     return array.reduce((acc, obj) => {
        const id = obj['permession_id']
        const name = obj['permession_name']
        if (!acc[name]) {
          acc[name] = { id: id, 'action_ids': [] }
        }
        acc[name]['action_ids'].push(obj.key)
        acc[name]['id'] = id
        return acc
      }, {})
    },
    handleSearch (dir, value) {
      console.log('search:', dir, value)
    },
    selectChange (selected, targetSelect) {
      console.log(selected, targetSelect)
    },
    changeUserTypeRole (val) {
      this.page.user_type_id = val
      this.getRoles(this.page)
    }
  },
}
</script>

<style scoped>

</style>
