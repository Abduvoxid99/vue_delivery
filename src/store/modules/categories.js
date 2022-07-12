import request from '@/utils/request'

const categories = {
    state: {
      categories: [],
      categoriesWithChildren: [],
      pagination: {}
    },
    getters: {
      paginationCategories: state => state.pagination,
      categories: state => state.categories,
      categoriesWithChildren: state => state.categoriesWithChildren
    },
    mutations: {
      GET_CATEGORIES: (state, categories) => {
          state.categories = categories
      },
      GET_CATEGORIES_PAGINATION: (state, pagination) => {
        state.pagination = pagination
      },
      GET_CATEGORIES_WITH_CHILDREN: (state, categoriesWithChildren) => {
        state.categoriesWithChildren = categoriesWithChildren
      }
    },
    actions: {
      getCategories ({ commit }, page) {
        if (!page) {
          page = { current: 1, pageSize: 1000, total: null }
        }
        return new Promise((resolve, reject) => {
        request({
            url: '/category',
            params: { page: page.current, limit: page.pageSize }
        })
          .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_CATEGORIES_PAGINATION', pagination)
          commit('GET_CATEGORIES', result.categories)
          if (result.categories) {
            console.log(result.categories)
            const getCategoriesWithChildren = (allCategories = [], categories) => {
              for (let i = 0; i < categories.length; i++) {
                // console.log(categories[i])
                var newCategory = {}
                newCategory.id = categories[i].id
                newCategory.description = categories[i].description
                newCategory.image = categories[i].image
                newCategory.order_no = categories[i].order_no
                newCategory.name = categories[i].name
                newCategory.parent_id = categories[i].parent_id
                newCategory.slug = categories[i].slug
                newCategory.is_active = categories[i].is_active
                allCategories.push(newCategory)
                if (categories[i].child_categories !== null && categories[i].child_categories) {
                  // debugger
                  allCategories = getCategoriesWithChildren(allCategories, categories[i].child_categories)
                }
              }
              return allCategories
            }
          commit('GET_CATEGORIES_WITH_CHILDREN', getCategoriesWithChildren([], result.categories))
        }
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    }
  }
}
  export default categories
