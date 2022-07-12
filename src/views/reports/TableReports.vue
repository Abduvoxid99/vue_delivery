<template>
  <a-table
    :columns="columns"
    :dataSource="dataTable"
    :pagination="pagination"
    :rowKey="record => record.name"
    :loading="loading"
    :scroll="{ x: scroll }"
    bordered
  ></a-table>
</template>
<script>
export default {
  props: {
    columns: {
      type: Array,
      default: () => {
        return []
      }
    },
    dataTable: {
      type: Array,
      default: () => {
        return []
      }
    },
    pagination: {
      type: Object,
      default: () => {
        return {}
      }
    },
    scroll: {
      type: Number,
      default: () => {
        return null
      }
    },
    loading: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  }
}
</script>
