<template>
  <UnTable
    :headers="headers"
    :hidden-headers="hiddenHeaders"
    :loading="loading"
    :data="markets"
    data-loading=""
    :with-border="withBorder"
    :hoverable="hoverable"
    item-key="symbol"
    class="home-markets-table"
    @click-row="$attrs.onClickRow"
  >
    <template #col-plus_btn>
      <HomeMarketsTableColPlus />
    </template>

    <template #col-asset="{ value }">
      <UnSkeleton
        v-if="skeleton"
        height="16px"
        width="115px"
        class="home-markets-table__skeleton"
      />
      <HomeMarketsTableColAsset
        v-else
        v-bind="value"
      />
    </template>

    <template #col-balance="{ value }">
      <UnSkeleton
        v-if="skeleton"
        height="16px"
        width="70px"
        class="home-markets-table__skeleton"
      />
      <HomeMarketsTableColBalance
        v-else
        v-bind="value"
      />
    </template>

    <template #col-apy_earned="{ value }">
      <UnSkeleton
        v-if="skeleton"
        height="16px"
        width="70px"
        class="home-markets-table__skeleton"
      />
      <HomeMarketsTableColBalance
        v-else
        v-bind="value"
      />
    </template>

    <template #col-menu="{ value }">
      <HomeMarketsTableColMenu
        v-if="value"
        v-bind="value"
      />
    </template>

    <template #col-collateral="{ value, data }">
      <UnSkeleton
        v-if="skeleton"
        height="16px"
        width="70px"
        class="home-markets-table__skeleton"
      />
      <UnSwitch
        v-else
        :model-value="value.value"
        :disabled="value.disabled"
        @click.stop.prevent="!value.disabled && $attrs.onClickCollateral(data)"
      />
    </template>

    <template #col-apy_accrued="{ value }">
      <UnSkeleton
        v-if="skeleton"
        height="16px"
        width="70px"
        class="home-markets-table__skeleton"
      />
      <span
        v-else
        v-text="value"
      />
    </template>

    <template #col-percent_of_limit="{ value }">
      <UnSkeleton
        v-if="skeleton"
        height="16px"
        width="70px"
        class="home-markets-table__skeleton"
      />
      <span
        v-else
        v-text="value"
      />
    </template>

    <template #col-supply_apy="{ value }">
      <UnSkeleton
        v-if="skeleton"
        height="16px"
        width="70px"
        class="home-markets-table__skeleton"
      />
      <span
        v-else
        v-text="value"
      />
    </template>

    <template #col-wallet="{ value }">
      <UnSkeleton
        v-if="skeleton"
        height="16px"
        width="70px"
        class="home-markets-table__skeleton"
      />
      <span
        v-else
        v-text="value"
      />
    </template>

    <template #col-borrow_apy="{ value }">
      <UnSkeleton
        v-if="skeleton"
        height="16px"
        width="70px"
        class="home-markets-table__skeleton"
      />
      <span
        v-else
        v-text="value"
      />
    </template>

    <template #col-tokens_available_usd="{ value }">
      <UnSkeleton
        v-if="skeleton"
        height="16px"
        width="70px"
        class="home-markets-table__skeleton"
      />
      <span
        v-else
        v-text="value"
      />
    </template>

    <template #col-liquidity="{ value }">
      <UnSkeleton
        v-if="skeleton"
        height="16px"
        width="70px"
        class="home-markets-table__skeleton"
      />
      <span
        v-else
        v-text="value"
      />
    </template>

    <template #col-apy="{ value }">
      <UnSkeleton
        v-if="skeleton"
        height="16px"
        width="70px"
        class="home-markets-table__skeleton"
      />
      <span
        v-else
        v-text="value"
      />
    </template>

    <template #data-empty>
      <HomeMarketsTableDataEmpty
        :title="empty_title"
        :description="empty_description"
      />
    </template>
  </UnTable>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Market } from '@/types/common.d';
