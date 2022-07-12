<template>
  <div>
    <a-range-picker
      @change="
        (e, valuearray) => {
          $router.replace({ query: { ...$route.query, start_date: valuearray[0], end_date: valuearray[1] } })
        }
      "
      style="margin-top: 5px"
      :placeholder="['От даты', 'До даты']"
    >
    </a-range-picker>
    <a-select
      allowClear
      v-model="filter.branch_ids"
      mode="multiple"
      @change="
        e => {
          $router.replace({ query: { ...$route.query, branch_ids: (e && e.join(',')) || undefined } })
        }
      "
      style="margin: 10px 5px; width: 150px"
      placeholder="Филиалы"
    >
      <a-select-option v-for="r in branchesList" :key="r.id" :value="r.id">
        <a-tooltip>
          <template slot="title">{{ r.name }}</template>
          {{ r.name }}
        </a-tooltip>
      </a-select-option>
    </a-select>
    <a-select
      allowClear
      v-model="filter.aggregator_id"
      @change="
        e => {
          $router.replace({ query: { ...$route.query, aggregator_id: e } })
        }
      "
      style="margin: 10px 5px; width: 150px"
      placeholder="Агрегаторы"
    >
      <a-select-option v-for="r in aggregatorsList" :key="r.id" :value="r.id">
        {{ r.name }}
      </a-select-option>
    </a-select>
    <a-select
      allowClear
      v-model="filter.source"
      @change="
        e => {
          $router.replace({ query: { ...$route.query, source: e } })
        }
      "
      style="margin: 10px 5px; width: 150px"
      placeholder="Источник"
    >
      <a-select-option v-for="s in sourceList" :key="s.key" :value="s.key">
        <a-tooltip>
          <template slot="title">{{ s.text }}</template>
          {{ s.text }}
        </a-tooltip>
      </a-select-option>
    </a-select>
    <a-select
      allowClear
      v-model="filter.delivery_type"
      @change="
        e => {
          $router.replace({ query: { ...$route.query, delivery_type: e } })
        }
      "
      style="margin: 10px 5px; width: 150px"
      placeholder="Тип доставки"
    >
      <a-select-option v-for="d in deliveryTypeList" :key="d.key" :value="d.key">
        {{ d.text }}
      </a-select-option>
    </a-select>
    <a-select
      allowClear
      v-model="filter.payment_type"
      @change="
        e => {
          $router.replace({ query: { ...$route.query, payment_type: e } })
        }
      "
      style="margin: 10px 5px; width: 150px"
      placeholder="Способ оплаты"
    >
      <a-select-option v-for="p in paymentTypeList" :key="p.key" :value="p.key">
        {{ p.text }}
      </a-select-option>
    </a-select>
    <!-- <a-checkable-tag style="margin: 10px 5px" v-model="filter.sort">По возрастанию</a-checkable-tag> -->
    <a-select
      allowClear
      show-search
      :auto-clear-search-value="false"
      @search="onSearch($event, 'customers')"
      v-model="filter.customer_id"
      :filter-option="false"
      style="margin: 10px 5px; width: 150px"
      placeholder="Клиенты"
      @popupScroll="onScrollBottom($event, 'customers')"
      @change="
        e => {
          $router.replace({
            query: {
              ...$route.query,
              customer_id: e,
              customer_name: e ? customersList.find(i => i.id === e).name : undefined
            }
          })
        }
      "
    >
      <a-select-option v-for="customer in customersList" :key="customer.id" :value="customer.id">
        {{ customer.name }}
      </a-select-option>
      <a-select-option
        v-if="$route.query.customer_id && !customersList.find(i => i.id === $route.query.customer_id)"
        :key="$route.query.customer_id"
        :value="$route.query.customer_id"
      >
        {{ $route.query.customer_name }}
      </a-select-option>
      <a-select-option key="customersFetching" v-if="customersParams.total > customersList.length || customersFetching">
        <a-spin size="small" />
      </a-select-option>
    </a-select>
    <a-select
      allowClear
      show-search
      :auto-clear-search-value="false"
      @search="onSearch($event, 'couriers')"
      v-model="filter.courier_id"
      :filter-option="false"
      style="margin: 10px 5px; width: 150px"
      placeholder="Курьеры"
      @popupScroll="onScrollBottom($event, 'couriers')"
      @change="
        e => {
          $router.replace({
            query: {
              ...$route.query,
              courier_id: e,
              first_name: e ? couriersList.find(i => i.id === e).first_name : undefined,
              last_name: e ? couriersList.find(i => i.id === e).last_name : undefined
            }
          })
        }
      "
    >
      <a-select-option v-for="courier in couriersList" :key="courier.id" :value="courier.id">
        <a-tooltip>
          <template slot="title">{{ courier.first_name }} {{ courier.last_name }}</template>
          {{ courier.first_name }} {{ courier.last_name }}
        </a-tooltip>
      </a-select-option>
      <a-select-option
        v-if="$route.query.courier_id && !couriersList.find(i => i.id === $route.query.courier_id)"
        :key="$route.query.courier_id"
        :value="$route.query.courier_id"
      >
        {{ $route.query.first_name }} {{ $route.query.last_name }}
      </a-select-option>
      <a-select-option key="couriersFetching" v-if="couriersParams.total > couriersList.length || couriersFetching">
        <a-spin size="small" />
      </a-select-option>
    </a-select>
    <!-- <a-table
      :columns="allColumns"
      :dataSource="allOrderReports"
      :pagination="paginationOrderReports"
      :rowKey="record => record.id"
      :loading="loadTable"
      :scroll="{ x: 1600, y: 600 }"
      @change="
        e => $router.replace({ query: { ...$route.query, current: e.current, pageSize: e.pageSize || undefined } })
      "
      bordered
    >
      <template slot="source" slot-scope="text, row">
        <div :style="{ textAlign: 'center' }">
          <img
            v-if="row.source === 'admin_panel'"
            src="../orderNew/icons/consulting.svg"
            style="width: 70%; height: 35px"
          />
          <img v-if="row.source === 'bot'" src="../orderNew/icons/telegram.svg" style="width: 70%; height: 35px" />
          <img v-if="row.source === 'android'" src="../orderNew/icons/android.svg" style="width: 70%; height: 35px" />
          <img v-if="row.source === 'ios'" src="../orderNew/icons/ios.svg" style="width: 70%; height: 35px" />
          <img v-if="row.source === 'website'" src="../orderNew/icons/globe.svg" style="width: 70%; height: 35px" />
        </div>
      </template>
      <template slot="id" slot-scope="text, record">
        <span>{{ updateIndex(record.id) }}</span></template
      >
      <template slot="order_accept_timer" slot-scope="text">
        <span :style="[{ color: text > '0:03:00' ? 'red' : 'black' }]">
          {{ text }}
        </span>
      </template>
      <template slot="vendor_timer" slot-scope="text">
        <span :style="[{ color: text > '0:12:00' ? 'red' : 'black' }]">
          {{ text }}
        </span>
      </template>
      <template slot="courier_timer" slot-scope="text">
        <span :style="[{ color: text > '0:20:00' ? 'red' : 'black' }]">
          {{ text }}
        </span>
      </template>
      <template slot="total_time" slot-scope="text">
        <span :style="[{ color: text > '0:30:00' ? 'red' : 'black' }]">
          {{ text }}
        </span>
      </template>
    </a-table> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
       filter: {
        start_date: undefined,
        end_date: undefined,
        source: undefined,
        aggregator_id: undefined,
        payment_type: undefined,
        delivery_type: undefined,
        customer_id: undefined,
        courier_id: undefined,
        branch_ids: undefined
      },
    }
  }
}
</script>
