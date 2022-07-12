import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import reportsMin from './modules/reportMain'
import CurierReport from './modules/curierReportTable'
import branchReportNew from '@/store/modules/branchReportListNew'

// default router permission control
import permission from './modules/permission'

// orders module
import orders from './modules/orders'
import courierType from '@/store/modules/courierType'
import branches from './modules/branches'
import products from './modules/products'
import couriers from './modules/couriers'
import clients from './modules/clients'
import productKinds from './modules/product-kinds'
import categories from './modules/categories'
import systemUsers from './modules/system-users'
import operatorReports from './modules/operator-report'
import branchReports from './modules/branch-report'
import shipperReports from './modules/shipper-report'
import courierReports from './modules/courier_report'
import productReports from './modules/product-report'
import cabinet from './modules/cabinet'
import customers from './modules/customer'
import dashboard from '@/store/modules/dashboard'
import courierLocations from '@/store/modules/courierLocations'
import role from './modules/role'
import branchUsers from '@/store/modules/branch-users'
import promo from '@/store/modules/promo'
import upload from '@/store/modules/upload'
import telegramPost from '@/store/modules/telegram_post'
import newOrder from '@/store/modules/new-order'
import banner from '@/store/modules/banner'
import click from '@/store/modules/click'
import getters from './getters'
import payme from '@/store/modules/payme'
import tariff from '@/store/modules/tariff'
import personalReport from '@/store/modules/personal_report'
import instruction from '@/store/modules/instruction'
import reviews from '@/store/modules/reviews'
import crm from '@/store/modules/crm'
import iiko from '@/store/modules/iiko'
import jowi from '@/store/modules/jowi'
import geozone from '@/store/modules/geozone'
import deliveryTimeReport from '@/store/modules/deliveryTimeReport'
import webSocket from '@/store/modules/socket'
import aggregator from '@/store/modules/aggregator'
import clientreport from './modules/clientReport'
import OperatorList from './modules/OperatorList'
import cancelingReasons from './modules/cancelingReasons'
import finishingReasons from './modules/finishingReasons'
import billingTarif from './modules/billing_tariffs'
import transactions from './modules/transactions'
import shipperBalance from './modules/shipper_balance'
import notification from './modules/notification'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    courierType,
    clientreport,
    billingTarif,
    transactions,
    shipperBalance,
    OperatorList,
    branchReportNew,
    reportsMin,
    CurierReport,
    banner,
    products,
    couriers,
    geozone,
    customers,
    dashboard,
    reviews,
    crm,
    iiko,
    jowi,
    click,
    role,
    clients,
    user,
    cabinet,
    newOrder,
    instruction,
    orders,
    branches,
    branchUsers,
    productKinds,
    productReports,
    categories,
    systemUsers,
    operatorReports,
    courierReports,
    branchReports,
    shipperReports,
    permission,
    courierLocations,
    promo,
    upload,
    payme,
    telegramPost,
    tariff,
    personalReport,
    deliveryTimeReport,
    webSocket,
    aggregator,
    cancelingReasons,
    finishingReasons,
    notification
  },
  state: {
    crm_type: localStorage.getItem('crm') || ''
  },
  mutations: {
    SET_CRM_TYPE (state, payload) {
      state.crm_type = payload
    }
  },
  actions: {

  },
  getters
})
