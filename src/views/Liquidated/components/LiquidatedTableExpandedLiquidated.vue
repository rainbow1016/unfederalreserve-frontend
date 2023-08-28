<template>
  <ul class="liquidated-table-expanded-liquidated">
    <template v-for="item in settings.list_top" :key="item.label">
      <li>
        <LiquidatedTableExpandedLiquidatedItem
          v-bind="item"
          :skeleton="skeleton"
        />
      </li>
    </template>

    <li class="liquidated-table-expanded-liquidated__item-separate" />

    <template v-for="item in settings.list_bottom" :key="item.label">
      <li>
        <LiquidatedTableExpandedLiquidatedItem
          v-bind="item"
          :skeleton="skeleton"
        />
      </li>
    </template>
  </ul>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { IEnv } from '@/global/env';
import { ILiquidationEvent } from '@/types/api/liquidity';
import { parseLiquidationEventExpanded } from '../utils';

import LiquidatedTableExpandedLiquidatedItem from './LiquidatedTableExpandedLiquidatedItem.vue';


export default defineComponent({
  name: 'LiquidatedTableExpandedLiquidated',
  components: {
    LiquidatedTableExpandedLiquidatedItem,
  },
  props: {
    data: {
      type: Object as PropType<ILiquidationEvent>,
      required: true,
    },
    all_markets: {
      type: Array,
      required: true,
    },
    env: {
      type: Object as PropType<IEnv>,
      required: true,
    },
    skeleton: Boolean,
  },
  setup: (props) => {
    const settings = parseLiquidationEventExpanded(props.data, props.env);

    return {
      settings,
    };
  },
});
</script>

<style lang="scss">
.liquidated-table-expanded-liquidated {
  padding: 6px 0;

  &__item-separate {
    padding: 16px;
  }
}
</style>
