<template>
  <div>
      <a-card class="mx-2 colorPick" style="height: 100px">
        <a-row type="flex" justify="space-between" align="middle">
            <a-col span="10">
                <a-row type="flex" :gutter="[16,8]">
                    <a-col span="auto" v-if="false">
                          <a-tooltip>
                            <template slot="title">
                                Day
                            </template>
                             <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">
                                <g id="Group_1" data-name="Group 1" transform="translate(-899 -277)">
                                    <rect id="Rectangle_1" data-name="Rectangle 1" width="100%" height="100%" rx="12" transform="translate(899 277)" fill="#f8faff"/>
                                    <text id="_31" data-name="31" transform="translate(917 313)" fill="#5392ff" font-size="22" font-family="MicrosoftNewTaiLue-Bold, Microsoft New Tai Lue" font-weight="700"><tspan x="0" y="0">
                                        {{ tariff.day > 9 ? tariff.day : tariff.day ? '0'+ tariff.day : '' }}
                                    </tspan></text>
                                </g>
                                </svg>
                        </a-tooltip>
                    </a-col>
                    <a-col span="auto">
                        <h3>{{ tariff.name }}</h3>
                        <!-- <p>{{  }}</p> -->
                    </a-col>
                </a-row>
            </a-col>
            <a-col span="3">
                <span>{{ tariff.day > 9 ? tariff.day + ' дней' : tariff.day ? '0'+ tariff.day + ' дней' : '-' }}</span>
            </a-col>
            <a-col span="4">
                <span>{{ getStatus(tariff) }}</span>
            </a-col>
            <a-col span="4" >
                <a-tag color="green" v-if="tariff.percent">{{ tariff.percent }} %</a-tag>
                <a-tag color="green" v-else>{{ $moneyFormat(tariff.amount ? tariff.amount.toString() : '') | toSum }} </a-tag>
            </a-col>
            <a-col span="3">
                <a-row type="flex" :gutter="[3,8]" align="middle">
                    <a-col span="auto">
                          <a-popconfirm
                            placement="topRight"
                            :title="$t('deleteMsg')"
                            @confirm="deleteItem(tariff)"
                            :okText="$t('yes')"
                            :cancelText="$t('no')"
                            >
                                <a-button
                                type="danger"
                                icon="delete"
                                ></a-button>
                            </a-popconfirm>
                    </a-col>
                    <!-- <a-col span="auto">
                        <a-button type="primary" icon="eye"></a-button>
                    </a-col> -->
                </a-row>
            </a-col>
        </a-row>
      </a-card>
    </div>
</template>

<script>
export default {
    data () {
        return {
            visible: false
        }
    },
    props: {
        tariff: {
            type: Object,
            required: true
        },
        removeItem: {
            type: Function,
            required: true
        }
    },
    filters: {
        toSum (e, t) {
            // console.log(e)
            const el = e + ' сум'
            if (e) return el
            return '-'
        }
    },
    computed: {
        tariffStatuslist () {
            return this.$store.state.billingTarif.tariffStatuslist
        }
    },
    methods: {
        deleteItem (item) {
            this.removeItem(item)
        },
        getStatus (item) {
            // console.log(item, this.tariffStatuslist)
            const el = this.tariffStatuslist.filter(el => item.status_ids.includes(el.id))
            return el.map(el => el.label).join(', ')
        }
    }
}
</script>

<style>
</style>
