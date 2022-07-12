/* eslint-disable no-undef */
<template>
  <a-card :title="$t('orderReport')" style="width: 100%">
    <div class="card-container">
      <a-tabs :activeKey="activTab" type="card" @change="changeTabs">
        <a-tab-pane key="1" :tab="$t('all_report')">
          <a-date-picker style="margin: 10px 5px" :placeholder="$t('from_time')" v-model="startDay" />
          <a-date-picker style="margin: 10px 5px" :placeholder="$t('to_date')" v-model="endDay" />
          <a-button @click="customReport" type="primary">{{ $t('search') }}</a-button>
          <a-table
            :columns="dayColumns"
            :dataSource="timer"
            :pagination="paginationTable"
            :rowKey="record => record.id"
            :loading="loadTable"
            bordered
            @change="changeTable"
            :scroll="{ y: 400 }"
          >
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="4" :tab="$t('Все отчеты по заказам')">
          <a-range-picker @change="(e, valuearray) => { $router.replace({ query: { ...$route.query, 'start_date': valuearray[0], 'end_date': valuearray[1] } }) }" style="margin-top: 5px" :placeholder="['От даты', 'До даты']">
          </a-range-picker>
          <a-select allowClear v-model="filter.branch_ids" mode="multiple" @change="e => { $router.replace({ query: { ...$route.query, 'branch_ids': e && e.join(',') || undefined } }) }" style="margin: 10px 5px; width: 150px" placeholder="Филиалы">
            <a-select-option v-for="r in branchesList" :key="r.id" :value="r.id">
              <a-tooltip>
                <template slot="title">{{ r.name }}</template>
                {{ r.name }}
              </a-tooltip>
            </a-select-option>
          </a-select>
          <a-select allowClear v-model="filter.aggregator_id" @change="e => { $router.replace({ query: { ...$route.query, 'aggregator_id': e } }) }" style="margin: 10px 5px; width: 150px" placeholder="Агрегаторы">
            <a-select-option v-for="r in aggregatorsList" :key="r.id" :value="r.id">
              {{ r.name }}
            </a-select-option>
          </a-select>
          <a-select allowClear v-model="filter.source" @change="e => { $router.replace({ query: { ...$route.query, 'source': e } }) }" style="margin: 10px 5px; width: 150px" placeholder="Источник">
            <a-select-option v-for="s in sourceList" :key="s.key" :value="s.key">
              <a-tooltip>
                <template slot="title">{{ s.text }}</template>
                {{ s.text }}
              </a-tooltip>
            </a-select-option>
          </a-select>
          <a-select allowClear v-model="filter.delivery_type" @change="e => { $router.replace({ query: { ...$route.query, 'delivery_type': e } }) }" style="margin: 10px 5px; width: 180px" placeholder="Тип доставки">
            <a-select-option v-for="d in deliveryTypeList" :key="d.key" :value="d.key">
              {{ d.text }}
            </a-select-option>
          </a-select>
          <a-select allowClear v-model="filter.payment_type" @change="e => { $router.replace({ query: { ...$route.query, 'payment_type': e } }) }" style="margin: 10px 5px; width: 150px" placeholder="Способ оплаты">
            <a-select-option v-for="p in paymentTypeList" :key="p.key" :value="p.key">
              {{ p.text }}
            </a-select-option>
          </a-select>
          <!-- <a-checkable-tag style="margin: 10px 5px" v-model="filter.sort">По возрастанию</a-checkable-tag> -->
          <!-- <a-select
            allowClear
            show-search
            :auto-clear-search-value="false"
            @search="onSearch($event, 'customers')"
            v-model="filter.customer_id"
            :filter-option="false"
            style="margin: 10px 5px; width: 150px"
            placeholder="Клиенты"
            @popupScroll="onScrollBottom($event, 'customers')"
            @change="e => { $router.replace({ query: { ...$route.query, 'customer_id': e, customer_name: e ? customersList.find(i => i.id === e).name : undefined } }) }"
          >
            <a-select-option
              v-for="customer in customersList"
              :key="customer.id"
              :value="customer.id"
            >
              {{ customer.name }}
            </a-select-option>
            <a-select-option v-if="$route.query.customer_id && !customersList.find(i => i.id === $route.query.customer_id)" :key="$route.query.customer_id" :value="$route.query.customer_id">
              {{ $route.query.customer_name }}
            </a-select-option>
            <a-select-option key="customersFetching" v-if="customersParams.total > customersList.length || customersFetching">
              <a-spin size="small" />
            </a-select-option>
          </a-select> -->
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
            @change="e => { $router.replace({ query: { ...$route.query, 'courier_id': e, first_name: e ? couriersList.find(i => i.id === e).first_name : undefined, last_name: e ? couriersList.find(i => i.id === e).last_name : undefined } }) }"
          >
            <a-select-option
              v-for="courier in couriersList"
              :key="courier.id"
              :value="courier.id"
            >
              <a-tooltip>
                <template slot="title">{{ courier.first_name }} {{ courier.last_name }}</template>
                {{ courier.first_name }} {{ courier.last_name }}
              </a-tooltip>
            </a-select-option>
            <a-select-option v-if="$route.query.courier_id && !couriersList.find(i => i.id === $route.query.courier_id)" :key="$route.query.courier_id" :value="$route.query.courier_id">
              {{ $route.query.first_name }} {{ $route.query.last_name }}
            </a-select-option>
            <a-select-option key="couriersFetching" v-if="couriersParams.total > couriersList.length || couriersFetching">
              <a-spin size="small" />
            </a-select-option>
          </a-select>
          <!-- <a-button @click="customReport" type="primary">{{ $t('search') }}</a-button> -->
          <a-table
            :columns="allColumns"
            :dataSource="allOrderReports"
            :pagination="paginationOrderReports"
            :rowKey="record => record.id"
            :loading="loadTable"
            :scroll="{ x: 2000, y: 400 }"
            @change="e => $router.replace({ query: { ...$route.query, 'current': e.current, pageSize: e.pageSize || undefined } })"
            bordered
          >
            <template slot="source" slot-scope="text, row">
              <div :style="{textAlign: 'center'}">
                <img v-if="row.source === 'admin_panel'" src="../orderNew/icons/consulting.svg" style="width: 70%; height: 35px" />
                <img v-if="row.source === 'bot'" src="../orderNew/icons/telegram.svg" style="width: 70%; height: 35px" />
                <img v-if="row.source === 'android'" src="../orderNew/icons/android.svg" style="width: 70%; height: 35px" />
                <img v-if="row.source === 'ios'" src="../orderNew/icons/ios.svg" style="width: 70%; height: 35px" />
                <img v-if="row.source === 'website'" src="../orderNew/icons/globe.svg" style="width: 70%; height: 35px" />
              </div>
            </template>
            <template slot="payment_type" slot-scope="text, row">
              <div :style="{textAlign: 'center'}">
                <img v-if="row.payment_type === 'cash'" src="../orderNew/icons/cash.svg" style="width: 70%; height: 35px" />
                <img v-if="row.payment_type === 'transfer'" src="../orderNew/icons/bank.svg" style="width: 70%; height: 35px" />
                <img v-if="row.payment_type === 'click'" src="../orderNew/icons/click.svg" style="width: 70%; height: 35px" />
                <img v-if="row.payment_type === 'payme'" src="../orderNew/icons/payme.svg" style="width: 70%; height: 35px" />
              </div>
            </template>
            <template slot="price" slot-scope="row">
              <div>
                {{ row.delivery_price + row.order_amount }}
              </div>
            </template>
            <template slot="delivery_type" slot-scope="row">
              <div>
                {{
                  row.delivery_type === 'delivery' ? 'Доставка' :
                    row.delivery_type === 'self-pickup' ? 'Самовызов' :
                      row.delivery_type === 'aggregator' ? 'Аггрегатор' : row.delivery_type
                }}
              </div>
            </template>
            <template slot="id" slot-scope="text, record"> <span>{{ updateIndex(record.id) }}</span></template>
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
            <template slot="price" slot-scope="row">
              <div>
                {{ row.delivery_price + row.order_amount }}
              </div>
            </template>
            <template slot="delivery_type" slot-scope="row">
              <div>
                {{
                  row.delivery_type === 'delivery' ? 'Доставка' :
                    row.delivery_type === 'self-pickup' ? 'Самовызов' :
                      row.delivery_type === 'aggregator' ? 'Аггрегатор' : row.delivery_type
                }}
              </div>
            </template>
            <template slot="id" slot-scope="text, record"> <span>{{ updateIndex(record.id) }}</span></template>
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
          </a-table>
        </a-tab-pane>

        <a-tab-pane key="9" :tab="$t('Все отчеты по заказам (старые)')">
        <a-range-picker @change="(e, valuearray) => { $router.replace({ query: { ...$route.query, 'start_date': valuearray[0], 'end_date': valuearray[1] } }) }" style="margin-top: 5px" :placeholder="['От даты', 'До даты']">
        </a-range-picker>
        <a-select allowClear v-model="filter.branch_ids" mode="multiple" @change="e => { $router.replace({ query: { ...$route.query, 'branch_ids': e && e.join(',') || undefined } }) }" style="margin: 10px 5px; width: 150px" placeholder="Филиалы">
          <a-select-option v-for="r in branchesList" :key="r.id" :value="r.id">
            <a-tooltip>
              <template slot="title">{{ r.name }}</template>
              {{ r.name }}
            </a-tooltip>
          </a-select-option>
        </a-select>
        <a-select allowClear v-model="filter.aggregator_id" @change="e => { $router.replace({ query: { ...$route.query, 'aggregator_id': e } }) }" style="margin: 10px 5px; width: 150px" placeholder="Агрегаторы">
          <a-select-option v-for="r in aggregatorsList" :key="r.id" :value="r.id">
            {{ r.name }}
          </a-select-option>
        </a-select>
        <a-select allowClear v-model="filter.source" @change="e => { $router.replace({ query: { ...$route.query, 'source': e } }) }" style="margin: 10px 5px; width: 150px" placeholder="Источник">
          <a-select-option v-for="s in sourceList" :key="s.key" :value="s.key">
            <a-tooltip>
              <template slot="title">{{ s.text }}</template>
              {{ s.text }}
            </a-tooltip>
          </a-select-option>
        </a-select>
        <a-select allowClear v-model="filter.delivery_type" @change="e => { $router.replace({ query: { ...$route.query, 'delivery_type': e } }) }" style="margin: 10px 5px; width: 180px" placeholder="Тип доставки">
          <a-select-option v-for="d in deliveryTypeList" :key="d.key" :value="d.key">
            {{ d.text }}
          </a-select-option>
        </a-select>
        <a-select allowClear v-model="filter.payment_type" @change="e => { $router.replace({ query: { ...$route.query, 'payment_type': e } }) }" style="margin: 10px 5px; width: 150px" placeholder="Способ оплаты">
          <a-select-option v-for="p in paymentTypeList" :key="p.key" :value="p.key">
            {{ p.text }}
          </a-select-option>
        </a-select>
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
          @change="e => { $router.replace({ query: { ...$route.query, 'customer_id': e, customer_name: e ? customersList.find(i => i.id === e).name : undefined } }) }"
        >
          <a-select-option
            v-for="customer in customersList"
            :key="customer.id"
            :value="customer.id"
          >
            {{ customer.name }}
          </a-select-option>
          <a-select-option v-if="$route.query.customer_id && !customersList.find(i => i.id === $route.query.customer_id)" :key="$route.query.customer_id" :value="$route.query.customer_id">
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
          @change="e => { $router.replace({ query: { ...$route.query, 'courier_id': e, first_name: e ? couriersList.find(i => i.id === e).first_name : undefined, last_name: e ? couriersList.find(i => i.id === e).last_name : undefined } }) }"
        >
          <a-select-option
            v-for="courier in couriersList"
            :key="courier.id"
            :value="courier.id"
          >
            <a-tooltip>
              <template slot="title">{{ courier.first_name }} {{ courier.last_name }}</template>
              {{ courier.first_name }} {{ courier.last_name }}
            </a-tooltip>
          </a-select-option>
          <a-select-option v-if="$route.query.courier_id && !couriersList.find(i => i.id === $route.query.courier_id)" :key="$route.query.courier_id" :value="$route.query.courier_id">
            {{ $route.query.first_name }} {{ $route.query.last_name }}
          </a-select-option>
          <a-select-option key="couriersFetching" v-if="couriersParams.total > couriersList.length || couriersFetching">
            <a-spin size="small" />
          </a-select-option>
        </a-select>
        <a-table
          :columns="allColumnsOld"
          :dataSource="allOrderReports"
          :pagination="paginationOrderReports"
          :rowKey="record => record.id"
          :loading="loadTable"
          :scroll="{ y: 400, x: 1600 }"
          @change="e => $router.replace({ query: { ...$route.query, 'current': e.current, pageSize: e.pageSize || undefined } })"
          bordered
        >
          <template slot="source" slot-scope="text, row">
            <div :style="{textAlign: 'center'}">
              <img v-if="row.source === 'admin_panel'" src="../orderNew/icons/consulting.svg" style="width: 70%; height: 35px" />
              <img v-if="row.source === 'bot'" src="../orderNew/icons/telegram.svg" style="width: 70%; height: 35px" />
              <img v-if="row.source === 'android'" src="../orderNew/icons/android.svg" style="width: 70%; height: 35px" />
              <img v-if="row.source === 'ios'" src="../orderNew/icons/ios.svg" style="width: 70%; height: 35px" />
              <img v-if="row.source === 'website'" src="../orderNew/icons/globe.svg" style="width: 70%; height: 35px" />
            </div>
          </template>
            <template slot="price" slot-scope="row">
              <div>
                {{ row.delivery_price + row.order_amount }}
              </div>
            </template>
            <template slot="delivery_type" slot-scope="row">
              <div>
                {{
                  row.delivery_type === 'delivery' ? 'Доставка' :
                    row.delivery_type === 'self-pickup' ? 'Самовызов' :
                      row.delivery_type === 'aggregator' ? 'Аггрегатор' : row.delivery_type
                }}
              </div>
            </template>
            <template slot="id" slot-scope="text, record"> <span>{{ updateIndex(record.id) }}</span></template>
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
            <template slot="price" slot-scope="row">
              <div>
                {{ row.delivery_price + row.order_amount }}
              </div>
            </template>
            <template slot="delivery_type" slot-scope="row">
              <div>
                {{
                  row.delivery_type === 'delivery' ? 'Доставка' :
                    row.delivery_type === 'self-pickup' ? 'Самовызов' :
                      row.delivery_type === 'aggregator' ? 'Аггрегатор' : row.delivery_type
                }}
              </div>
            </template>
            <template slot="id" slot-scope="text, record"> <span>{{ updateIndex(record.id) }}</span></template>
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
        </a-table>
        </a-tab-pane>
        <a-tab-pane key="5" tab="Все отчеты по заказам на карте">
          <a-range-picker
            :disabled-date="disabledDate"
            :value="mapDateRangeValue"
            @change="onMapPickerChange"
            style="margin-top: 5px"
            :placeholder="['От даты', 'До даты']"
          />
          <OrdersMap :range="mapDateRange" style="margin-top: 24px" />
        </a-tab-pane>
          <a-tab-pane v-if="shipperId == '36b00947-ad7a-40eb-b7ca-1c0ea267f2ac'" key="6" :tab="$t('reports_with_delayed')">
          <a-range-picker @change="(e, valuearray) => { $router.replace({ query: { ...$route.query, 'start_date': valuearray[0], 'end_date': valuearray[1] } }) }" style="margin-top: 5px" :placeholder="['От даты', 'До даты']">
          </a-range-picker>
          <a-table
            :columns="newColumns"
            :dataSource="allOrdersWithDelayed"
            :pagination="paginationOrderReports"
            :rowKey="record => record.id"
            :loading="loadTable"
            bordered
            @change="e => $router.replace({ query: { ...$route.query, 'current': e.current, pageSize: e.pageSize || undefined } })"
            :scroll="{ y: 400 }"
          >
          <template slot="payment_type" slot-scope="text, row">
              <div :style="{textAlign: 'center'}">
              <img v-if="row.payment_type === 'cash'" :src="require('../orderNew/icons/cash.svg')" style="width: 70%; height: 35px" />
              <img v-if="row.payment_type === 'transfer'" :src="require('../orderNew/icons/bank.svg')" style="width: 70%; height: 35px" />
              <img v-if="row.payment_type === 'click'" :src="require('../orderNew/icons/click.svg')" style="width: 70%; height: 35px" />
              <img v-if="row.payment_type === 'payme'" :src="require('../orderNew/icons/payme.svg')" style="width: 70%; height: 35px" />
            </div>
          </template>
           <!-- <template slot="price" slot-scope="row">
              <div>
                {{ row.delivery_price + row.order_amount }}
              </div>
            </template> -->
             <template slot="is_courier_get_paid" slot-scope="row">
              <div>
                {{ row.is_courier_get_paid ? "Да" : "Нет" }}
              </div>
            </template>
          </a-table>
        </a-tab-pane>
        <div slot="tabBarExtraContent">
          <a-button @click="downloadExcel" :disabled="buttonLoading">
            <a-icon :type="buttonLoading ? 'loading' : 'download'" style="color: blue; font-size: 1.1rem;"></a-icon
            ></a-button>
        </div>
      </a-tabs>
    </div>
  </a-card>
