<template>
  <UnCard
    transparent-dark
    class="dashboard-farm"
  >
    <DashboardSectionHeader
      title="Farming"
      class="dashboard-farm__header"
    />

    <div
      class="dashboard-farm__coming-soon"
      v-text="'Coming Soon...'"
    />
  </UnCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import DashboardSectionHeader from './DashboardSectionHeader.vue';
import UnCard from '@/components/ui/UnCard.vue';

export default defineComponent({
  name: 'DashboardFarm',
  components: {
    DashboardSectionHeader,
    UnCard,
  },
});
</script>

<style lang="scss">
.dashboard-farm {
  @include media-lt(desktop) {
    padding: 25px 16px !important;
  }

  &__coming-soon {
    padding: 26px 20px;
    margin-top: 17px;
    font-size: 18px;
    font-weight: 600;
    line-height: 27px;
    background: rgba(41, 73, 171, 0.15);
    border-radius: 20px;
  }
}
</style>
