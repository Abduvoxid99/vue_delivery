<template>
  <a-card :title="$t('reviewReport')">
    <a-tabs @change="callback" :active-key="active">
      <a-range-picker allow-clear slot="tabBarExtraContent" separator=" - " :placeholder="['Дата начала', 'Дата окончания']" valueFormat="YYYY-MM-DD" format="YYYY-MM-DD" @change="filterDate" style="width: 100%"/>
      <a-tab-pane key="1" :tab="$t('branches')">
        <a-table
          :columns="columns"
          :data-source="dataTable"
          :rowKey="item => item.id"
          bordered
          :loading="loading"
          size="middle"
          :pagination="false"
          :scroll="{ y: 400 }"
        >
          <template slot="like_dislike" slot-scope="item">
            <h1><strong>{{ item.count }}</strong> / {{ item.percent }} %</h1>
          </template>
        </a-table>
      </a-tab-pane>
      <a-tab-pane key="2" :tab="$t('operators')">
        <a-table
          :columns="columnsOperator"
          :data-source="operatorTable"
          :rowKey="item => item.id"
          bordered
          :loading="loading"
          size="middle"
          :pagination="false"
          :scroll="{ y: 400 }"
        >
          <template slot="like_dislike" slot-scope="item">
            <h1><strong>{{ item.count }}</strong> / {{ item.percent }} %</h1>
          </template>
        </a-table>
      </a-tab-pane>
      <a-tab-pane key="3" tab="Отзывы пользователей">
        <a-card title="Отзывы пользователей">
          <div slot="extra" style="display: flex">
            <a-radio-group style="margin-right: 10px" button-style="solid" v-model="customReviewType">
              <a-radio-button value="dislike">Негативный ({{ customDislikeCount }})</a-radio-button>
              <a-radio-button value="like"> Позитивный ({{ customLikeCount }})</a-radio-button>
            </a-radio-group>
            <a-button style="float: right" slot="extra" type="primary" icon="file-excel" @click="onClickReport">{{ $t('exportExcel') }}</a-button>
          </div>
          <div style="margin-bottom: 20px">
            <a-row type="flex" align="middle">
              <a-col :md="12" :lg="8">
                <span>
                  {{ $t('branch') }}:
                </span>
                <a-select
                  style="width: 100%; max-width: 200px;"
                  allowClear
                  @search="onSearch($event, 'branch')"
                  @popupScroll="onScrollBottom($event, 'branch')"
                  :placeholder="$t('branch')"
                  @change="handleChange($event, 'branch')"
                  :disbled="loading"
                  :value="filter[keyOfFilter].branch_id"
                >
                  <a-select-option
                    v-for="r in branchList"
                    :key="r.id"
                    :value="r.id"
                  >
                    {{ r.name }}
                  </a-select-option>
                  <a-select-option key="fetching" v-if="filter[keyOfFilter].branchParams.total > branchList.length || fetching">
                      <a-spin slot="notFoundContent" size="small" />
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :md="12" :lg="8">
                <span>
                  {{ $t('courier') }}:
                </span>
                <a-select
                  style="width: 100%; max-width: 200px;"
                  @search="onSearch($event, 'courier')"
                  allowClear
                  @popupScroll="onScrollBottom($event, 'courier')"
                  :placeholder="$t('courier')"
                  @change="handleChange($event, 'courier')"
                  :disbled="loading"
                  :value="filter[keyOfFilter].courier_id"
                >
                  <a-select-option
                    v-for="r in courierList"
                    :key="r.id"
                    :value="r.id"
                  >
                    {{ r.first_name }} {{ r.last_name }}
                  </a-select-option>
                  <a-select-option key="fetching" v-if="filter[keyOfFilter].courierParams.total > courierList.length || fetching">
                      <a-spin slot="notFoundContent" size="small" />
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
          </div>
          <a-table v-if="customReviewType === 'like'"
            :columns="columnsCustom"
            :data-source="customTableLike"
            :rowKey="item => item.id"
            bordered
            :loading="loading"
            size="middle"
            :pagination="false"
            :scroll="{ y: 400 }"
          />
          <a-table v-if="customReviewType === 'dislike'"
            :columns="columnsCustom"
            :data-source="customTableDislike"
            :rowKey="item => item.id"
            bordered
            :loading="loading"
            size="middle"
            :pagination="false"
          />
        </a-card>
      </a-tab-pane>
      <a-tab-pane key="4" tab="Статистика">
        <a-card title="Статистика">
          <div style="margin-bottom: 20px">
            <a-row type="flex" align="middle">
              <a-col :md="12" :lg="8">
                <span>
                  {{ $t('branch') }}:
                </span>
                <a-select
                  style="width: 100%; max-width: 200px;"
                  allowClear
                  @search="onSearch($event, 'branch')"
                  @popupScroll="onScrollBottom($event, 'branch')"
                  :placeholder="$t('branch')"
                  @change="handleChange($event, 'branch')"
                  :disbled="loading"
                  :value="filter[keyOfFilter].branch_id"
                >
                  <a-select-option
                    v-for="r in branchList"
                    :key="r.id"
                    :value="r.id"
                  >
                    {{ r.name }}
                  </a-select-option>
                  <a-select-option key="fetching" v-if="filter[keyOfFilter].branchParams.total > branchList.length || fetching">
                      <a-spin slot="notFoundContent" size="small" />
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :md="12" :lg="8">
                <span>
                  {{ $t('courier') }}:
                </span>
                <a-select
                  style="width: 100%; max-width: 200px;"
                  @search="onSearch($event, 'courier')"
                  allowClear
                  @popupScroll="onScrollBottom($event, 'courier')"
                  :placeholder="$t('courier')"
                  @change="handleChange($event, 'courier')"
                  :disbled="loading"
                  :value="filter[keyOfFilter].courier_id"
                >
                  <a-select-option
                    v-for="r in courierList"
                    :key="r.id"
                    :value="r.id"
                  >
                    {{ r.first_name }} {{ r.last_name }}
                  </a-select-option>
                  <a-select-option key="fetching" v-if="filter[keyOfFilter].courierParams.total > courierList.length || fetching">
                      <a-spin slot="notFoundContent" size="small" />
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
          </div>
          <a-table
            :columns="columnsReviews"
            :data-source="reportsReviews"
            :rowKey="item => item.id"
            bordered
            :loading="loading"
            size="middle"
            :pagination="false"
            :scroll="{ y: 400 }"
          >
            <template slot="subject" slot-scope="subject_name">
              <h1>{{ $t(`${subject_name}`) }}</h1>
            </template>
            <template slot="like_dislike" slot-scope="item">
              <h1><strong>{{ item.count }}</strong> / {{ item.percent }} %</h1>
            </template>
          </a-table>
        </a-card>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import debounce from 'lodash/debounce'
