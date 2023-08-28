<template>
  <UnCard v-bind="$attrs">
    <MarketsTotal
      :type="type"
      :all_markets="all_markets"
      :skeleton="skeleton"
    />
  </UnCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import UnCard from '@/components/ui/UnCard.vue';
import MarketsTotal from './MarketsTotal.vue';


export default defineComponent({
  name: 'MarketsTotalCard',
  components: {
    UnCard,
    MarketsTotal,
  },
  inheritAttrs: false,
  props: {
    all_markets: Array,
    type: String,
    skeleton: Boolean,
  },
});
</script>
