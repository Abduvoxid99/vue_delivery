<template>
    <div>
        <a-modal
            :width="700"
            :visible="modal.visible"
            :title="$t('transaction.details')"
            @ok="handleOk => modal.visible = false"
            @cancel="handleCancel => modal.visible = false"
        >
            <a-descriptions v-if="modal.data" layout="vertical" bordered :column="4">
                <a-descriptions-item :label="$t('orderId')">
                    <a @click="openPreviewModal">{{ modal.data.external_order_id }}</a>
                </a-descriptions-item>
                <a-descriptions-item :label="$t('status')">
                    {{ tariffStatus }}
                </a-descriptions-item>
                <a-descriptions-item :label="$t('tariff.name')">
                    {{ modal.data.tariff_name }}
                </a-descriptions-item>
                <a-descriptions-item :label="$t('amount')">
                    {{ modal.data.amount }}
                </a-descriptions-item>
            </a-descriptions>
        </a-modal>
        <preview ref="previewModal" />
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import Preview from '@/views/orderNew/Preview.vue'

export default {
    props: {
        modal: {
            type: Object,
            required: true
        }
    },
    components: {
        'preview': Preview
    },
    data () {
        return {
            order: null
        }
    },
    computed: {
        tariffStatus () {
            return this.$store.state.billingTarif.tariffStatuslist.find(el => this.modal.data?.status_id === el.id)?.label
        }
    },
    watch: {
        'modal.data': function (elm) {
            console.log('modal', elm)
            if (elm) this.getOrderById(elm.order_id)
        }
    },
    methods: {
        ...mapActions(['getOrder']),
        openPreviewModal () {
            console.log('orderr=>>')
            if (this.order) this.$refs.previewModal.openModal(this.order)
        },
        getOrderById (id) {
            this.getOrder(id)
                .then(res => {
                    console.log(res)
                    this.order = res
                }).catch(err => console.log(err))
        }
    },
}
</script>

<style>

</style>
