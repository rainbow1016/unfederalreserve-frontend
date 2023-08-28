<template>
  <UnCard
    transparent-dark
    class="dashboard-reserve-funding"
  >
    <DashboardSectionHeader
      :title="'Reserve Funding'"
      class="dashboard-reserve-funding__header"
    />

    <div class="dashboard-reserve-funding__content">
      <div
        class="dashboard-reserve-funding__coming-soon"
        v-text="'Coming Soon...'"
      />

      <div
        class="dashboard-reserve-funding__text"
        v-text="'ReserveFunding High-Yield Accounts'"
      />

      <UnBtn
        square
        lime-green
        :href="moreLink"
        font-size="14px"
        target="_blank"
        text="LEARN MORE"
        class="dashboard-reserve-funding__button"
      />
    </div>
  </UnCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import DashboardSectionHeader from './DashboardSectionHeader.vue';
import UnBtn from '@/components/ui/UnBtn.vue';
import UnCard from '@/components/ui/UnCard.vue';

export default defineComponent({
  name: 'DashboardReserveFunding',
  components: {
    DashboardSectionHeader,
    UnBtn,
    UnCard,
  },
  setup() {
    return {
      moreLink: process.env.VUE_APP_RESERVE_FUNDING_LINK,
    };
  },
});
</script>

<style lang="scss">
.dashboard-reserve-funding {
  @include media-lt(desktop) {
    padding: 25px 16px !important;
  }

  &__content {
    padding: 23px 21px;
    margin-top: 21px;
    background: rgba(41, 73, 171, 0.15);
    border-radius: 20px;

    @include media-gt(tablet) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 23px 21px;
    }
  }

  &__coming-soon {
    font-size: 18px;
    font-weight: 600;
    line-height: 27px;
  }

  &__text {
    font-size: 14px;
    line-height: 21px;

    @include media-lte(tablet) {
      margin: 2px 0 9px;
    }

    @include media-gt(tablet) {
      font-size: 17px;
      line-height: 25px;
    }
  }

  &__button {
    max-width: 138px;
  }
}
</style>