import request from '@/utils/request'
export default {
  data () {
    this.onSearch = debounce(this.onSearch, 400)
    this.branchGetAll = debounce(this.branchGetAll, 100)
    this.courierGetAll = debounce(this.courierGetAll, 100)
    return {
      reportsReviews: [],
      dateFormat: 'YYYY-MM-DD',
      filter: {
        3: {
          branch_id: undefined,
          courier_id: undefined,
          dateDay: '',
          branchParams: {
            limit: 10,
            page: 1,
            search: ''
          },
          courierParams: {
            limit: 10,
            page: 1,
            search: ''
          }
        },
        4: {
          branch_id: undefined,
          courier_id: undefined,
          dateDay: '',
          branchParams: {
            limit: 10,
            page: 1,
            search: ''
          },
          courierParams: {
            limit: 10,
            page: 1,
            search: ''
          }
        }
      },
      branchList: [],
      courierList: [],
      fetching: false,
      dataTable: [],
      operatorTable: [],
      customTableLike: [],
      customTableDislike: [],
      customReviewType: 'like',
      customLikeCount: '',
      customDislikeCount: '',
      active: '1',
      loading: false,
      columnsOperator: [
        {
          title: this.$t('branches'),
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: this.$t('couriers'),
          children: [
            {
              title: '👍',
              align: 'center',
              dataIndex: 'type_reports[0]',
              scopedSlots: { customRender: 'like_dislike' }
            },
            {
              title: '👎',
              align: 'center',
              dataIndex: 'type_reports[1]',
              scopedSlots: { customRender: 'like_dislike' }
            }
          ]
        }
      ],
      columnsReviews: [
        {
          title: this.$t('Тип'),
          align: 'center',
          dataIndex: 'subject_name',
          scopedSlots: { customRender: 'subject' }
        },
        {
              title: '👍',
              align: 'center',
              dataIndex: 'type_reports[0]',
              scopedSlots: { customRender: 'like_dislike' }
            },
            {
              title: '👎',
              align: 'center',
              dataIndex: 'type_reports[1]',
              scopedSlots: { customRender: 'like_dislike' }
            }
      ],
      columnsCustom: [
        {
          title: this.$t('orderNumber'),
          // align: 'center',
          dataIndex: 'order_num'
        },
        {
          title: this.$t('branches'),
          // align: 'center',
          dataIndex: 'branch_name'
        },
        {
          title: this.$t('couriers'),
          dataIndex: 'courier_name'
        },
        {
          title: 'Время доставки',
          dataIndex: 'delivery_time'
        },
        {
          title: this.$t('operators'),
          dataIndex: 'operator_name'
        },
        {
          title: this.$t('client'),
          dataIndex: 'client_name'
        },
        {
          title: this.$t('review_message'),
          dataIndex: 'review_message',
          width: '40%'
        }
      ],
      columns: [
        {
          title: this.$t('branches'),
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: this.$t('couriers'),
          children: [
            {
              title: '👍' + this.active,
              align: 'center',
              dataIndex: 'related_subjects[0].type_reports[0]',
              scopedSlots: { customRender: 'like_dislike' }
            },
            {
              title: '👎',
              align: 'center',
              dataIndex: 'related_subjects[0].type_reports[1]',
              scopedSlots: { customRender: 'like_dislike' }
            }
          ]
        },
        {
          title: 'Время доставки',
          children: [
            {
              title: '👍',
              align: 'center',
              dataIndex: 'related_subjects[1].type_reports[0]',
              scopedSlots: { customRender: 'like_dislike' },
            },
            {
              title: '👎',
              align: 'center',
              dataIndex: 'related_subjects[1].type_reports[1]',
              scopedSlots: { customRender: 'like_dislike' }
            }
          ]
        },
        {
          title: 'Eда',
          children: [
            {
              title: '👍',
              align: 'center',
              dataIndex: 'related_subjects[2].type_reports[0]',
              scopedSlots: { customRender: 'like_dislike' }
            },
            {
              title: '👎',
              align: 'center',
              dataIndex: 'related_subjects[2].type_reports[1]',
              scopedSlots: { customRender: 'like_dislike' }
            }
          ]
        }
      ],
      params: {
        start_date: null,
        end_date: null
      }
    }
  },
  mounted () {
    this.getBranchReview()
    this.branchGetAll()
    this.courierGetAll()
  },
  computed: {
    keyOfFilter () {
      return ['3', '4'].includes(this.active) ? this.active : '3'
    }
  },
  watch: {
    active (val) {
      if (val === '1') this.getBranchReview()
      if (val === '2') this.getOperatorReview()
      if (val === '3') this.getCustomReview()
      if (val === '4') this.getReportReviews()
    }
  },
  methods: {
    onClickReport () {
      if (this.params.start_date || this.params.end_date) {
        request({
          url: '/reports/reviews-excel',
          method: 'get',
          params: {
            ...this.params,
            branch_id: this.filter[this.active].branch_id,
            courier_id: this.filter[this.active].courier_id
          }
        })
        .then((response) => {
          console.log(response)
          var link = document.createElement('a')
          link.href = response.file
          document.body.appendChild(link)
          link.click()
        })
      } else {
        this.$message.error('Дата не указана')
      }
    },
    handleChange (value, type) {
      console.log(value, type, this.active)
        if (type === 'branch' && this.active == '3') {
          this.filter[this.active].branch_id = value
          this.getCustomReview()
        } else if (type === 'courier' && this.active == '3') {
          this.filter[this.active].courier_id = value
          this.getCustomReview()
        } else if (type === 'branch' && this.active == '4') {
          this.filter[this.active].branch_id = value
          this.getReportReviews()
        } else if (type === 'courier' && this.active == '4') {
          this.filter[this.active].courier_id = value
          this.getReportReviews()
        }
    },
    onSearch (value, type) {
      console.log(value, type)
      this.fetching = true
      this[`${type}List`] = []
      this[`filter[${this.active}].${type}Params`] = { search: value, limit: 10, page: 1 }
      this[`filter[${this.active}].${type}GetAll`]()
    },
    onScrollBottom (event, type) {
      var target = event.target
      if (!this.fetching && target.scrollTop + target.offsetHeight === target.scrollHeight) {
        if (this[`filter[${this.active}].${type}Params`].total > this[`${type}List`].length) {
          this[`filter[${this.active}].${type}Params`].page += 1
          target.scrollTo(0, target.scrollHeight)
          this[`filter[${this.active}].${type}GetAll`]()
        }
      }
    },
    branchGetAll () {
      this.fetching = true
      this.$store.dispatch('getBranchesList', this.filter[this.keyOfFilter].branchParams).then(res => {
        console.log('Branches', res)
        this.fetching = false
        this.branchList.push(...res.branches)
        this.filter[this.keyOfFilter].branchParams.total = res.count
      }).finally(() => {
        this.fetching = false
      })
    },
    courierGetAll () {
      this.fetching = true
      this.$store.dispatch('getCouriersList', this.filter[this.keyOfFilter].courierParams).then(res => {
        console.log('courieres', res)
        this.fetching = false
        this.courierList.push(...res.couriers)
        this.filter[this.keyOfFilter].courierParams.total = res.count
      }).finally(() => {
        this.fetching = false
      })
    },
    callback (e) {
      this.active = e
      console.log(e)
    },
    getBranchReview () {
      this.loading = true
      this.$store.dispatch('getNewUserReview', this.params).then(res => {
        this.dataTable = res.branch_reports
        const columnData = res.related_subject_report
        this.columns = [
          {
            title: this.$t('branches'),
            align: 'center',
            dataIndex: 'name'
          },
          {
            title: this.$t('couriers'),
            children: [
              {
                title: '👍' + ' ' + columnData[0].type_reports[0].count + ' / ' + columnData[0].type_reports[0].percent + '%',
                align: 'center',
                dataIndex: 'related_subjects[0].type_reports[0]',
                scopedSlots: { customRender: 'like_dislike' }
              },
              {
                title: '👎' + ' ' + columnData[0].type_reports[1].count + ' / ' + columnData[0].type_reports[1].percent + '%',
                align: 'center',
                dataIndex: 'related_subjects[0].type_reports[1]',
                scopedSlots: { customRender: 'like_dislike' }
              }
            ]
          },
          {
            title: 'Время доставки',
            children: [
              {
                title: '👍' + ' ' + columnData[1].type_reports[0].count + ' / ' + columnData[1].type_reports[0].percent + '%',
                align: 'center',
                dataIndex: 'related_subjects[1].type_reports[0]',
                scopedSlots: { customRender: 'like_dislike' },
              },
              {
                title: '👎' + ' ' + columnData[1].type_reports[1].count + ' / ' + columnData[1].type_reports[1].percent + '%',
                align: 'center',
                dataIndex: 'related_subjects[1].type_reports[1]',
                scopedSlots: { customRender: 'like_dislike' }
              }
            ]
          },
          {
            title: 'Eда',
            children: [
              {
                title: '👍' + ' ' + columnData[2].type_reports[0].count + ' / ' + columnData[2].type_reports[0].percent + '%',
                align: 'center',
                dataIndex: 'related_subjects[2].type_reports[0]',
                scopedSlots: { customRender: 'like_dislike' }
              },
              {
                title: '👎' + ' ' + columnData[2].type_reports[1].count + ' / ' + columnData[2].type_reports[1].percent + '%',
                align: 'center',
                dataIndex: 'related_subjects[2].type_reports[1]',
                scopedSlots: { customRender: 'like_dislike' }
              }
            ]
          }
        ]
        console.log(res)
      }).finally(() => {
        this.loading = false
      })
    },
    getOperatorReview () {
      this.loading = true
      this.$store.dispatch('getOperatorReview', this.params).then(res => {
        this.operatorTable = res.operator_reports
        const columnData = res.related_subject_report
        this.columnsOperator = [
          {
            title: this.$t('ФИО'),
            align: 'center',
            dataIndex: 'name'
          },
          {
                title: '👍' + ' ' + columnData[0].type_reports[0].count + ' / ' + columnData[0].type_reports[0].percent + '%',
                align: 'center',
                dataIndex: 'related_subjects[0].type_reports[0]',
                scopedSlots: { customRender: 'like_dislike' }
              },
              {
                title: '👎' + ' ' + columnData[0].type_reports[1].count + ' / ' + columnData[0].type_reports[1].percent + '%',
                align: 'center',
                dataIndex: 'related_subjects[0].type_reports[1]',
                scopedSlots: { customRender: 'like_dislike' }
              }
        ]
        console.log(res)
      }).finally(() => {
        this.loading = false
      })
    },
    getCustomReview () {
      this.loading = true
      const customParams = {
        ...this.params,
        branch_id: this.filter[this.active].branch_id,
        courier_id: this.filter[this.active].courier_id
      }
      this.$store.dispatch('getCustomReview', customParams).then(res => {
        console.log('Custom reports', res)
        this.customTableLike = res.type_reports[0].user_reviews
        this.customTableDislike = res.type_reports[1].user_reviews
        this.customLikeCount = res.type_reports[0].count
        this.customDislikeCount = res.type_reports[1].count
        console.log(res)
      }).finally(() => {
        this.loading = false
      })
    },
    getReportReviews () {
      this.loading = true
      const customParams = {
        ...this.params,
        branch_id: this.filter[this.active].branch_id,
        courier_id: this.filter[this.active].courier_id
      }
      this.$store.dispatch('getReportReviews', customParams).then(res => {
        console.log('reports reviews', res)
        this.reportsReviews = res.reports
      }).finally(() => {
        this.loading = false
      })
    },
    filterDate (e) {
      if (e && e.length) {
        console.log(e)
        this.params.start_date = e[0]
        this.params.end_date = e[1]
        if (this.active === '1') this.getBranchReview()
        if (this.active === '2') this.getOperatorReview()
        if (this.active === '3') this.getCustomReview()
        if (this.active === '4') this.getReportReviews()
      } else {
        this.params.start_date = null
        this.params.end_date = null
        if (this.active === '1') this.getBranchReview()
        if (this.active === '2') this.getOperatorReview()
        if (this.active === '3') this.getCustomReview()
        if (this.active === '4') this.getReportReviews()
      }
    }
  }
}
</script>

<style scoped>

</style>
