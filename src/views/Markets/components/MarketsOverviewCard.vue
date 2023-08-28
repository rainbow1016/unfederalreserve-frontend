<template>
  <UnCard
    title="Market Overview"
    tooltip-text="Total distribution supply and borrow markets"
    tooltip-width="240px"
    no-padding
  >
    <MarketsOverview
      :all_markets="all_markets"
      :skeleton="skeleton"
    />
  </UnCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import UnCard from '@/components/ui/UnCard.vue';
import MarketsOverview from './MarketsOverview.vue';


export default defineComponent({
  name: 'MarketsOverviewCard',
  components: {
    UnCard,
    MarketsOverview,
  },
  props: {
    skeleton: Boolean,
    all_markets: Array,
  },
});
</script>
