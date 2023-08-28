<template>
  <div class="un-row">
    <div class="un-col-1">
      <UnTabs
        v-model="currentTab"
        :options="options"
        full
        class="home-markets-layout-mobile__tabs"
      />

      <slot
        name="balance"
        v-bind="currentData"
      />

      <HomeMarketsTableCard
        v-for="item in currentData.tables"
        :key="item.value"
        v-bind="item"
        :loading="loading"
        :skeleton="skeleton"
        class="home-markets-layout-mobile__user-table"
        @click-row="$attrs.onClickRow"
        @click-collateral="$attrs.onClickCollateral"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  PropType,
  defineComponent,
  computed,
  ref,
} from 'vue';
import { Account } from '@/types/common.d';
import {
  USER_SUPPLY_TABLE_SETTINGS,
  ALL_SUPPLY_TABLE_SETTINGS,
  USER_BORROWINGS_TABLE_SETTINGS,
  ALL_BORROW_TABLE_SETTINGS,
} from '../utils';
import { TRANSACTION_TAB_OPTIONS, TransactionTypes } from '@/classes/transaction/utils-common';

import UnTabs from '@/components/ui/UnTabs.vue';
import HomeMarketsTableCard from './HomeMarketsTableCard.vue';


export default defineComponent({
  name: 'HomeMarketsLayoutMobile',
  components: {
    UnTabs,
    HomeMarketsTableCard,
  },
  props: {
    loading: Boolean,
    skeleton: Boolean,
    account: {
      type: Object as PropType<Account>,
    },
  },
  setup: (props) => {
    const tableOptions = computed(() => [
      {
        title: TRANSACTION_TAB_OPTIONS.supply.label,
        value: TransactionTypes.supply,
        color: TRANSACTION_TAB_OPTIONS.supply.color,
        tables: [
          {
            ...USER_SUPPLY_TABLE_SETTINGS,
            markets: props.account
              ? props.account.user_supplied_markets
              // for skeleton
              : Array.from({ length: 2 }),
          },
          {
            ...ALL_SUPPLY_TABLE_SETTINGS,
            markets: props.account
              ? props.account.supply_markets
              // for skeleton
              : Array.from({ length: 8 }),
          },
        ],
        balance: {
          isSupply: true,
          titleTop: 'Supply Balance',
          titleBottom: 'Collateral Balance',
          valueTop: props.account?.total_supply,
          valueBottom: props.account?.borrow_limit,
          apy: props.account?.net_apy,
        },
      },
      {
        title: TRANSACTION_TAB_OPTIONS.borrow.label,
        value: TransactionTypes.borrow,
        color: TRANSACTION_TAB_OPTIONS.borrow.color,
        tables: [
          {
            ...USER_BORROWINGS_TABLE_SETTINGS,
            markets: props.account
              ? props.account.user_borrowed_markets
              // for skeleton
              : Array.from({ length: 2 }),
          },
          {
            ...ALL_BORROW_TABLE_SETTINGS,
            markets: props.account
              ? props.account.borrow_markets
              // for skeleton
              : Array.from({ length: 8 }),
          },
        ],
        balance: {
          isSupply: false,
          titleTop: 'Borrow Balance',
          titleBottom: 'Borrow Limit',
          valueTop: props.account?.total_borrow,
          valueBottom: props.account?.borrow_limit,
          apy: props.account?.net_apy,
        },
      },
    ]);

    const options = computed(() => tableOptions.value.map((data, index) => ({
      label: data.title, value: data.value, index, color: data.color,
    })));

    const currentTab = ref(options.value[0]);
    const currentData = computed(() => tableOptions.value[currentTab.value.index]);


    return {
      currentData,
      currentTab,
      options,
    };
  },
});
</script>

<style lang="scss">
.home-markets-layout-mobile {
  &__user-table {
    margin: 0 0 17px;
  }

  &__table {
    margin: 0 0 10px;
  }
}
</style>