import { ITableHeader } from '@/components/UnTable/utils';
import { HomeTableTypes } from '@/views/Home/utils';

import UnTable from '@/components/UnTable.vue';
import UnSwitch from '@/components/ui/UnSwitch.vue';
import UnSkeleton from '@/components/ui/UnSkeleton.vue';

import HomeMarketsTableColAsset from './HomeMarketsTableColAsset.vue';
import HomeMarketsTableColBalance from './HomeMarketsTableColBalance.vue';
import HomeMarketsTableColPlus from './HomeMarketsTableColPlus.vue';
import HomeMarketsTableColMenu from './HomeMarketsTableColMenu.vue';
import HomeMarketsTableDataEmpty from './HomeMarketsTableDataEmpty.vue';


export default defineComponent({
  name: 'HomeMarketsTable',
  components: {
    UnTable,
    UnSwitch,
    UnSkeleton,
    HomeMarketsTableColAsset,
    HomeMarketsTableColBalance,
    HomeMarketsTableColPlus,
    HomeMarketsTableColMenu,
    HomeMarketsTableDataEmpty,
  },
  props: {
    loading: Boolean,
    skeleton: Boolean,
    hoverable: {
      type: Boolean,
      default: true,
    },
    hiddenHeaders: {
      type: Boolean,
    },
    type: {
      type: String,
      default: '',
    },
    empty_title: {
      type: String,
      required: true,
    },
    empty_description: {
      type: String,
      required: true,
    },
    headers: {
      type: Array as PropType<ITableHeader[]>,
      required: true,
    },
    markets: {
      type: Array as PropType<Market[]>,
      required: true,
    },
  },
  setup(props) {
    const withBorder = (
      props.type === HomeTableTypes.supply_user
      || props.type === HomeTableTypes.borrow_user
    );

    return {
      withBorder,
    };
  },
});
</script>

<style lang="scss">
.home-markets-table {
  .is-user-supply {
    &_asset {
      flex: 1 1 40%;
    }

    &_apy_earned {
      flex: 1 1 25%;

      @include media-lte(tablet-xs) {
        display: none;
      }
    }

    &_supply_balance {
      flex: 1 1 30%;
    }

    &_collateral {
      flex: 1 1 20%;
    }
  }

  .is-all-supply {
    &_plus_btn {
      flex: 1 1 10%;

      @include media-lte(tablet-xs) {
        flex: 0;
        width: 25px;
        margin-right: 8px;

        // stylelint-disable-next-line max-nesting-depth
        &.th-plus_btn {
          display: none;
        }
      }
    }

    &_asset {
      flex: 1 1 30%;
    }

    &_supply_apy {
      flex: 1 1 30%;

      @include media-lte(tablet-xs) {
        display: none;
      }
    }

    &_wallet {
      flex: 1 1 30%;
    }

    &_menu {
      flex: 1 1 10%;
    }
  }

  .is-user-borrow {
    &_asset {
      flex: 1 1 40%;
    }

    &_apy_accrued {
      flex: 1 1 20%;

      @include media-lte(tablet-xs) {
        display: none;
      }
    }

    &_borrow_balance {
      flex: 1 1 30%;
    }

    &_percent_of_limit {
      flex: 1 1 20%;
    }
  }

  .is-all-borrow {
    &_plus_btn {
      flex: 1 1 10%;

      @include media-lte(tablet-xs) {
        flex: 0;
        width: 25px;
        margin-right: 8px;

        // stylelint-disable-next-line max-nesting-depth
        &.th-plus_btn {
          display: none;
        }
      }
    }

    &_asset {
      flex: 1 1 20%;
    }

    &_borrow_apy {
      flex: 1 1 25%;

      @include media-lte(tablet-xs) {
        display: none;
      }
    }

    &_available {
      flex: 1 1 25%;
    }

    &_liquidity {
      flex: 1 1 20%;
    }
  }

  &__skeleton {
    margin: 18px 0 19px;
  }
}
</style>
