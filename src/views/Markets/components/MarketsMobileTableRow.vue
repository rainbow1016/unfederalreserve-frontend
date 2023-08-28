<template>
  <component
    :is="to ? 'router-link' : 'div'"
    :to="to"
    class="markets-mobile-table-row"
  >
    <div class="markets-mobile-table-row__left">
      <div class="markets-mobile-table-row__label">
        Market
      </div>

      <UnSkeleton
        v-if="skeleton"
        height="16px"
        width="70px"
        class="markets-mobile-table-row__skeleton"
      />

      <template v-else>
        <MarketsAllTableColSymbol
          :symbol="symbol"
          :name="data.name"
        />
        <UnBadge
          v-if="data.disabledText"
          :text="data.disabledText"
          class="markets-mobile-table-row__badge"
        />
      </template>
    </div>

    <div class="markets-mobile-table-row__right">
      <MarketsMobileTableCell
        v-for="cell in table_slots"
        :key="cell.key"
        :title="cell.title"
        :loading="loading"
        :skeleton="skeleton"
        :value="data[cell.value]"
        :changes="data[cell.changes]"
        :percent="cell.percent"
      />
    </div>
  </component>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import {
  IAllMarketsData,
  MARKETS_TABLE_SLOTS,
  getAllMarketsRowLocation,
} from '../utils';

import UnBadge from '@/components/ui/UnBadge.vue';
import UnSkeleton from '@/components/ui/UnSkeleton.vue';
import MarketsMobileTableCell from './MarketsMobileTableCell.vue';
import MarketsAllTableColSymbol from './MarketsAllTableColSymbol.vue';


export default defineComponent({
  name: 'MarketsMobileTableRow',
  components: {
    UnBadge,
    UnSkeleton,
    MarketsMobileTableCell,
    MarketsAllTableColSymbol,
  },
  props: {
    data: {
      type: Object as PropType<IAllMarketsData>,
      required: true,
    },
    symbol: {
      type: String,
      required: true,
    },
    loading: Boolean,
    skeleton: Boolean,
  },
  setup: (props) => ({
    table_slots: MARKETS_TABLE_SLOTS,
    to: getAllMarketsRowLocation(props.data),
  }),
});
</script>

<style lang="scss">
.markets-mobile-table-row {
  $root: &;

  display: flex;
  align-items: stretch;
  justify-content: space-between;
  padding: 10px 15px;
  color: $un-color-white;
  text-decoration: none;

  &:nth-child(odd) {
    background-color: #08143e2b;
  }

  &__left {
    display: flex;
    flex: 0 0 40%;
    flex-direction: column;
  }

  &__label {
    margin-bottom: 23px;
    font-size: 12px;
    font-weight: 600;
    line-height: 18px;
    color: $un-color-soft-gray;
  }

  &__badge {
    margin-top: 20px;
    margin-right: auto;
  }

  &__right {
    display: flex;
    flex: 0 0 60%;
    flex-wrap: wrap;
  }

  &__skeleton {
    margin: 12px 0 13px;
  }
}

</style>
