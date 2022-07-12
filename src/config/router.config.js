// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
import myIcons from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view'),
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/dashboard',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/NewDashboard'),
        hideChildrenInMenu: true,
        meta: { title: 'dashboard', keepAlive: true, icon: myIcons.bxAnaalyse, permission: ['dashboard'] },
        children: [
          {
            path: '/dashboard/workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/Workplace'),
            meta: { title: 'menu.dashboard.workplace', keepAlive: true, permission: ['dashboard'] },
          },
        ],
      },
      {
        path: '/clients',
        name: 'clients',
        component: () => import('@/views/customers/CustomerList'),
        hideChildrenInMenu: true,
        meta: { title: 'clients', keepAlive: true, icon: 'team', permission: ['client'] },
        children: [],
      },
      {
        path: '/calls/new',
        name: 'ClientsView',
        component: () => import('@/views/customers/CustomerContact'),
        hideChildrenInMenu: true,
        hidden: true,
        meta: { title: 'Client View', keepAlive: true, icon: 'team', permission: ['client'] },
        children: [],
      },
      {
        path: '/orders',
        name: 'newOrder',
        component: RouteView,
        hideChildrenInMenu: true,
        redirect: '/orders/main',
        meta: { title: 'orders', keepAlive: true, icon: 'shop', permission: ['order'] },
        children: [
          {
            path: '/orders/main',
            name: 'MainNewOrders',
            hideChildrenInMenu: true,
            component: () => import('@/views/orderNew/main'),
            // redirect: '/orders/new',
            meta: { title: 'orders', keepAlive: true, permission: ['order'] }
          },
          // {
          //   path: '/new_order/edit/:id',
          //   name: 'OrdersEdit',
          //   component: () => import('@/views/orderNew/OrderEditNew'),
          //   meta: { title: 'all', keepAlive: true, permission: ['order'] },
          // },
          // {
          //   path: '/new_order/create',
          //   name: 'OrderCreateNew',
          //   component: () => import('@/views/orderNew/OrderCreateNew'),
          //   meta: { title: 'createOrder', keepAlive: true, permission: ['order'] },
          // },
          {
            path: '/orders/create',
            name: 'Order',
            component: () => import('@/views/orderNew/orderCreation/order'),
            meta: { title: 'createOrder', keepAlive: true, permission: ['order'] },
          },
          {
            path: '/orders/edit/:id',
            name: 'OrderEditNew',
            component: () => import('@/views/orderNew/orderCreation/order'),
            meta: { title: 'orderEdit', keepAlive: true, permission: ['order'] },
          },
          {
            path: '/orders/payment',
            name: 'OrderPayment',
            component: () => import('@/views/orderNew/Payment'),
            meta: { title: 'orderPayment', keepAlive: true, permission: ['order'] },
          },
        ]
      },
      {
        path: '/catalog',
        redirect: '/catalog/categories',
        component: RouteView,
        meta: { title: 'catalog', icon: 'form', permission: ['catalog'] },
        children: [
          {
            path: '/catalog/categories',
            hideChildrenInMenu: true,
            name: 'CategoriesList',
            component: RouteView,
            redirect: '/catalog/categories/list',
            meta: { title: 'categories', keepAlive: true, permission: ['category'] },
            children: [
              {
                path: '/catalog/categories/list',
                name: 'CategoriesListMain',
                props: true,
                component: () => import('@/views/categories/CategoriesList'),
                meta: { title: 'categories', keepAlive: true, permission: ['category'] },
              },
              {
                path: '/catalog/categories/create',
                name: 'CategoriesCreate',
                props: true,
                component: () => import('@/views/categories/CategoriesCreate'),
                meta: { title: 'categories', keepAlive: true, permission: ['category'] },
              },
              {
                path: '/catalog/categories/update/:id',
                name: 'CatagoriesUpdate',
                props: true,
                component: () => import('@/views/categories/CategoriesCreate'),
                meta: { title: 'categories', keepAlive: true, permission: ['category'] },
              },
            ],
          },
          {
            path: '/catalog/products',
            hideChildrenInMenu: true,
            name: 'Product',
            component: RouteView,
            redirect: '/catalog/products/list',
            meta: { title: 'products', keepAlive: true, permission: ['product'] },
            children: [
              {
                path: '/catalog/products/list',
                name: 'CatagoriesProductsList',
                component: () => import('@/views/products/ProductsList'),
                meta: { title: 'products', keepAlive: true, permission: ['product'] },
              },
              {
                path: '/catalog/products/create',
                name: 'CatagoriesProductsCreate',
                component: () => import('@/views/products/ProductsCreate'),
                meta: { title: 'products', keepAlive: true, permission: ['product'] },
              },
              {
                path: '/catalog/products/update/:id',
                name: 'CatagoriesProductsUpdate',
                component: () => import('@/views/products/ProductsCreate'),
                meta: { title: 'products', keepAlive: true, permission: ['product'] },
              },
              // {
              //   path: '/test',
              //   name: 'CatagoriesProductsUpdate',
              //   component: () => import('@/views/test'),
              //   meta: { title: 'categories', keepAlive: true, permission: ['product'] },
              // },
            ],
          },
        ],
      },
      {
        path: '/personal',
        redirect: '/personal/branches',
        component: RouteView,
        meta: { title: 'personal', icon: 'cluster', permission: ['personal'] },
        children: [
          {
            path: '/personal/branches',
            name: 'branches',
            component: RouteView,
            hideChildrenInMenu: true,
            redirect: '/personal/branches/list',
            meta: { title: 'branches', keepAlive: true, icon: 'shop', permission: ['branch'] },
            children: [
              {
                path: '/personal/branches/list',
                name: 'BranchList',
                component: () => import('@/views/branches/BranchesList'),
                meta: { title: 'branches', keepAlive: true, permission: ['branch'] },
              },
              {
                path: '/personal/branch_user',
                name: 'BranchUser',
                component: RouteView,
                redirect: '/personal/branch_user/list',
                meta: { title: 'branch_user', keepAlive: true, permission: ['branch'] },
                children: [
                  {
                    path: '/personal/branches/list/:branchId',
                    name: 'BranchUserList',
                    component: () => import('@/views/branch-users/BranchUserList'),
                    meta: { title: 'branch_user', keepAlive: true, permission: ['branch'] },
                  },
                ]
              },
              {
                path: '/personal/branches/update/:id',
                name: 'BranchUpdate',
                component: () => import('@/views/branches/BranchCreateNew'),
                meta: { title: 'branches', keepAlive: true, permission: ['branch'] },
              },
              {
                path: '/personal/branches/create',
                name: 'BranchCreate',
                component: () => import('@/views/branches/BranchCreateNew'),
                meta: { title: 'branches', keepAlive: true, permission: ['branch'] },
              }
            ],
          },
          {
            path: '/personal/system-users',
            name: 'system-users',
            component: RouteView,
            hideChildrenInMenu: true,
            redirect: '/personal/system-users/list',
            meta: { title: 'operators', keepAlive: true, icon: 'user', permission: ['operator'] },
            children: [
              {
                path: '/personal/system-users/list',
                name: 'UsersList',
                component: () => import('@/views/system-users/UsersList'),
                meta: { title: 'operators', keepAlive: true, permission: ['operator'] },
              },
              {
                path: '/personal/system-users/update/:id',
                name: 'UsersUpdate',
                component: () => import('@/views/system-users/UsersCreate'),
                meta: { title: 'operators', keepAlive: true, permission: ['operator'] },
              },
              {
                path: '/personal/system-users/create',
                name: 'BranchCreate-s',
                component: () => import('@/views/system-users/UsersCreate'),
                meta: { title: 'operators', keepAlive: true, permission: ['operator'] },
              },
            ],
          },
          {
            path: '/personal/couriers',
            name: 'couriers',
            component: RouteView,
            hideChildrenInMenu: true,
            redirect: '/personal/couriers/list',
            meta: { title: 'couriers', keepAlive: true, icon: 'car', permission: ['courier'] },
            children: [
              {
                path: '/personal/couriers/list',
                name: 'CourierList',
                component: () => import('@/views/couriers/CourierList'),
                meta: { title: 'couriers', keepAlive: true, permission: ['courier'] },
              },
              {
                path: '/personal/couriers/create',
                name: 'CourierCreate',
                component: () => import('@/views/couriers/CourierCreate'),
                meta: { title: 'couriers', keepAlive: true, permission: ['courier'] },
              },
              {
                path: '/personal/couriers/edit/:id',
                name: 'CourierEdit',
                component: () => import('@/views/couriers/CourierCreate'),
                meta: { title: 'couriers', keepAlive: true, permission: ['courier'] },
              },
              {
                path: '/personal/couriers/transactions/:id',
                name: 'CourierTransactions',
                component: () => import('@/views/couriers/CourierTransaction'),
                meta: { title: 'couriers', keepAlive: true, permission: ['courier'] },
              },
            ],
          },
          {
            path: '/personal/couriers_type',
            name: 'couriersType',
            component: RouteView,
            hideChildrenInMenu: true,
            redirect: '/personal/couriers_type/list',
            meta: { title: 'couriers_type', keepAlive: true, icon: 'team', permission: ['courier'] },
            children: [
              {
                path: '/personal/couriers_type/list',
                name: 'CourierTypeList',
                component: () => import('@/views/couriers/courierType/CourierTypeList'),
                meta: { title: 'couriers_type', keepAlive: true, permission: ['courier'] },
              },
              {
                path: '/personal/couriers_type/create',
                name: 'CourierTypeCreate',
                component: () => import('@/views/couriers/courierType/CourierTypeCreate'),
                meta: { title: 'couriers_type', keepAlive: true, permission: ['courier'] },
              },
              {
                path: '/personal/couriers_type/edit/:id',
                name: 'CourierTypeEdit',
                component: () => import('@/views/couriers/courierType/CourierTypeCreate'),
                meta: { title: 'couriers_type', keepAlive: true, permission: ['courier'] },
              },
            ],
          }
        ]
      },
      {
        path: '/content',
        name: 'Promotions',
        component: RouteView,
        meta: { title: 'content', keepAlive: true, icon: 'star', permission: ['promotion'] },
        children: [
          {
            path: '/content/promo',
            name: 'PromotionsPromo',
            component: RouteView,
            hideChildrenInMenu: true,
            redirect: '/promotions/promo/list',
            meta: { title: 'promotions', keepAlive: true, permission: ['promotion'] },
            children: [
              {
                path: '/promotions/promo/list',
                name: 'PromotionsPromoList',
                component: () => import('@/views/promotions/PromotionsList'),
                meta: { title: 'promotions', keepAlive: true, permission: ['promotion'] },
              }
            ]
          },
          {
            path: '/content/reviews',
            name: 'ReviewContent',
            component: RouteView,
            hideChildrenInMenu: true,
            redirect: '/content/reviews/list',
            meta: { title: 'Отзывы', keepAlive: true, permission: ['promotion'] },
            children: [
              {
                path: '/content/reviews/list',
                name: 'ReviewContentList',
                component: () => import('@/views/reviews'),
                meta: { title: 'Reviews', keepAlive: true, permission: ['promotion'] },
              },
              {
                path: '/content/user-reviews/list',
                name: 'UserReviewList',
                component: () => import('@/views/reviews/ReviewList'),
                meta: { title: 'Reviews', keepAlive: true, permission: ['promotion'] },
              },
              {
                path: '/content/reviews/new',
                name: 'ReviewContentNew',
                hidden: true,
                component: () => import('@/views/reviews/Form'),
                meta: { title: 'Reviews new', keepAlive: true, permission: ['promotion'] },
              },
              {
                path: '/content/reviews/:id',
                name: 'ReviewContentedit',
                hidden: true,
                component: () => import('@/views/reviews/Form'),
                meta: { title: 'Reviews edit', keepAlive: true, permission: ['promotion'] },
              }
            ]
          },
          {
            path: '/content/banner',
            name: 'Banner',
            component: RouteView,
            hideChildrenInMenu: true,
            redirect: '/content/banner/list',
            meta: { title: 'banners', keepAlive: true, permission: ['promotion'] },
            children: [
              {
                path: '/content/banner/list',
                name: 'BannersList',
                component: () => import('@/views/banner/BannerList'),
                meta: { title: 'banners.list', keepAlive: true, permission: ['promotion'] },
              }
            ]
          },
          {
            path: '/content/sms',
            name: 'Sms',
            component: RouteView,
            hideChildrenInMenu: true,
            redirect: '/content/sms/list',
            meta: { title: 'Sms', keepAlive: true, permission: ['promotion'] },
            children: [
              {
                path: '/content/sms/list',
                name: 'SmsList',
                component: () => import('@/views/sms/index.vue'),
                meta: { title: 'Sms list', keepAlive: true, permission: ['promotion'] },
              }
            ]
          },
          {
            path: '/content/telegram_post',
            name: 'TelegramPost',
            component: RouteView,
            hideChildrenInMenu: true,
            redirect: '/content/telegram_post/list',
            meta: { title: 'Telegram Пост', keepAlive: true, permission: ['promotion'] },
            children: [
              {
                path: '/content/telegram_post/list',
                name: 'TelegramPostList',
                component: () => import('@/views/telegram_post/PostList'),
                meta: { title: 'Telegram Пост', keepAlive: true, permission: ['promotion'] },
              },
              {
                path: '/content/telegram_post/create',
                name: 'TelegramPostCreate',
                component: () => import('@/views/telegram_post/PostCreate'),
                meta: { title: 'Telegram Пост', keepAlive: true, permission: ['promotion'] },
              }
            ]
          },
          {
            path: '/content/notification',
            name: 'NotificationPost',
            component: RouteView,
            hideChildrenInMenu: true,
            redirect: '/content/notification/list',
            meta: { title: 'Уведомление Пост', keepAlive: true, permission: ['promotion'] },
            children: [
              {
                path: '/content/notification/list',
                name: 'NotificationPostList',
                component: () => import('@/views/Notification/NotificationList'),
                meta: { title: 'Уведомление Пост', keepAlive: true, permission: ['promotion'] },
              },
              {
                path: '/content/notification/create',
                name: 'NotificationPostList',
                component: () => import('@/views/Notification/NotificationPost'),
                meta: { title: 'Уведомление Пост', keepAlive: true, permission: ['promotion'] },
              }
            ]
          },
          {
            path: '/content/canceling-reasons',
            name: 'reasons.of.canceling',
            component: RouteView,
            hideChildrenInMenu: true,
            redirect: '/content/canceling-reasons/list',
            meta: { title: 'reasons.of.canceling', keepAlive: true, permission: ['promotion'] },
            children: [
              {
                path: '/content/canceling-reasons/list',
                name: 'CancelingReasonsList',
                component: () => import('@/views/cancelingReasons/List'),
                meta: { title: 'List', keepAlive: true, permission: ['promotion'] },
              },
              {
                path: '/content/canceling-reasons/create',
                name: 'CancelingReasonsCreate',
                component: () => import('@/views/cancelingReasons/Create'),
                meta: { title: 'Create', keepAlive: true, permission: ['promotion'] },
              }
            ]
          },
          {
            path: '/content/finishing-reasons',
            name: 'reasons.of.finishing',
            component: RouteView,
            hideChildrenInMenu: true,
            redirect: '/content/finishing-reasons/list',
            meta: { title: 'reasons.of.finishing', keepAlive: true, permission: ['promotion'] },
            children: [
              {
                path: '/content/finishing-reasons/list',
                name: 'EndingReasonsList',
                component: () => import('@/views/finishingReasons/List'),
                meta: { title: 'List', keepAlive: true, permission: ['promotion'] },
              },
              {
                path: '/content/finishing-reasons/create',
                name: 'EndingReasonsCreate',
                component: () => import('@/views/finishingReasons/Create'),
                meta: { title: 'Create', keepAlive: true, permission: ['promotion'] },
              }
            ]
          }
        ]
      },
      {
        path: '/reports',
        name: 'reports',
        redirect: '/reports/operators',
        component: RouteView,
        meta: { title: 'reports', icon: 'container', permission: ['report'] },
        children: [
          // {
          //   path: '/reports/shipper',
          //   hideChildrenInMenu: true,
          //   name: 'ShipperReport',
          //   component: () => import('@/views/reports/ShipperReportNew'),
          //   meta: { title: 'shipperReports', keepAlive: true, permission: ['report'] },
          // },
          {
            path: '/report/main',
            hideChildrenInMenu: true,
            name: 'ReportMain',
            redirect: '/report/main/list',
            component: RouteView,
            meta: { title: 'ReportsMian', keepAlive: true, permission: ['report'] },
            children: [
              {
                path: '/report/main/list',
                hideChildrenInMenu: true,
                name: 'ReportMainList',
                component: () => import('@/views/reports/ReportMain'),
                meta: { title: 'ReportsMian', keepAlive: true, permission: ['report'] }
              },
              {
                path: '/report/main/orderList',
                hideChildrenInMenu: true,
                name: 'OrderListMainReport',
                component: () => import('@/views/reports/OrderListMainReport'),
                meta: { title: 'ReportsMian', keepAlive: true, permission: ['report'] },
              }
            ]
          },
          {
            path: '/reports/operators',
            hideChildrenInMenu: true,
            name: 'OperatorReportList',
            redirect: '/reports/operators/list',
            component: RouteView,
            // component: () => import('@/views/reports/OperatorReportNew/Index'),
            meta: { title: 'operatorReports', keepAlive: true, permission: ['operator_report'] },
            children: [
              {
                path: '/reports/operators/list',
                hideChildrenInMenu: true,
                name: 'OperatorReport',
                component: () => import('@/views/reports/OperatorReportNew/Index'),
                meta: { title: 'operatorReports', keepAlive: true, permission: ['operator_report'] }

              },
              {
                path: '/reports/operators/list/item',
                hideChildrenInMenu: true,
                name: 'OperatorReportItem',
                component: () => import('@/views/reports/OperatorReportNew/ReportOperatorListItem'),
                meta: { title: 'operatorReports', keepAlive: true, permission: ['operator_report'] }

              }
            ]
          },
          {
            path: '/reports/branches',
            hideChildrenInMenu: true,
            name: 'BranchReport',
            redirect: '/report/branchs/list',
            component: RouteView,
            // component: () => import('@/views/reports/BranchReportNew'),
            meta: { title: 'branchReports', keepAlive: true, permission: ['branch_report'] },
            children: [
              {
                path: '/report/branchs/list',
              hideChildrenInMenu: true,
              name: 'ReportBranchLists',
              component: () => import('@/views/reports/BranchReportNew'),
              meta: { title: 'branchReports', keepAlive: true, permission: ['branch_report'] },

            },
              {
                path: '/report/branch/list',
                hideChildrenInMenu: true,
                name: 'BranchReportNews',
                component: () => import('@/views/reports/branchReportNewTable/BranchReportNews'),
                meta: { title: 'branchReports', keepAlive: true, permission: ['branch_report'] },
              }
            ]
          },
          {
            path: '/reports/couriers',
            hideChildrenInMenu: true,
            name: 'CourierReport',
            redirect: '/report/courier/list',
            component: RouteView,
            // component: () => import('@/views/reports/CourierReport'),
            meta: { title: 'courierReport', keepAlive: true, permission: ['report_courier'] },
            children: [{
              path: '/report/courier/list',
              hideChildrenInMenu: true,
              name: 'CourierReportList',
              // component: RouteView,
              component: () => import('@/views/reports/CourierReport'),
              meta: { title: 'courierReport', keepAlive: true, permission: ['report_courier'] },

            },
              {
                path: '/report/courier/item',
                hideChildrenInMenu: true,
                name: 'CourierReportListItem',
                // component: RouteView,
                component: () => import('@/views/reports/courierReport/courierReportItem'),
                meta: { title: 'courierReport', keepAlive: true, permission: ['report_courier'] },

              }
            ]
          },
          {
            path: '/reports/dashboard',
            hideChildrenInMenu: true,
            name: 'sds',
            redirect: '/report/dashboard/list',
            component: RouteView,
            meta: { title: 'Отчет по дашборду', keepAlive: true, permission: ['report_courier'] },
            children: [
              {
                path: '/report/dashboard/list',
                hideChildrenInMenu: true,
                name: 'ReportDashboardList',
                // component: RouteView,
                component: () => import('@/views/reports/branchReportCourierReport'),
                meta: { title: 'Отчет по дашборду', keepAlive: true, permission: ['report_courier'] },
              }
            ]
          },
          {
            path: '/reports/products',
            hideChildrenInMenu: true,
            name: 'productReport',
            component: () => import('@/views/reports/ProductReport'),
            meta: { title: 'productReport', keepAlive: true, permission: ['report_product'] },
          },
          {
            path: '/reports/reviews',
            hideChildrenInMenu: true,
            name: 'reviewReport',
            component: () => import('@/views/reviews/ReviewListNew'),
            meta: { title: 'reviewReport', keepAlive: true, permission: ['report'] },
          },
          {
            path: 'oreder/list',
            hideChildrenInMenu: true,
            name: 'OrderReport',
            component: () => import('@/views/reports/OrderReportNew'),
            meta: { title: 'orderReport', keepAlive: true, permission: ['order_report'] },
          },
          {
            path: 'oreder/aggregator-list',
            hideChildrenInMenu: true,
            name: 'Aggregator-list',
            component: () => import('@/views/reports/AggregatorReport'),
            meta: { title: 'orderaggReport', keepAlive: true, permission: ['order_report'] }, // need to be checkd permission !
          },
          {
            path: '/reports/status-times',
            hideChildrenInMenu: true,
            name: 'StatusTimeReport',
            component: () => import('@/views/reports/StatusTimeReport'),
            meta: { title: 'statusReport', keepAlive: true, permission: ['order_status_report'] },
          },
          {
            path: '/reports/delivery-times',
            hideChildrenInMenu: true,
            name: 'DeliveryTimeReports',
            redirect: '/report/delivery-times/list',
            component: RouteView,
            // component: () => import('@/views/reports/DeliveryTimeReport'),
            meta: { title: 'reports.by.delivery.time', keepAlive: true, permission: ['order_status_report'] },
            children: [
              {
                path: '/report/delivery-times/list',
                hideChildrenInMenu: true,
                name: 'DeliveryTimeReport',
                component: () => import('@/views/reports/DeliveryTimeReport'),
                meta: { title: 'courierReport', keepAlive: true, permission: ['report_courier'] },

              },
              {
                path: '/report/delivery-times/item',
                hideChildrenInMenu: true,
                name: 'ReportDelveryItem',
                component: () => import('@/views/reports/reportDeleverTimes/reportDeleverTime'),
                meta: { title: 'courierReport', keepAlive: true, permission: ['report_courier'] },

              }
            ]
          },
          {
            path: '/reports/forecasting',
            hideChildrenInMenu: true,
            name: 'ReportForecasring',
            redirect: '/report/forecasting',
            component: RouteView,
            // component: () => import('@/views/reports/DeliveryTimeReport'),
            meta: { title: 'reports.by.forecasting', keepAlive: true, permission: ['order_status_report'] },
            children: [
              {
                path: '/report/forecasting',
                hideChildrenInMenu: true,
                name: 'ReportForecasring',
                component: () => import('@/views/reports/Forecasting'),
                meta: { title: 'courierReport', keepAlive: true, permission: ['report_courier'] },

              },
              // {
              //   path: '/report/forecasting',
              //   hideChildrenInMenu: true,
              //   name: 'ReportDelveryItem',
              //   component: () => import('@/views/reports/reportDeleverTimes/reportDeleverTime'),
              //   meta: { title: 'courierReport', keepAlive: true, permission: ['report_courier'] },

              // }
            ]
          },
          {
            path: '/reports/client',
            hideChildrenInMenu: true,
            name: 'ClientReports',
            redirect: '/reports/clients/list',
            component: RouteView,
            // component: () => import('@/views/reports/DeliveryTimeReport'),
            meta: { title: 'clientreport', keepAlive: true, permission: ['order_status_report'] },
            children: [
              {
                path: '/reports/clients/list',
                hideChildrenInMenu: true,
                name: 'ClientReportList',
                component: () => import('@/views/reports/ClientReport/ClientReportList'),
                meta: { title: 'clientreport', keepAlive: true, permission: ['report_courier'] },

              },
              {
                path: '/reports/client/list',
                hideChildrenInMenu: true,
                name: 'ReportClientItemTable',
                component: () => import('@/views/reports/ClientReport/ClinetItemTable'),
                meta: { title: 'courierReport', keepAlive: true, permission: ['report_courier'] },

              }
            ]
          },
        ],
      },
      {
        path: '/tracking',
        name: 'Tracking',
        hidden: true,
        component: () => import('@/views/tracking/tracking'),
        meta: { title: 'map', keepAlive: true, icon: 'table', permission: ['map_tracking'] },
      },
      {
        path: '/setting',
        redirect: '/setting/payme',
        component: RouteView,
        meta: { title: 'setting', icon: 'form', permission: ['payme', 'role_permission'] },
        children: [
          {
            path: '/setting/tariff',
            name: 'Tariff',
            redirect: '/setting/tariff/list',
            component: RouteView,
            hideChildrenInMenu: true,
            meta: { title: 'fares', keepAlive: true, icon: 'dollar', permission: ['tariff'] },
            children: [
              {
                path: '/setting/tariff/list',
                name: 'TariffPage-list-only',
                component: () => import('@/views/tariff/TariffList'),
                meta: { title: 'fares', keepAlive: true, permission: ['tariff'] },
              }
            ]
          },
          {
            path: '/setting/payme',
            name: 'Payme',
            redirect: '/setting/payme/list',
            component: RouteView,
            hideChildrenInMenu: true,
            meta: { title: 'Payme', keepAlive: true, icon: 'credit-card', permission: ['payme'] },
            children: [
              {
                path: '/setting/payme/list',
                name: 'PaymePage',
                hidden: true,
                component: () => import('@/views/Payme/PaymeGrid.vue'),
                meta: { title: 'Payme', keepAlive: true, permission: ['payme'] },
              },
              {
                path: '/setting/payme/new',
                name: 'PaymePageNew',
                hidden: true,
                component: () => import('@/views/Payme/PaymeCreate.vue'),
                meta: { title: 'Payme create', keepAlive: false, permission: ['payme'] },
              },
              {
                path: '/setting/payme/:id',
                name: 'PaymePageEdit',
                hidden: true,
                component: () => import('@/views/Payme/PaymeCreate.vue'),
                meta: { title: 'Payme update', keepAlive: false, permission: ['payme'] },
              }
            ]
          },
          {
            path: '/setting/iiko',
            name: 'ikko',
            redirect: '/setting/iiko/list',
            component: RouteView,
            hideChildrenInMenu: true,
            meta: { title: 'Iiko', keepAlive: true, icon: 'credit-card', permission: ['payme'] },
            children: [
              {
                path: '/setting/iiko/list',
                name: 'iikoPage',
                component: () => import('@/views/productTypes/iiko.vue'),
                meta: { title: 'Iiko list', keepAlive: true, permission: ['payme'] },
              },
              {
                path: '/setting/iiko/append-new-branch',
                name: 'appendNewBranch',
                component: () => import('@/views/productTypes/Tabs/Branches.vue'),
                meta: { title: 'Iiko new branch', keepAlive: true, permission: ['payme'] },
              },
              {
                path: '/setting/iiko/append-new-product',
                name: 'appendNewprod',
                component: () => import('@/views/productTypes/Tabs/Products.vue'),
                meta: { title: 'Iiko new product', keepAlive: true, permission: ['payme'] },
              },
              {
                path: '/setting/iiko/append-new-terminal',
                name: 'appendNewterminal',
                component: () => import('@/views/productTypes/Tabs/Terminals.vue'),
                meta: { title: 'Iiko new termianal', keepAlive: true, permission: ['payme'] },
              }
            ]
          },
          {
            path: '/setting/jowi',
            name: 'Jowifs',
            redirect: '/setting/jowi/list',
            component: RouteView,
            hideChildrenInMenu: true,
            meta: { title: 'Jowi', keepAlive: true, icon: 'credit-card', permission: ['payme'] },
            children: [
              {
                path: '/setting/jowi/list',
                name: 'jowiPadge',
                component: () => import('@/views/productTypes/jowi.vue'),
                meta: { title: 'Jowi', keepAlive: true, permission: ['payme'] },
              },
              {
                path: '/setting/jowi/append-new-branch',
                name: 'jowiPadgenewBranch',
                component: () => import('@/views/productTypes/Tabs_jowi/Branches.vue'),
                meta: { title: 'Jowi new branch', keepAlive: true, permission: ['payme'] },
              },
              {
                path: '/setting/jowi/append-new-product',
                name: 'jowiPadgenewProduct',
                component: () => import('@/views/productTypes/Tabs_jowi/Products.vue'),
                meta: { title: 'Jowi new product', keepAlive: true, permission: ['payme'] },
              }
            ]
          },
          {
            path: '/setting/click',
            name: 'Click',
            redirect: '/setting/click/list',
            component: RouteView,
            hideChildrenInMenu: true,
            meta: { title: 'Click', keepAlive: true, icon: 'credit-card', permission: ['payme'] },
            children: [
              {
                path: '/setting/click/list',
                name: 'ClickPage',
                component: () => import('@/views/Click/ClickGrid.vue'),
                meta: { title: 'Click', keepAlive: true, permission: ['payme'] },
              },
              {
                path: '/setting/click/new',
                name: 'ClickPageNew',
                component: () => import('@/views/Click/ClickForm.vue'),
                meta: { title: 'Click new', keepAlive: true, permission: ['payme'] },
              },
              {
                path: '/setting/click/:id',
                name: 'ClickPageEdit',
                component: () => import('@/views/Click/ClickForm.vue'),
                meta: { title: 'Click edit', keepAlive: true, permission: ['payme'] },
              }
            ]
          },
          {
            path: '/setting/aggregator',
            name: 'Aggregator',
            redirect: '/setting/aggregator/list',
            component: RouteView,
            hideChildrenInMenu: true,
            meta: { title: 'aggregator', keepAlive: true, icon: 'deployment-unit', permission: ['tariff'] },
            children: [
              {
                path: '/setting/aggregator/list',
                name: 'AggregatorList',
                component: () => import('@/views/Aggregator/AggregatorList.vue'),
                meta: { title: 'aggregator', keepAlive: true, permission: ['tariff'] },
              }
            ]
          },
          {
            path: '/setting/roles',
            name: 'Roles',
            redirect: '/setting/roles/list',
            component: RouteView,
            hideChildrenInMenu: true,
            meta: { title: 'roleAndPermessions', keepAlive: true, icon: 'control', permission: ['role_permission'] },
            children: [
              {
                path: '/setting/roles/list',
                name: 'Roles-setting',
                component: () => import('@/views/roles/RoleList'),
                meta: { title: 'role', keepAlive: true, permission: ['role_permission'] },
              }
            ]
          },
          {
            path: '/setting/setting_shipper',
            name: 'SettingShipper',
            component: () => import('@/views/shipper-settings/Setting'),
            hideChildrenInMenu: true,
            meta: { title: 'setting_shipper', keepAlive: true, icon: 'setting', permission: ['shipper-setting'] },
            children: []
          },
          {
            path: '/setting/geozone',
            name: 'Geozone',
            hidden: true,
            component: RouteView,
            redirect: '/setting/geozone/create',
            meta: { title: 'geozone', keepAlive: true, icon: 'setting', permission: ['shipper-setting'] },
            children: [
              {
                path: '/setting/geozone/create',
                name: 'GeozoneCreate',
                component: () => import('@/views/geozone/Create'),
                meta: { title: 'geozone.create', keepAlive: true, permission: ['shipper-setting'] },
              },
              {
                path: '/setting/geozone/edit/:id',
                name: 'GeozoneEdit',
                component: () => import('@/views/geozone/Create'),
                meta: { title: 'geozone.edit', keepAlive: true, permission: ['shipper-setting'] },
              }
            ]
          },
          {
            path: '/setting/free-geozone',
            name: 'FreeGeozone',
            hidden: true,
            component: RouteView,
            redirect: '/setting/free-geozone/create',
            meta: { title: 'free-geozone', keepAlive: true, icon: 'setting', permission: ['shipper-setting'] },
            children: [
              {
                path: '/setting/free-geozone/create',
                name: 'FreeGeozoneCreate',
                component: () => import('@/views/freeGeozone/Create'),
                meta: { title: 'free.geozone.create', keepAlive: true, permission: ['shipper-setting'] },
              },
              {
                path: '/setting/free-geozone/edit/:id',
                name: 'FreeGeozoneEdit',
                component: () => import('@/views/freeGeozone/Create'),
                meta: { title: 'free.geozone.edit', keepAlive: true, permission: ['shipper-setting'] },
              }
            ]
          },
        ]
      },
      // {
      //   path: '/billing',
      //   redirect: '/billing/shippers',
      //   component: RouteView,
      //   meta: { title: 'billing', icon: 'dollar', permission: ['shipper-setting'] },
      //   children: [
      //     {
      //       path: '/billing/shippers',
      //       name: 'ShippersList',
      //       redirect: '/billing/shippers/list',
      //       component: RouteView,
      //       hideChildrenInMenu: true,
      //       meta: { title: 'users', keepAlive: true, permission: ['shipper-setting'] },
      //       children: [
      //         {
      //           path: '/billing/shippers/list',
      //           name: 'TariffPage-spiska',
      //           component: () => import('@/views/billing/users/ShippersList'),
      //           meta: { title: 'shippers.list', keepAlive: true, permission: ['shipper-setting'] },
      //         },
      //         {
      //           path: '/billing/shippers/list/:id/transactions/:name',
      //           name: 'Tariffview',
      //           component: () => import('@/views/billing/users/view/index.vue'),
      //           meta: { title: 'shippers.list', keepAlive: true, permission: ['shipper-setting'] },
      //         },
      //         {
      //           path: '/billing/shippers/list/:id',
      //           name: 'TariffPage',
      //           component: () => import('@/views/billing/users/ShipperBalanceList'),
      //           meta: { title: 'shippers.list', keepAlive: true, permission: ['shipper-setting'] },
      //         },
      //         {
      //           path: '/billing/shippers/create',
      //           name: 'ShipperBalanceCreate',
      //           component: () => import('@/views/billing/users/form'),
      //           meta: { title: 'shipper.balance.create', keepAlive: true, permission: ['shipper-setting'] }
      //         },
      //         {
      //           path: '/billing/shippers/:id',
      //           name: 'ShipperBalanceCreate',
      //           component: () => import('@/views/billing/users/form'),
      //           meta: { title: 'shipper.balance.create', keepAlive: true, permission: ['shipper-setting'] }
      //         }
      //       ]
      //     },
      //     {
      //       path: '/billing/tarifs',
      //       name: 'ShippersList-tarif',
      //       redirect: '/billing/tarifs/list',
      //       component: RouteView,
      //       hideChildrenInMenu: true,
      //       meta: { title: 'fares', keepAlive: true, permission: ['shipper-setting'] },
      //       children: [
      //         {
      //           path: '/billing/tarifs/list',
      //           name: 'TariffPage-list',
      //           component: () => import('@/views/billing/tariffs'),
      //           meta: { title: '', keepAlive: false, permission: ['shipper-setting'] },
      //         },
      //         {
      //           path: '/billing/tarifs/create',
      //           name: 'TariffPage-create',
      //           component: () => import('@/views/billing/tariffs/form'),
      //           meta: { title: '', keepAlive: false, permission: ['shipper-setting'] },
      //         },
      //         {
      //           path: '/billing/tarifs/:id',
      //           name: 'TariffPage-tarifid',
      //           component: () => import('@/views/billing/tariffs/form'),
      //           meta: { title: '', keepAlive: false, permission: ['shipper-setting'] },
      //         }
      //       ]
      //     }
      //   ]
      // },
      {
        path: '/instruction/guides',
        name: 'InsGuideList',
        hideChildrenInMenu: true,
        redirect: '/instruction/guides/list',
        component: RouteView,
        meta: { title: 'instruction', icon: 'file-unknown', permission: ['instruction'] },
        children: [
          {
            path: '/instruction/guides/list',
            hideChildrenInMenu: true,
            name: 'GuidesList',
            component: () => import('@/views/instruction/GuideList'),
            meta: { title: 'GuideList', keepAlive: true, permission: ['instruction'] }
          },
          {
            path: '/instruction/:guid/:insid',
            hideChildrenInMenu: true,
            name: 'Instruction',
            component: () => import('@/views/instruction/Instruction'),
            meta: { title: 'instruction', keepAlive: true, permission: ['instruction'] }
          }
        ]
      },
      {
        path: '/personal_report',
        name: 'PersonalReport',
        hidden: true,
        component: () => import('@/views/reports/PersonalReport'),
        meta: { title: 'cabinet', icon: 'solution', keepAlive: true },
      },
      {
        path: '/account',
        name: 'cabinet',
        hidden: true,
        component: () => import('@/views/cabinet/CabinetUser'),
        meta: { title: 'cabinet', icon: 'solution', keepAlive: true },
      },
    ],
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
]
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    // redirect: '/user/shipper',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login'),
      },
      {
        path: 'login/shipper',
        name: 'shipper',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/LoginShipper'),
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register'),
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult'),
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined,
      },
    ],
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
  },
]
