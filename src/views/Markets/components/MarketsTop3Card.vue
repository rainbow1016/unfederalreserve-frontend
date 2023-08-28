<template>
  <UnCard
    title="Top 3 Markets"
    tooltip-text="Highest liquidity assets in Supply and Borrow markets"
    tooltip-width="200px"
  >
    <MarketsTop3
      :all_markets="all_markets"
      :skeleton="skeleton"
    />
  </UnCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import UnCard from '@/components/ui/UnCard.vue';
import MarketsTop3 from './MarketsTop3.vue';

export default defineComponent({
  name: 'MarketsTop3Card',
  components: {
    UnCard,
    MarketsTop3,
  },
  props: {
    all_markets: Array,
    skeleton: Boolean,
  },
});
</script>
