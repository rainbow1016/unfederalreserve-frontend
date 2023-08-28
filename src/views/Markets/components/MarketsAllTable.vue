<template>
  <UnTable
    :headers="headers"
    :hidden-headers="hiddenHeaders"
    :data="markets"
    :loading="loading"
    :get-row-location="skeleton ? void 0 : getRowLocation"
    hoverable
    item-key="address"
    class="markets-all-table"
  >
    <template #col-market="{ data: d }">
      <UnSkeleton
        v-if="skeleton"
        height="16px"
        width="160px"
        class="markets-all-table__skeleton"
      />

      <template v-else>
        <MarketsAllTableColSymbol
          v-bind="d"
        />
        <UnBadge
          v-if="d.disabledText"
          :text="d.disabledText"
          class="markets-all-table__badge"
        />
      </template>
    </template>

    <template
      v-for="slot in table_slots"
      :key="slot.key"
      #[slot.key]="{ data: d }"
    >
      <UnSkeleton
        v-if="skeleton"
        height="16px"
        width="70px"
        class="markets-all-table__skeleton"
      />

      <MarketsAllTableColChanges
        v-else
        :value="d[slot.value]"
        :changes="d[slot.changes]"
        :percent="slot.percent"
      />
    </template>
  </UnTable>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import {
  getAllMarketsRowLocation,
  MARKETS_TABLE_SLOTS,
  MARKETS_TABLE_HEADERS,
} from '../utils';

import UnTable from '@/components/UnTable.vue';
import UnBadge from '@/components/ui/UnBadge.vue';
import UnSkeleton from '@/components/ui/UnSkeleton.vue';

import MarketsAllTableColSymbol from './MarketsAllTableColSymbol.vue';
import MarketsAllTableColChanges from './MarketsAllTableColChanges.vue';


export default defineComponent({
  name: 'MarketsAllTable',
  components: {
    UnTable,
    UnBadge,
    UnSkeleton,
    MarketsAllTableColSymbol,
    MarketsAllTableColChanges,
  },
  props: {
    loading: Boolean,
    skeleton: Boolean,
    hiddenHeaders: {
      type: Boolean,
    },
    markets: {
      type: Array,
      required: true,
    },
  },
  setup: () => ({
    getRowLocation: getAllMarketsRowLocation,
    headers: MARKETS_TABLE_HEADERS,
    table_slots: MARKETS_TABLE_SLOTS,
  }),
});
</script>

<style lang="scss">
.markets-all-table {
  --col-width: 15%;
  --col-second-width: 100px;

  @include media-lt(desktop-md) {
    --col-width: 14%;
    --col-second-width: 100px;
  }

  & &__col-first {
    flex: 1 1 calc(100% - 3 * var(--col-width));
    justify-content: space-between;
  }

  &__col-second {
    flex: 1 1 var(--col-second-width);
    justify-content: flex-justify;
  }

  &__col {
    position: relative;
    flex: 1 1 var(--col-width);
    justify-content: flex-end;
  }

  &__symbol-container {
    display: flex;
    width: 100%;
  }

  &__badge {
    @include media-lt(desktop-md) {
      max-width: 134px;
    }

    @include media-lt(910px) {
      max-width: 82px;
    }
  }

  &__skeleton {
    margin: 18px 0;
  }
}
</style>
