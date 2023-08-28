<template>
  <div class="un-row">
    <template v-for="(list, index) in groupList" :key="index">
      <div class="un-col-2">
        <div class="un-row">
          <template v-for="item in list" :key="item.title">
            <div class="un-col-1">
              <HomeMarketsTableCard
                v-bind="item"
                :loading="loading"
                :skeleton="skeleton"
                @click-row="$attrs.onClickRow"
                @click-collateral="$attrs.onClickCollateral"
              />
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, computed } from 'vue';
import { Account } from '@/types/common.d';
import {
  USER_SUPPLY_TABLE_SETTINGS,
  ALL_SUPPLY_TABLE_SETTINGS,
  USER_BORROWINGS_TABLE_SETTINGS,
  ALL_BORROW_TABLE_SETTINGS,
} from '../utils';

import HomeMarketsTableCard from './HomeMarketsTableCard.vue';


export default defineComponent({
  name: 'HomeMarketsLayoutDesktop',
  components: {
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
    const leftTables = computed(() => [
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
    ]);

    const rightTables = computed(() => [
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
    ]);

    const groupList = computed(() => [
      leftTables.value,
      rightTables.value,
    ]);

    return {
      groupList,
    };
  },
});
</script>