</template>
<script>
import moment from 'moment'
import request from '@/utils/request'
import debounce from 'lodash/debounce'
import { mapActions, mapGetters } from 'vuex'
import OrdersMap from '@/views/dashboard/OrdersMap.vue'
export default {
  components: {
    OrdersMap,
  },
  data () {
    this.onSearch = debounce(this.onSearch, 400)
    return {
      activTab: this.$route.query.activTab ? this.$route.query.activTab : '1',
      timer: [],
      infoDate: '',
      dateDay: '',
      dateMonth: '',
      startDay: moment(),
      endDay: moment().add(1, 'd'),
      allTime: null,
      paginationTable: {},
      dateFormat: 'YYYY-MM-DD',
      dateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
      monthFormat: 'YYYY-MM',
      loadTable: false,
      selectedDate: null,
      shipperId: '',
      mapDateRangeValue: [
        moment(),
        moment().add(1, 'd')
      ],
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
      dayColumns: [
        {
          title: this.$t('orderId'),
          dataIndex: 'id'
        },
        {
          title: this.$t('branchName'),
          dataIndex: 'branch_name',
          align: 'center'
        },
        {
          title: this.$t('allTime'),
          dataIndex: 'all_time',
          align: 'center'
        },
        {
          title: this.$t('operatorAccepted') + '--' + this.$t('branchesAccepted'),
          dataIndex: 'time1',
          align: 'center'
        },
        {
          title: this.$t('branchesAccepted') + '--' + this.$t('branchesReady'),
          dataIndex: 'time2',
          align: 'center'
        },
        {
          title: this.$t('branchesReady') + '--' + this.$t('courierPickedUp'),
          dataIndex: 'time3',
          align: 'center'
        },
        {
          title: this.$t('courierPickedUp') + '--' + this.$t('finished'),
          dataIndex: 'time4',
          align: 'center'
        }
      ],
      newColumns: [
        {
          title: this.$t('orderId'),
          dataIndex: 'external_order_id'
        },
        {
          title: this.$t('branchName'),
          dataIndex: 'branch_name',
          align: 'center'
        },
        {
          title: this.$t('courier'),
          dataIndex: 'courier_name',
          align: 'center'
        },
        {
          title: this.$t('тип платежа'),
          // dataIndex: 'payment_type',
          scopedSlots: { customRender: 'payment_type' },
          align: 'center'
        },
        {
          title: this.$t('цена заказа'),
          dataIndex: 'order_amount',
          // scopedSlots: { customRender: 'price' },
          align: 'center'
        },
        {
          title: this.$t('получена сумма'),
          scopedSlots: { customRender: 'is_courier_get_paid' },
          // dataIndex: 'is_courier_paid',
          align: 'center'
        },
        {
          title: this.$t('причина'),
          dataIndex: 'delayed_reason',
          align: 'center'
        },
        {
          title: this.$t('время'),
          dataIndex: 'total_time',
          align: 'center'
        }
      ],
      allColumns: [
        {
          title: this.$t('ordernumber'),
          align: 'center',
          scopedSlots: { customRender: 'id' }
        },
        {
          slots: { title: this.$t('orderId') },
          title: this.$t('orderId'),
          dataIndex: 'external_order_id'
        },
        {
          title: this.$t('Оператор'),
          dataIndex: 'operator_name',
          align: 'center'
        },
        {
          title: this.$t('branchName'),
          dataIndex: 'branch_name',
          align: 'center'
        },
        {
          title: this.$t('delivery_type'),
          align: 'center',
          scopedSlots: { customRender: 'delivery_type' }
        },
        {
          title: this.$t('Курьер'),
          dataIndex: 'courier_name',
          align: 'center'
        },
        {
          title: this.$t('Источник'),
          align: 'center',
          scopedSlots: { customRender: 'source' }
        },
        {
          title: this.$t('payment_type'),
          align: 'center',
          scopedSlots: { customRender: 'payment_type' }
        },
        {
          title: this.$t('price.order'),
          align: 'center',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: this.$t('Новый заказ'),
          dataIndex: 'created_at',
          align: 'center'
        },
        {
          title: this.$t('КЦ оформил (время)'),
          dataIndex: 'operator_accepted_time',
          align: 'center'
        },
        {
          title: this.$t('КЦ оформил (таймер)'),
          dataIndex: 'operator_accepted_time_amount',
          align: 'center',
          scopedSlots: { customRender: 'order_accept_timer' }
        },
        {
          title: this.$t('Кухня приняла'),
          dataIndex: 'vendor_accepted_time',
          align: 'center',
          // scopedSlots: { customRender: 'vendor_accepted_time' }
        },
        {
          title: this.$t('Кухня приняла (таймер)'),
          dataIndex: 'vendor_accepted_time_amount',
          align: 'center',
          // scopedSlots: { customRender: 'vendor_accepted_time_amount' }
        },
        {
          title: this.$t('Кухня подготовил (Время)'),
          dataIndex: 'vendor_ready_time',
          align: 'center'
        },
        {
          title: this.$t('Кухня подготовил (таймер)'),
          dataIndex: 'vendor_ready_time_amount',
          align: 'center',
          scopedSlots: { customRender: 'vendor_timer' }
        },
        {
          title: this.$t('Курьер принял (Время)'),
          dataIndex: 'courier_accepted_time',
          align: 'center',
          // scopedSlots: { customRender: 'vendor_timer' }
        },
        {
          title: this.$t('Курьер принял (таймер)'),
          dataIndex: 'courier_accepted_time_amount',
          align: 'center',
          // scopedSlots: { customRender: 'vendor_timer' }
        },
        {
          title: this.$t('Курьер забрал (Время)'),
          dataIndex: 'courier_picked_time',
          align: 'center',
          // scopedSlots: { customRender: 'vendor_timer' }
        },
        {
          title: this.$t('Курьер забрал (таймер)'),
          dataIndex: 'courier_picked_time_amount',
          align: 'center',
          // scopedSlots: { customRender: 'vendor_timer' }
        },
        {
          title: this.$t('Курьер доставил (время)'),
          dataIndex: 'courier_delivered_time',
          align: 'center'
        },
        {
          title: this.$t('Курьер доставил  (таймер)'),
          align: 'center',
          dataIndex: 'courier_delivered_time_amount',
          scopedSlots: { customRender: 'courier_timer' }
        },
        {
          title: this.$t('Итоговое время'),
          dataIndex: 'total_time',
          align: 'center',
          scopedSlots: { customRender: 'total_time' }
        }
      ],
      allColumnsOld: [
        {
          title: this.$t('ordernumber'),
          align: 'center',
          scopedSlots: { customRender: 'id' }
        },
        {
          slots: { title: this.$t('orderId') },
          title: this.$t('orderId'),
          dataIndex: 'external_order_id'
        },
        {
          title: this.$t('Оператор'),
          dataIndex: 'operator_name',
          align: 'center'
        },
        {
          title: this.$t('branchName'),
          dataIndex: 'branch_name',
          align: 'center'
        },
        {
          title: this.$t('delivery_type'),
          align: 'center',
          scopedSlots: { customRender: 'delivery_type' }
        },
        {
          title: this.$t('Курьер'),
          dataIndex: 'courier_name',
          align: 'center'
        },
        {
          title: this.$t('Источник'),
          align: 'center',
          scopedSlots: { customRender: 'source' }
        },
        {
          title: this.$t('price.order'),
          align: 'center',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: this.$t('Новый заказ'),
          dataIndex: 'created_at',
          align: 'center'
        },
        {
          title: this.$t('КЦ оформил (время)'),
          dataIndex: 'operator_accepted_time',
          align: 'center'
        },
        {
          title: this.$t('КЦ оформил (таймер)'),
          dataIndex: 'operator_accepted_time_amount',
          align: 'center',
          scopedSlots: { customRender: 'order_accept_timer' }
        },
        {
          title: this.$t('Кухня подготовила (время)'),
          dataIndex: 'vendor_ready_time',
          align: 'center',
          // scopedSlots: { customRender: 'vendor_timer' }
        },
        {
          title: this.$t('Кухня подготовила (таймер)'),
          dataIndex: 'vendor_ready_time_amount',
          align: 'center',
          // scopedSlots: { customRender: 'vendor_timer' }
        },
        {
          title: this.$t('Курьер доставил (время)'),
          dataIndex: 'courier_delivered_time',
          align: 'center'
        },
        {
          title: this.$t('Курьер доставил  (таймер)'),
          align: 'center',
          dataIndex: 'courier_delivered_time_amount',
          scopedSlots: { customRender: 'courier_timer' }
        },
        {
          title: this.$t('Итоговое время'),
          dataIndex: 'total_time',
          align: 'center',
          scopedSlots: { customRender: 'total_time' }
        }
      ],
      allOrderReports: [],
      allOrdersWithDelayed: [],
      paginationOrderReports: {
        pageSize: 100,
        current: 1,
        total: null
      },
      aggregatorsList: [],
      branchesList: [],
      customersList: [],
      customersParams: {
        limit: 20,
        page: 1,
        total: null
      },
      customersFetching: false,
      couriersList: [],
      couriersParams: {
        limit: 20,
        page: 1,
        total: null
      },
      couriersFetching: false,
      sourceList: [
        {
          text: 'Aдминка',
          key: 'admin_panel'
        },
        {
          text: 'Telegram бот',
          key: 'bot'
        },
        {
          text: 'Апп',
          key: 'app'
        },
        // {
        //   text: 'Android мобильный',
        //   key: 'android'
        // },
        // {
        //   text: 'Мобильный IOS',
        //   key: 'ios'
        // },
        {
          text: 'Веб-сайт',
          key: 'website'
        }
      ],
      deliveryTypeList: [
        {
          text: 'Доставка',
          key: 'delivery'
        },
        {
          text: 'Самовывоз',
          key: 'self-pickup'
        },
        {
          text: 'Самовывоз (аггрегатор)',
          key: 'aggregator'
        }
      ],
      paymentTypeList: [
        {
          text: 'Наличные',
          key: 'cash'
        },
        {
          text: 'Click',
          key: 'click'
        },
        {
          text: 'Payme',
          key: 'payme'
        },
        {
          text: 'Перевод',
          key: 'transfer'
        }
      ]
    }
  },
  methods: {
    ...mapActions(['getBranchReports', 'getOrderReports', 'getOrderReportsExcel', 'getOrderReportsWithDelayed', 'getOrderReportsWithDelayedExcel']),
    onMapPickerChange (e, val) {
      console.log('on Map Tab change', e, val)
      this.mapDateRangeValue = e
    },
    onCalendarChange (e) {
      console.log(e)
      if (e.length === 1) {
        this.selectedDate = e[0].format('YYYY-MM-DD')
      } else {
        this.selectedDate = null
      }
    },
    disabledDate (current) {
      if (this.selectedDate) {
        const end = moment(this.selectedDate).add(30, 'd')
        const start = moment(this.selectedDate).subtract(30, 'd')
        return current && (current < start || current > end)
      }
      return false
    },
    onChangeFromDate (value, dataString) {
      console.log(value, dataString)
    },
    downloadExcel () {
    // this.$store.dispatch('buttonLoadingFunction', true)
    console.log(this.$route.query)
      if (this.activTab === '9') {
        const cusFilter = { ...this.filter, branch_ids: this.filter.branch_ids ? this.filter.branch_ids.join(',') : '' }
        if (!this.filter.branch_ids) delete cusFilter.branch_ids
        this.$store.dispatch('getOldOrderExcels', cusFilter)
        .then(res => {
          console.log(res)
          console.log(this.filter)
        }).catch(err => {
          console.log(err)
        })
        .finally(() => {
        })
        return
      }
      if (this.activTab === '4') {
        const cusFilter = { ...this.filter, branch_ids: this.filter.branch_ids ? this.filter.branch_ids.join(',') : '' }
        if (!this.filter.branch_ids) {
          delete cusFilter.branch_ids
        }
        this.$store.dispatch('getDowlondsXLSX', cusFilter)
        .then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
        .finally(() => {
        })
      } else if (this.activTab === '3' || this.activTab === '1') {
        const params = { start_date: '', end_date: '' }
        if (this.activTab === '1') {
          params.start_date = this.dateDay ? this.dateDay : moment().format('YYYY-MM-DD')
          params.end_date = this.dateDay
            ? moment(this.dateDay).add(1, 'd').format('YYYY-MM-DD')
            : moment().add(1, 'd').format('YYYY-MM-DD')
        }
        if (this.activTab === '3') {
          params.start_date = this.startDay ? this.startDay : moment().format('YYYY-MM-DD')
          params.end_date = this.endDay ? this.endDay : moment().add(1, 'd').format('YYYY-MM-DD')
        }
        console.log(params)
        this.getOrderReportsExcel(params)
          .then(res => {
            // const elem = document.createElement('a')
            // elem.setAttribute('href', res.url)
            // elem.setAttribute('download', res.file_name)
            // elem.click()
          })
      } else if (this.activTab === '6') {
        const params = { start_date: '', end_date: '' }
        params.start_date = this.$route.query.start_date ? this.$route.query.start_date : moment().format('YYYY-MM-DD')
        params.end_date = this.$route.query.end_date
          ? moment(this.$route.query.end_date).add(1, 'd').format('YYYY-MM-DD')
          : moment().add(1, 'd').format('YYYY-MM-DD')
        this.getOrderReportsWithDelayedExcel(params)
          .then(res => {

          })
      }
    },
    getAggregators (params) {
      this.$store.dispatch('getAggregators', { limit: 100 })
      .then(res => {
        this.aggregatorsList = res.aggregators
      })
    },
    updateIndex (id) {
      // eslint-disable-next-line no-undef
      for (let i = 0; i < this.allOrderReports.length; i++) {
        // eslint-disable-next-line no-undef
        if (this.allOrderReports[i].id === id) return this.paginationOrderReports.current ? ((parseInt(this.paginationOrderReports.current) - 1) * 100 + (i + 1)) : (i + 1)
      }
    },
    getBranches (params) {
      this.$store.dispatch('getBranchesList', { limit: 100 })
      .then(res => {
        this.branchesList = res.branches
      })
    },
    customersGetAll (params) {
      this.customersFetching = true
      this.$store.dispatch('getCustomerList', this.customersParams)
      .then(res => {
        this.customersList.push(...res.customers)
        this.customersParams.total = parseInt(res.count)
      })
      .finally(() => {
        this.customersFetching = false
      })
    },
    couriersGetAll (params) {
      this.couriersFetching = true
      this.$store.dispatch('getCouriersList', this.couriersParams)
      .then(res => {
        this.couriersList.push(...res.couriers)
        this.couriersParams.total = res.count
      })
      .finally(() => {
        this.couriersFetching = false
      })
    },
    onSearch (value, type) {
      this[`${type}Fetching`] = true
      this[`${type}List`] = []
      this[`${type}Params`] = { search: value, limit: 20, page: 1 }
      console.log(type, 'Search', this[`${type}Params`])
      this[`${type}GetAll`]()
    },
    onScrollBottom (event, type) {
      var target = event.target
      console.log('ON scroll bottom', target.scrollTop, target.offsetHeight, target.scrollHeight)
      if (!this[`${type}Fetching`] && target.scrollTop + target.offsetHeight === target.scrollHeight) {
        if (this[`${type}Params`].total > this[`${type}List`].length) {
          this[`${type}Params`].page += 1
          target.scrollTo(0, target.scrollHeight)
          this[`${type}GetAll`]()
        }
      }
    },
    getAllReports (params) {
      this.loadTable = true
      this.getOrderReports(params).then(res => {
        this.allOrderReports = res.reports
        this.paginationOrderReports.total = parseInt(res.count)
        this.paginationOrderReports.current = params.page
        this.paginationOrderReports.pageSize = params.limit
      }).finally(() => {
        this.loadTable = false
      })
    },
    getReportsWithDelayed (params) {
      this.loadTable = true
      this.getOrderReportsWithDelayed(params).then(res => {
        this.allOrdersWithDelayed = res.reports
        this.paginationOrderReports.total = parseInt(res.count)
        this.paginationOrderReports.current = params.page
        this.paginationOrderReports.pageSize = params.limit
      }).finally(() => {
        this.loadTable = false
      })
    },
    nowReport (type) {
      var date = new Date()
      if (type === 'day') {
        // this.params.start_date = moment(Date.now()).subtract({ hours: this.$diffDayHour }).format('YYYY-MM-DD') + ' ' + '05:00:00'
        // this.params.end_date = moment(Date.now()).add({ hours: (24 - this.$diffDayHour) }).format('YYYY-MM-DD') + ' ' + '05:00:00'
        var now = moment(date).subtract({ hours: this.$diffDayHour }).format(this.dateFormat)
        var nextDay = moment(Date.now()).add({ hours: (24 - this.$diffDayHour) })
        var tomorrow = moment(Date.now()).add({ hours: (24 - this.$diffDayHour) }).format(this.dateFormat) + ' ' + '05:00:00'
        console.log(now, tomorrow)
        this.infoDate = now + ' ' + '--' + ' ' + moment(nextDay).format(this.dateFormat)
        this.filter.start_date = moment(Date.now()).subtract(1, 'd').format(this.dateFormat)
        this.filter.end_date = now
        if (!this.$route.query.start_date) this.$router.replace({ query: { ...this.$route.query, 'start_date': moment(Date.now()).subtract(1, 'd').format(this.dateFormat) } })
        if (!this.$route.query.end_date) this.$router.replace({ query: { ...this.$route.query, 'end_date': now } })
        return {
          start_date: now + ' ' + '05:00:00',
          end_date: tomorrow
        }
      }
      if (type === 'month') {
        var nowMonth = moment(date).format(this.monthFormat) + '-' + '01' + ' ' + '05:00:00'
        var nMonth = date.setMonth(date.getMonth() + 1)
        var nextMonth = moment(nMonth).format(this.monthFormat) + '-' + '01' + ' ' + '05:00:00'
        this.infoDate = moment(date).format(this.monthFormat) + ' ' + '--' + ' ' + moment(nMonth).format(this.monthFormat)
        // this.filter.start_date = moment(date).format(this.monthFormat)
        // this.filter.end_date = moment(nMonth).format(this.monthFormat)
        return {
          start_date: nowMonth,
          end_date: nextMonth
        }
      }
    },
    changeTabs (val) {
      console.log(val)
      if (val === '3') {
        this.activTab = '3'
        this.infoDate = ''
      }
      if (val === '4') {
        this.nowReport('day')
        this.activTab = '4'
      }
      this.activTab = val
    },
    customReport () {
      var start
      var end
      if (typeof this.endDay === 'object' || typeof this.startDay === 'object') {
        start = this.startDay.format('YYYY-MM-DD')
        end = this.endDay.format('YYYY-MM-DD')
      } else {
         start = this.startDay
         end = this.endDay
      }
      // console.log('==========dd ', this.startDay, this.endDay)
      if (start && end) {
        var startTime = parseInt(start.split('-')[0]) * 365 + parseInt(start.split('-')[1]) * 30 + parseInt(start.split('-')[2])
        var endTime = parseInt(end.split('-')[0]) * 365 + parseInt(end.split('-')[1]) * 30 + parseInt(end.split('-')[2])
        if (startTime < endTime) {
          this.infoDate = start + ' ' + '--' + ' ' + end
          this.loadTable = true
          this.allTime = {
            start_date: start + ' ' + '05:00:00',
            end_date: end + ' ' + '05:00:00'
          }
          this.getAllOrders(undefined, {
            start_date: start + ' ' + '05:00:00',
            end_date: end + ' ' + '05:00:00'
          }).then(res => {
            this.loadTable = false
          })
        } else this.$message.error(this.$t('error_from_time'))
      } else this.$message.error(this.$t('error_from_time'))
      // }
    },
    changeTable (e) {
      this.$router.replace({ name: this.$route.name, query: { current: e.current } }).catch(e => null)
      this.getAllOrders(e, this.dateDay ? this.allTime : this.nowReport('day'))
    },
    getAllOrders (page, date) {
      // debugger
      return new Promise((resolve, reject) => {
        if (!page) {
          page = { current: 1, pageSize: 20, total: null }
        }
        request({
          url: '/order',
          methods: 'get',
          params: {
            status_id: 'e665273d-5415-4243-a329-aee410e39465',
            page: page.current,
            limit: page.pageSize,
            ...date
          }
        }).then(res => {
          resolve()
          console.log(res)
          console.log(res.orders)
          console.log(page.pageSize)
          this.paginationTable = {
            current: page.current,
            pageSize: page.pageSize,
            total: parseInt(res.count)
          }
          this.shipperId = localStorage.getItem('shipper_id').replace(/['"]+/g, '')
          this.timer = res.orders ? res.orders.map(e => {
            return {
              id: e.external_order_id,
              branch_name: e.steps[0].branch_name,
              all_time: this.timeFormat((moment(e.finished_at).diff(moment(e.created_at)))),
              time1: this.findTime(e.status_notes, '1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3', 'ccb62ffb-f0e1-472e-bf32-d130bea90617'),
              time2: this.findTime(e.status_notes, this.branchReadytoCourierPickUp(e.status_notes, 'b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd'), '1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3'),
              time3: this.findTime(e.status_notes, '84be5a2f-3a92-4469-8283-220ca34a0de4', this.branchReadytoCourierPickUp(e.status_notes, 'b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd')),
              time4: this.findTime(e.status_notes, 'e665273d-5415-4243-a329-aee410e39465', '84be5a2f-3a92-4469-8283-220ca34a0de4'),
              // time4: this.findTime(e.status_notes, '84be5a2f-3a92-4469-8283-220ca34a0de4', '8781af8e-f74d-4fb6-ae23-fd997f4a2ee0'),
              // time5: this.findTime(e.status_notes, 'e665273d-5415-4243-a329-aee410e39465', '84be5a2f-3a92-4469-8283-220ca34a0de4'),
            }
          }) : []
          console.log(this.timer)
        })
      })
    },
    timeFormat (value) {
      if (value !== 0) {
        var h, m, s
        if (value >= 1000) s = value / 1000
        else s = 0
        if (s > 0) {
          m = Math.floor(s / 60)
          s = s - m * 60
        } else m = 0
        if (m > 0) {
          h = Math.floor(m / 60)
          m = m - h * 60
        } else h = 0
        return (h !== 0 ? (h + ' ' + this.$t('hour')) : '') + ' ' + (m !== 0 ? (m + ' ' + this.$t('minut')) : '') + ' ' + (s + ' ' + this.$t('sec'))
      } else return '0' + ' ' + this.$t('sec')
    },
    findTime (array, id2, id1) {
      var time1 = null
      var time2 = null
      for (var i = 0; i < array.length; i++) {
        if (array[i].status_id === id1) {
          time1 = array[i].created_at
        }
        if (array[i].status_id === id2) {
          time2 = array[i].created_at
        }
      }
      if (time1 && time2) {
        return this.timeFormat(Math.abs(moment(time2).diff(moment(time1))))
      } else return '-'
    },
    branchReadytoCourierPickUp (array, id) {
      for (var i = 0; i < array.length; i++) {
        if (id === array[i].status_id) return id
      }
      return '84be5a2f-3a92-4469-8283-220ca34a0de4'
    },
    moment
  },
  computed: {
    ...mapGetters(['branchReports', 'paginationBranchReports', 'buttonLoading']),
    mapDateRange () {
      return {
        start_date: this.mapDateRangeValue[0].format('YYYY-MM-DD') + ' 05:00:00',
        end_date: moment(this.mapDateRangeValue[1].format('YYYY-MM-DD')).add(1, 'd').format('YYYY-MM-DD') + ' 05:00:00',
        limit: 1000000,
        page: 1
      }
    },
    filteredBranches () {
      return this.branchReports.map(e => {
        return {
          admin_panel_orders_count: e.admin_panel_orders_count,
          app_orders_count: e.app_orders_count,
          bot_orders_count: e.bot_orders_count,
          name: e.name,
          total_delivery_sum: new Intl.NumberFormat().format(e.total_delivery_sum),
          total_orders_count: e.total_orders_count,
          total_sum: new Intl.NumberFormat().format(e.total_sum),
          total_sum_cash: new Intl.NumberFormat().format(e.total_sum_cash),
          total_sum_click: new Intl.NumberFormat().format(e.total_sum_click),
          total_sum_payme: new Intl.NumberFormat().format(e.total_sum_payme),
          website_orders_count: e.website_orders_count
        }
      })
    }
  },
  watch: {
    '$route': {
      handler (newVal) {
        const params = {
            limit: this.$route.query.pageSize || 100,
            start_date: this.$route.query.start_date === this.$route.query.end_date ? this.$route.query.start_date || undefined : this.$route.query.start_date,
            end_date: this.$route.query.end_date === this.$route.query.start_date ? moment(this.$route.query.end_date).add(1, 'day').format('YYYY-MM-DD') : this.$route.query.end_date || undefined,
            sort_by: this.$route.query.sort || undefined,
            sort_type: this.$route.query.branch || undefined,
            page: parseInt(this.$route.query.current || 1),
            source: this.$route.query.source || undefined,
            payment_type: this.$route.query.payment_type || undefined,
            delivery_type: this.$route.query.delivery_type || undefined,
            aggregator_id: this.$route.query.aggregator_id || undefined,
            customer_id: this.$route.query.customer_id || undefined,
            courier_id: this.$route.query.courier_id || undefined,
            branch_ids: this.$route.query.branch_ids ? this.$route.query.branch_ids : undefined,
            range_time_from: this.$route.query.rarange_time_from,
            range_time_to: this.$route.query.range_time_to,
          }
        if (this.activTab === '4' || this.activTab === '9') {
          Object.keys(this.filter).map(key => {
            if (key === 'branch_ids') {
              this.filter.branch_ids = this.$route.query.branch_ids ? this.$route.query.branch_ids.split(',') : undefined
            } else if (params[key]) {
              this.filter[key] = params[key]
            }
          })
          this.getAllReports(params)
          console.log(params)
        } else if (this.activTab === '6') {
          this.getReportsWithDelayed(params)
        }
      },
      deep: true
    },
    dateDay (val) {
      if (val === null) {
        this.loadTable = true
        this.getAllOrders(
          undefined,
          this.nowReport('day')
        ).then(res => {
          this.loadTable = false
        })
        return
      }
      var startDate = val + ' ' + '05:00:00'
      var tomorrow = new Date(val)
      tomorrow.setDate(tomorrow.getDate() + 1)
      var endDate = moment(tomorrow).format(this.dateFormat) + ' ' + '05:00:00'
      this.infoDate = val + ' ' + '--' + ' ' + moment(tomorrow).format(this.dateFormat)
      console.log(startDate, endDate)
      this.loadTable = true
      this.allTime = {
          start_date: startDate,
          end_date: endDate
        }
      this.getAllOrders(
        undefined,
        {
          start_date: startDate,
          end_date: endDate
        }
      ).then(res => {
        this.loadTable = false
      })
    },
    activTab (val) {
      this.$router.replace({ query: { ...this.$route.query, 'current': 1 } })
      // this.paginationOrderReports.current = 1
      const params = {
        limit: this.$route.query.pageSize || 100,
        start_date: this.$route.query.start_date === this.$route.query.end_date ? this.$route.query.start_date || undefined : this.$route.query.start_date,
        end_date: this.$route.query.end_date === this.$route.query.start_date ? moment(this.$route.query.end_date).add(1, 'day').format('YYYY-MM-DD') : this.$route.query.end_date || undefined,
        sort_by: this.$route.query.sort || undefined,
        sort_type: this.$route.query.branch || undefined,
        page: parseInt(this.$route.query.current || 1),
        source: this.$route.query.source || undefined,
        payment_type: this.$route.query.payment_type || undefined,
        delivery_type: this.$route.query.delivery_type || undefined,
        aggregator_id: this.$route.query.aggregator_id || undefined,
        customer_id: this.$route.query.customer_id || undefined,
        courier_id: this.$route.query.courier_id || undefined,
        branch_ids: this.$route.query.branch_ids ? this.$route.query.branch_ids : undefined,
        range_time_from: this.$route.query.rarange_time_from,
        range_time_to: this.$route.query.range_time_to,
      }
      if (this.activTab === '4' || this.activTab === '9') {
          Object.keys(this.filter).map(key => {
            if (key === 'branch_ids') {
              this.filter.branch_ids = this.$route.query.branch_ids ? this.$route.query.branch_ids.split(',') : undefined
            } else if (params[key]) {
              this.filter[key] = params[key]
            }
          })
          this.getAllReports(params)
          console.log(params)
        } else if (this.activTab === '6') {
          this.getReportsWithDelayed(params)
        }
    }
    // dateMonth (val) {
    //   if (val === null) {
    //     this.loadTable = true
    //     this.getBranchReports(
    //       this.nowReport('month')
    //     ).then(res => {
    //       this.loadTable = false
    //     })
    //     return
    //   }
    //   var startDate = val + '-' + '01' + ' ' + '05:00:00'
    //   var thisMonth = new Date(val)
    //   thisMonth.setMonth(thisMonth.getMonth() + 1)
    //   var endDate = moment(thisMonth).format(this.monthFormat) + '-' + '01' + ' ' + '05:00:00'
    //   this.infoDate = val + ' ' + '--' + ' ' + moment(thisMonth).format(this.monthFormat)
    //   console.log(startDate, endDate)
    //   this.loadTable = true
    //   this.getBranchReports({
    //     start_date: startDate,
    //     end_date: endDate
    //   }).then(res => {
    //     this.loadTable = false
    //   })
    // }
  },
  created () {
    this.startDay = moment()
    this.endDay = moment().add(1, 'd')
    console.log(this.startDay, this.endDay)
    if (this.$route.query.toDay) {
      // this.dateDay = this.$route.query.toDay
      // this.activTab = this.$route.query.activTab
      if (this.$route.query.toDay.length > 11) {
        this.activTab = '3'
        console.log(this.$route.query.toDay.split('/')[0], this.$route.query.toDay.split('/')[1])
        this.startDay = this.$route.query.toDay.split('/')[0]
        this.endDay = this.$route.query.toDay.split('/')[1]
        console.log(this.startDate, this.endDate)
        this.customReport()
      } else {
        this.activTab = '1'
        this.dateDay = this.$route.query.toDay
      }
    }

        this.loadTable = true
        this.getAllOrders(
          undefined,
          this.nowReport('day')
        ).then(res => {
          this.loadTable = false
        })

    const params = {
      start_date: this.$route.query.start_date || undefined,
      end_date: this.$route.query.end_date || undefined,
      page: parseInt(this.$route.query.current || 1),
      source: this.$route.query.source || undefined,
      payment_type: this.$route.query.payment_type || undefined,
      delivery_type: this.$route.query.delivery_type || undefined,
      aggregator_id: this.$route.query.aggregator_id || undefined,
      customer_id: this.$route.query.customer_id || undefined,
      courier_id: this.$route.query.courier_id || undefined,
      branch_ids: this.$route.query.branch_ids || undefined,
      range_time_from: this.$route.query.range_time_from,
      range_time_to: this.$route.query.range_time_to,
      limit: 100
    }
    Object.keys(this.filter).map(key => {
      if (key === 'branch_ids') {
        this.filter.branch_ids = this.$route.query.branch_ids && this.$route.query.branch_ids.split(',') || undefined
      } else if (params[key]) {
        this.filter[key] = params[key]
      }
    })
    this.getAllReports(params)
    this.getReportsWithDelayed(params)
    this.getAggregators()
    this.getBranches()
    this.customersGetAll()
    this.couriersGetAll()
  }
}
</script>
