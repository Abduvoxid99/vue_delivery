 <template>
  <div>
    <a-card>
      <a-form-model :colon="false" ref="ruleForm" :model="form" :rules="rules">
        <a-row type="flex">
          <a-col offset="2" :span="16">
            <a-divider orientation="left"> {{ $t('Форма') }}</a-divider>
            <a-tabs type="card">
              <a-tab-pane key="2" tab="Узбекский">
                <a-form-model-item ref="name" label="Описание" prop="message.uz">
                  <a-input
                    spellcheck="false"
                    v-model="form.message.uz"
                    :placeholder="$t('Сообщение здесь')"
                  />
                </a-form-model-item>
              </a-tab-pane>
              <a-tab-pane key="23" tab="Русский">
                <a-form-model-item ref="name" label="Описание" prop="message.ru">
                  <a-input
                    spellcheck="false"
                    v-model="form.message.ru"
                    :placeholder="$t('Сообщение здесь')"
                  />
                </a-form-model-item>
              </a-tab-pane>
            </a-tabs>
            <a-form-model-item ref="name" label="Относится к">
              <a-select style="width: 100%" v-model="form.related_subject">
                <a-select-option value="operator">{{ $t('operator') }}</a-select-option>
                <a-select-option value="courier">{{ $t('courier') }}</a-select-option>
                <a-select-option value="delivery_time">{{ $t('delivery_time') }}</a-select-option>
                <a-select-option value="meal">{{ $t('meal') }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item ref="name" label="Тип" prop="type">
              <a-radio-group v-model="form.type" default-value="like" button-style="solid">
                <a-radio-button value="dislike">Негативный</a-radio-button>
                <a-radio-button value="like"> Позитивный </a-radio-button>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item v-if="!isNewForm" ref="name" label="Статус" prop="active">
              <a-switch v-model="form.active"></a-switch>
            </a-form-model-item>
            <a-row type="flex" justify="end">
              <a-col span="auto">
                <a-button type="grey" @click="$router.go(-1)" style="margin-right: 6px">{{ $t('cancel') }}</a-button>
                <a-button type="primary" :loading="loadingBtn" v-if="isNewForm" @click="postReview">{{
                  $t('add')
                }}</a-button>
                <a-button type="primary" :loading="loadingBtn" v-else @click="updateReview">{{ $t('save') }}</a-button>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-form-model>
    </a-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    isNewForm: true,
    loadingBtn: false,
    form: {
      message: {
        ru: '',
        uz: '',
      },
      type: 'like',
      related_subject: ''
    },
    rules: {},
  }),
  methods: {
    getReview (id) {
      this.$store.dispatch('getReview', id).then((res) => {
        console.log(res)
        this.form = res
      })
    },
    updateReview () {
      this.loadingBtn = true
      const form = { ...this.form }
      this.$store
        .dispatch('updateReview', form)
        .then((res) => {
          console.log(res)
          this.$router.go(-1)
        })
        .finally(() => {
          this.loadingBtn = false
        })
    },
    postReview () {
      this.loadingBtn = true
      const form = { ...this.form }
      this.$store
        .dispatch('postReview', form)
        .then((res) => {
          console.log(res)
          this.$router.go(-1)
        })
        .finally(() => {
          this.loadingBtn = false
        })
    },
  },
  created () {
    if (this.$route.name === 'ReviewContentedit') {
      this.getReview(this.$route.params.id)
      this.isNewForm = false
    } else {
      this.isNewForm = true
    }
  },
}
</script>

<style></style>
