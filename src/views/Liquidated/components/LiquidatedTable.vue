<template>
  <div
    :class="{ 'is-scrolled': isScrolled }"
    class="liquidated-table is-scrollbar"
    @scroll.passive="onScroll"
  >
    <UnTable
      :headers="headers"
      :data="data"
      :loading="loading"
      item-key="$id"
      expandable
      class="liquidated-table__table"
    >
      <template #col-address="{ value }">
        <UnSkeleton
          v-if="skeleton"
          height="16px"
          :width="isDesktop ? '350px' : '100px'"
          class="liquidated-table__skeleton"
        />

        <span
          v-else
          class="liquidated-table__address"
          data-testid="liquidation-address"
          v-text="value"
        />
      </template>

      <template #col-token="{ value }">
        <UnSkeleton
          v-if="skeleton"
          height="16px"
          width="70px"
          class="liquidated-table__skeleton"
        />

        <HomeMarketsTableColAsset
          v-else
          v-bind="value"
        />
      </template>

      <template #col-loan_to_value="{ value }">
        <UnSkeleton
          v-if="skeleton"
          height="16px"
          width="70px"
          class="liquidated-table__skeleton"
        />

        <span
          v-else
          v-text="value"
        />
      </template>

      <template #col-usd_value="{ value }">
        <UnSkeleton
          v-if="skeleton"
          height="16px"
          width="70px"
          class="liquidated-table__skeleton"
        />

        <span
          v-else
          v-text="value"
        />
      </template>

      <template #col-status="{ value }">
        <UnSkeleton
          v-if="skeleton"
          height="16px"
          width="70px"
          class="liquidated-table__skeleton"
        />

        <span
          v-else
          v-text="value"
        />
      </template>

      <template #data-expanded="{ data: d }">
        <component
          :is="expandedComponent"
          :data="d.data"
          :all_markets="all_markets"
          :loading="loading"
          :skeleton="skeleton"
          :env="env"
          class="liquidated-table__expanded"
        />
      </template>

      <template #data-empty>
        <LiquidatedTableNoResults
          v-if="!data.length && search"
          :search="search"
        />
      </template>
    </UnTable>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line object-curly-newline
import { PropType, defineComponent, defineAsyncComponent, computed, ref } from 'vue';
import { LiquidatedTabs } from '../utils';
import { useBreakpoints } from '@/composable';

import UnTable from '@/components/UnTable.vue';
import UnSkeleton from '@/components/ui/UnSkeleton.vue';
import HomeMarketsTableColAsset from '@/views/Home/components/HomeMarketsTableColAsset.vue';
import LiquidatedTableNoResults from './LiquidatedTableNoResults.vue';


const EXPANDED_COMPONENT_BY_TYPE = {
  [LiquidatedTabs.at_risk]: defineAsyncComponent(() => import(
    /* webpackChunkName: "LiquidatedTableExpandedAtRisk" */
    './LiquidatedTableExpandedAtRisk.vue'
  )),

  [LiquidatedTabs.liquidated]: defineAsyncComponent(() => import(
    /* webpackChunkName: "LiquidatedTableExpandedLiquidated" */
    './LiquidatedTableExpandedLiquidated.vue'
  )),
};

export default defineComponent({
  name: 'LiquidatedTable',
  components: {
    UnTable,
    UnSkeleton,
    HomeMarketsTableColAsset,
    LiquidatedTableNoResults,
  },
  props: {
    loading: Boolean,
    skeleton: Boolean,
    data: {
      type: Array,
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
    all_markets: {
      type: Array,
      required: true,
    },
    env: {
      type: Object,
      required: true,
    },
    type: {
      type: String as PropType<LiquidatedTabs>,
      required: true,
    },
    search: {
      type: String,
      required: true,
    },
  },
  setup: (props) => {
    const isScrolled = ref(false);
    const { isDesktop } = useBreakpoints();

    const onScroll = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      isScrolled.value = target.scrollTop > 5;
    };

    const expandedComponent = computed(() => (
      EXPANDED_COMPONENT_BY_TYPE[props.type]
    ));

    return {
      isScrolled,
      isDesktop,
      expandedComponent,
      onScroll,
    };
  },
});
</script>

<style lang="scss">
.liquidated-table {
  width: 100%;
  overflow: auto;

  @include media-lte(tablet) {
    max-height: calc(100vh - 2 * 100px);
  }

  .is-header {
    position: sticky;
    top: 0;
  }

  &.is-scrolled .is-header {
    z-index: 10;
    padding-top: 12px;
    padding-bottom: 12px;
    background-color: $un-color-tory-blue;
  }

  &.is-scrollbar {
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }

    &::-webkit-scrollbar-track {
      background-color: rgba(35, 58, 129, 0.5);
    }

    &::-webkit-scrollbar-thumb {
      background-color: $un-color-free-speach-blue;
      border-radius: 12px;
    }

    &::-webkit-scrollbar-corner {
      width: 0;
      background-color: rgba(35, 58, 129, 0.5);
    }
  }

  &__table {
    // size of <LiquidatedTableExpandedAtRisk>
    min-width: 570px;
    margin-top: 35px;
  }

  &__address {
    @include media-lte(desktop) {
      width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &__expanded {
    margin: 20px 0;
  }

  --width-cel: 150px;

  @include media-lte(tablet) {
    --width-cel: 120px;
  }

  .is-liquidated-at-risk {
    &_address {
      flex: 1 1 calc(100% - 3 * var(--width-cel));
    }

    &_loan-to-value {
      flex: 1 1 var(--width-cel);
    }

    &_usd-value {
      flex: 1 1 var(--width-cel);

      &.is-col {
        color: #00ffc2;
      }
    }

    &_status {
      flex: 1 1 var(--width-cel);

      &.is-col {
        color: #da914e;
      }
    }
  }

  .is-liquidated-liquidated {
    &_address {
      flex: 1 1 calc(100% - 3 * var(--width-cel));
    }

    &_token {
      flex: 1 1 var(--width-cel);
    }

    &_usd-value {
      flex: 1 1 var(--width-cel);

      &.is-col {
        color: #00ffc2;
      }
    }

    &_status {
      flex: 1 1 var(--width-cel);

      &.is-col {
        color: #ff5252;
      }
    }
  }

  &__skeleton {
    margin: 22px 0;
  }
}
</style>
