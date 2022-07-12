<template>
<div>
  <div :key="item.title" v-for="item in value">
    <div class="content" :style="{'margin: 0':item.title === 'sunday'}">
      <div class="day-content">
        {{ $t(weekDays[item.day_number]) }}
      </div>
      <div class="right-content">
        <div />
        <p>{{ $t('beginning') }}:
          <a-time-picker
            format="HH:mm"
            class="workmode-time-picker"
            :value="moment(item.start_time, 'HH:mm')"
            @change="$emit('change', onTimepickerChange($event, item, 'start_time'))"
          />
        </p>
        <p>{{ $t('end') }}:
          <a-time-picker
            format="HH:mm"
            class="workmode-time-picker"
            :value="moment(item.end_time, 'HH:mm')"
            @change="$emit('change', onTimepickerChange($event, item, 'end_time'))"
          />
        </p>
        <a-switch v-model="item.is_active" @change="$emit('change', onCheckboxChange($event, item))" />
      </div>
    </div>
  </div>
</div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'WorkMode',
  data () {
    return {
      timeTableData: [
        { day_number: 0, is_active: false, start_time: '00:00', end_time: '23:00' },
        { day_number: 1, is_active: false, start_time: '00:00', end_time: '23:00' },
        { day_number: 2, is_active: false, start_time: '00:00', end_time: '23:00' },
        { day_number: 3, is_active: false, start_time: '00:00', end_time: '23:00' },
        { day_number: 4, is_active: false, start_time: '00:00', end_time: '23:00' },
        { day_number: 5, is_active: false, start_time: '00:00', end_time: '23:00' },
        { day_number: 6, is_active: false, start_time: '00:00', end_time: '23:00' },
      ],
      weekDays: [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ]
    }
  },
  created () {
    if (this.value?.length === 7) {
      this.timeTableData = this.value
    }
  },
  updated () {
    console.log(this.value)
    if (this.value?.length === 7) {
      this.timeTableData = this.value
    }
  },
  methods: {
    moment,
    onCheckboxChange (e, item) {
      item.is_active = e
      console.log(this.timeTableData)

      return this.timeTableData
    },
    onTimepickerChange (e, item, type) {
      item[type] = e.format('HH:mm')
      console.log(this.timeTableData)

      return this.timeTableData
    }
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['value'],
}
</script>

<style scoped>
  p {
    color: #AAAAAA;
    margin: 0;
    /* margin-left: 42px; */

  }

  span {
    color: #000;
  }

  .content {
    background-color: #FAFAFA;
    width: 100%;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    display: flex;
    margin-bottom: 14px;
  }

  .day-content {
    width: 112px;
    padding: 2px 8px;
    border-right: 1px solid #d9d9d9;
  }

  .right-content {
    width: calc(100% - 112px);
    justify-content: space-between;
    padding: 2px 8px;
    display: flex;
    align-items: center;
  }

  .workmode-time-picker input {
    border: none !important;
    background: transparent !important;
    padding: 0 !important;
  }
  .ant-time-picker-input {
    background: red !important
  }
</style>
