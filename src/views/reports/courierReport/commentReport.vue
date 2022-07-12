<template>
  <div class="maindiv">
    <a-card class="maindiv">
      <a-card :bordered="false">
        <div slot="title">
          <a-form-model :rules="rules" :model="params" ref="ruleForm">
            <a-row>
              <a-col :xm="24" :md="5">
                <a-range-picker
                  :default-value="[params.from_date, params.to_date]"
                  allowClear
                  @change="onChangeFromDate"
                  style="margin-top: 5px"
                  :placeholder="['От даты', 'До даты']"
                >
                </a-range-picker>
              </a-col>
              <a-col :xm="24" :md="3" class="margenLeftTime">
                <a-form-model-item ref="from_time" prop="from_time">
                  <a-time-picker
                    v-model="params.from_time"
                    @change="onTimePickerForm"
                    :open.sync="open1"
                    placeholder="От времени"
                    valueFormat="hh:mm:ss"
                  >
                    <!-- <a-button slot="addon" size="small" type="primary" @click="handleClose">
                      Ok
                    </a-button> -->
                  </a-time-picker>
                </a-form-model-item>
              </a-col>
              <a-col :xm="24" :md="4" class="margenLeftTime">
                <a-form-model-item size="large" ref="to_time" prop="to_time">
                  <a-time-picker
                    v-model="params.to_time"
                    @change="onTimePicerTo"
                    :open.sync="open2"
                    placeholder="До времени"
                    valueFormat="hh:mm:ss"
                  >
                    <!-- <a-button slot="addon" size="small" type="primary" @click="handleClose">
                      Ok
                    </a-button> -->
                  </a-time-picker>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
        <div slot="extra">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ $t('courierReport') }}</span>
            </template>
            <a-button @click="downloadExcel">
              <a-icon type="download" style="color: blue; font-size: 1.1rem; background-color: "></a-icon
            ></a-button>
          </a-tooltip>
        </div>
        <div>
          <template>
             <a-table
              :columns="columns"
              :data-source="courierList"
              :rowKey="item => item.courier_id"
              bordered
              :loading="loading"
              size="middle"
              :pagination="pagination"
            >
             <template slot="full_name" slot-scope="item">
                <span>{{ item.first_name + ' ' + item.last_name }}</span>
              </template>
              <template slot="like" slot-scope="item">
                <h1>{{ item.likes_amount }} / {{ item.like_percent }} %</h1>
              </template>
              <template slot="dislike" slot-scope="item">
                <h1>{{ item.dislikes_amount }} / {{ item.dislike_percent }} %</h1>
              </template>
               <template slot="all_dislikes_amount" slot-scope="item">
                <span>{{ item.all_dislikes_amount }}</span>
              </template>
               <template slot="all_likes_amount" slot-scope="item">
                <span>{{ item.all_likes_amount }}</span>
              </template>
                <template slot="comments_amount" slot-scope="item">
                <span>{{ item.all_likes_amount + item.all_dislikes_amount }}</span>
              </template>
            </a-table>
          </template>
        </div>
      </a-card>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
