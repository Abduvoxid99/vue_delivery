
import { i18nRender } from '@/locales/index'

export const columns = [
  {
    key: 'row-number',
    width: 60,
    title: '№',
    dataIndex: 'No',
  },
  {
    key: 'name',
    width: 150,
    title: i18nRender('firstName'),
    dataIndex: i18nRender('firstName'),
    sorter: (a, b) => {
      if (a[i18nRender('firstName')] < b[i18nRender('firstName')]) return -1
      if (a[i18nRender('firstName')] > b[i18nRender('firstName')]) return 1
      return 0
    },
  },
  {
    key: 'total_orders_count',
    width: 140,
    align: 'center',
    title: i18nRender('total_orders_count'),
    dataIndex: i18nRender('total_orders_count'),
    sorter: (a, b) => a[i18nRender('total_orders_count')] - b[i18nRender('total_orders_count')],
  },
  {
    key: 'total_sum',
    width: 140,
    align: 'center',
    title: i18nRender('total_sum'),
    dataIndex: i18nRender('total_sum'),
    sorter: (a, b) => a[i18nRender('total_sum')] - b[i18nRender('total_sum')],
  },
  {
    key: 'avg_order_time',
    width: 200,
    align: 'center',
    title: i18nRender('avg_order_time'),
    dataIndex: i18nRender('avg_order_time'),
    sorter: (a, b) => parseInt(a[i18nRender('avg_order_time')]) - parseInt(b[i18nRender('avg_order_time')]),
  },
  {
    key: 'avg_sum',
    width: 200,
    align: 'center',
    title: i18nRender('avg_sum'),
    dataIndex: i18nRender('avg_sum'),
    sorter: (a, b) => a[i18nRender('avg_sum')] - b[i18nRender('avg_sum')],
  },
  {
    key: 'total_count_delivery',
    width: 140,
    align: 'center',
    title: i18nRender('total_count_delivery'),
    dataIndex: i18nRender('total_count_delivery'),
    sorter: (a, b) => a[i18nRender('total_count_delivery')] - b[i18nRender('total_count_delivery')],
  },
  {
    key: 'total_sum_delivery',
    width: 140,
    align: 'center',
    title: i18nRender('total_sum_delivery'),
    dataIndex: i18nRender('total_sum_delivery'),
    sorter: (a, b) => a[i18nRender('total_sum_delivery')] - b[i18nRender('total_sum_delivery')],
  },
  {
    key: 'avg_sum_delivery',
    width: 140,
    align: 'center',
    title: i18nRender('avg_sum_delivery'),
    dataIndex: i18nRender('avg_sum_delivery'),
    sorter: (a, b) => a[i18nRender('avg_sum_delivery')] - b[i18nRender('avg_sum_delivery')],
  },
  {
    key: 'count_self_call',
    width: 140,
    align: 'center',
    title: i18nRender('count_self_call'),
    dataIndex: i18nRender('count_self_call'),
    sorter: (a, b) => a[i18nRender('count_self_call')] - b[i18nRender('count_self_call')],
  },
  {
    key: 'sum_self_call',
    width: 140,
    align: 'center',
    title: i18nRender('sum_self_call'),
    dataIndex: i18nRender('sum_self_call'),
    sorter: (a, b) => a[i18nRender('sum_self_call')] - b[i18nRender('sum_self_call')],
  },
  {
    key: 'avg_self_call',
    width: 140,
    align: 'center',
    title: i18nRender('avg_self_call'),
    dataIndex: i18nRender('avg_self_call'),
    sorter: (a, b) => a[i18nRender('avg_self_call')] - b[i18nRender('avg_self_call')],
  },
  {
    key: 'admin',
    width: 100,
    align: 'center',
    title: i18nRender('admin'),
    dataIndex: i18nRender('admin'),
    sorter: (a, b) => a[i18nRender('admin')] - b[i18nRender('admin')],
  },
  {
    key: 'app',
    width: 80,
    align: 'center',
    title: i18nRender('app'),
    dataIndex: i18nRender('app'),
    sorter: (a, b) => a[i18nRender('app')] - b[i18nRender('app')],
  },
  {
    key: 'telegram_bot',
    width: 140,
    align: 'center',
    title: i18nRender('telegram_bot'),
    dataIndex: i18nRender('telegram_bot'),
    sorter: (a, b) => a[i18nRender('telegram_bot')] - b[i18nRender('telegram_bot')],
  },
  {
    key: 'site',
    width: 90,
    align: 'center',
    title: i18nRender('site'),
    dataIndex: i18nRender('site'),
    sorter: (a, b) => a[i18nRender('site')] - b[i18nRender('site')],
  },
]
