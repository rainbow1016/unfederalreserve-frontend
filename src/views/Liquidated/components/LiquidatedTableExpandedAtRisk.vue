<template>
  <table class="liquidated-table-expanded-at-risk">
    <tr
      v-for="(item, index) in balances"
      :key="index"
      class="liquidated-table-expanded-at-risk__tr"
    >
      <td>
        <UnSkeleton
          v-if="skeleton"
          height="18px"
          width="18px"
          class="liquidated-table-expanded-at-risk__icon liquidated-table-expanded-at-risk__skeleton"
        />

        <img
          v-else-if="item.icon"
          :src="item.icon"
          :alt="item.symbol"
          class="liquidated-table-expanded-at-risk__icon"
        >
      </td>

      <template v-for="{ label, key } in listElSettings" :key="key">
        <td class="liquidated-table-expanded-at-risk__td">
          {{ label }}:

          <UnSkeleton
            v-if="skeleton"
            height="16px"
            width="70px"
            class="liquidated-table-expanded-at-risk__value liquidated-table-expanded-at-risk__skeleton"
          />

          <span
            v-else
            :class="`is-type--${key}`"
            :data-testid="key"
            class="liquidated-table-expanded-at-risk__value"
            v-text="item[key]"
          />
        </td>
      </template>
    </tr>
  </table>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { IAllMarket } from '@/types/api/allMarkets';
import { IAccountLiquidity } from '@/types/api/liquidity';
import { parseAccountLiquidityBalances } from '../utils';

import UnSkeleton from '@/components/ui/UnSkeleton.vue';


const LIST_EL_SETTINGS = [
  { label: 'Supplied', key: 'supplied' },
  { label: 'Borrowed', key: 'borrowed' },
  // { label: 'Balance Of', key: 'balance_of' },
];

export default defineComponent({
  name: 'LiquidatedTableExpandedAtRisk',
  components: {
    UnSkeleton,
  },
  props: {
    data: {
      type: Object as PropType<IAccountLiquidity>,
      required: true,
    },
    all_markets: {
      type: Array as PropType<IAllMarket[]>,
      required: true,
    },
    skeleton: Boolean,
  },
  setup: (props) => {
    const balances = parseAccountLiquidityBalances(props.data, props.all_markets);

    return {
      balances,
      listElSettings: LIST_EL_SETTINGS,
    };
  },
});
</script>

<style lang="scss">
.liquidated-table-expanded-at-risk {
  &__icon {
    width: 18px;
    height: 18px;
    margin-right: 18px;
  }

  &__td {
    min-width: 180px;
    padding: 3px 20px 3px 6px;
    white-space: nowrap;
  }

  &__value {
    margin-left: 9px;
    font-size: 13px;
    font-weight: 500;
    line-height: 19px;
    color: $un-color-white;

    &.is-type {
      &--borrowed {
        color: $un-color-green;
      }

      &--supplied {
        color: $un-color-orange-1;
      }

      &--balance_of {
        color: $un-color-red;
      }
    }
  }

  &__skeleton {
    display: inline-flex;
    margin-bottom: 3px;
    vertical-align: top;
  }
}
</style>