// import { jsontoexcel } from 'vue-table-to-excel'
import { notification } from 'ant-design-vue'
export default {
  data () {
    return {
      filayalId: '',
      current: ['mail'],
      newarray: [],
      buttonLoading: false,
      dislikes_percent: '',
      likes_percent: '',
      likes_amount: '',
      dislikes_amount: '',
      open2: false,
      open1: false,
      total_distance: false,
      data: false,
      minTime: false,
      orders_price: false,
      avg_time: false,
      attendance_time: false,
      avg_distance: false,
      order_count: false,
      total_time: false,
      title: true,
      pagination: {},
      todaytime: moment(Date.now()).format('hh:mm:ss'),
      params: {
        // page: { current: 1, pageSiz: 10, totle: null },
        end_date: moment().format('YYYY-MM-DD'),
        start_date: this.format(),
        from_time: '',
        to_time: ''
      },
      loading: false,
      rules: {
        to_time: [{ required: true, message: 'Пожалуйста, заполните это поле', trigger: 'change' }],
        from_time: [{ required: true, message: 'Пожалуйста, заполните это поле', trigger: 'change' }]
      },
      courierReportList: [],
      courierList: [],
      columns: [
        {
          title: this.$t('fullnamecourier'),
          align: 'center',
          scopedSlots: { customRender: 'full_name' }
        },
        {
          title: this.$t('Количество заказов'),
          align: 'center',
          dataIndex: 'delivery_amount'
        },
         {
          title: this.$t('Количество отзывов'),
          align: 'center',
          scopedSlots: { customRender: 'comments_amount' }
        },
         {
          title: this.$t('Количество лайков'),
          align: 'center',
          scopedSlots: { customRender: 'all_likes_amount' }
        },
        {
          title: this.$t('Количество дизлайков'),
          align: 'center',
          scopedSlots: { customRender: 'all_dislikes_amount' }
        },
        {
          title: this.$t('Лайк курьера'),
          align: 'center',
          scopedSlots: { customRender: 'like' }
        },
        {
          title: this.$t('Дизлайк курьера'),
          align: 'center',
          scopedSlots: { customRender: 'dislike' }
        },
      ]
    }
  },
  methods: {
    getCouriersList () {
      this.loading = true
      this.$store.dispatch('getCourierReview', this.params)
        .then(res => {
          console.log(res)
          this.courierList = res.courier_review_reports
        }).finally(() => {
          this.loading = false
      })
    },

    customRowClik (record) {
      let data
      record.date === 'Итого' ? data = {
          fromData: this.params.from_time ? this.params.from_date + ' ' + this.params.from_time : this.params.from_date + ' 05:00:00',
          toDate: this.params.to_time ? this.params.to_date + ' ' + this.params.to_time : moment(this.params.to_date).add('days', 1).format('YYYY-MM-DD') + ' 05:00:00',
          courier_id: this.params.courier_id
        }
       : data = {
          fromData: this.params.from_time ? record.date + ' ' + this.params.from_time : `${record.date} '05:00:00'`,
          toDate: this.params.to_time ? moment(record.date).add('days', 1).format('YYYY-MM-DD') + ' ' + this.params.to_time : moment(record.date).add('days', 1).format('YYYY-MM-DD') + ' ' + '05:00:00',
          courier_id: this.params.courier_id
        }
      // console.log('data.FromData =>>>', data.toDate, data.fromData)

      return {
        on: {
          click: event => {
            this.$router.push({
              name: 'OrderReport',
              query: { start_date: data.fromData, end_date: data.toDate, courier_id: data.courier_id, delivery_type: 'delivery', activTab: '4' }
            })
          }
        }
      }
    },
    downloadExcel () {
      this.buttonLoading = true
      this.$store.dispatch('getCourierReportExcel', { to_date: this.params.end_date, from_date: this.params.start_date })
        .then(res => {
          console.log(res)
          notification.success({
            message: this.$t('Отчет по курьерам Excel файл готов'),
          })
          const elm = document.createElement('a')
          elm.setAttribute(
            'href',
            `${ res.url }`)
          elm.setAttribute('download', 'opratro')
          elm.click()
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.buttonLoading = false
        })
    },
    onSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.getCourietRepoartItem()
        } else {
          this.loading = false
          return false
        }
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    },
    format () {
      const dateFrom = moment()
        .subtract(5, 'd')
        .format('YYYY-MM-DD')
      return dateFrom
    },
    moment,
    onTableChange (pagination) {
      this.loading = true
      console.log(pagination)
      this.params.page.current = pagination.current
      this.getReports()
    },
    onTimePicerTo (value, pageTime) {
      console.log(value)
      this.params.to_time = pageTime
      // eslint-disable-next-line no-unused-expressions
      this.params.from_time === '' ? '' : this.params.from_time
      this.onSubmit()
    },
    onTimePickerForm (value, pageTime) {
      this.params.from_time = pageTime
      console.log(value)
      // eslint-disable-next-line no-unused-expressions
      this.params.to_time ?? this.params.to_time
      this.onSubmit()
    },
    onChangeFromDate (value, dateString) {
      this.newarrayDate = dateString
      this.params.start_date = dateString[0].length ? dateString[0] : this.format()
      this.params.end_date = dateString[1].length ? dateString[1] : moment().format('YYYY-MM-DD')
      this.getCouriersList(this.params)
      // this.getReports()
      // this.AlldataCourierGet()
    }
    // onOk (value) {
    //   console.log('onOk: ', value)
    // },
  },
  created () {
    this.getCouriersList()
  }
}
</script>

<style scoped>
.classpointer {
  cursor: pointer;
}
.maindiv {
  border-radius: 9px;
}
.margenLeft {
  margin-left: 15px;
}
.margenLeftTime {
  margin-left: 20px;
}
.margenLeftTimes {
  margin-left: -20px;
  margin-top: 3px;
}
.hovers:hover {
  color: #f5222d;
}
</style>
