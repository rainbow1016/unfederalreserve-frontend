<template>
  <div class="dashboard-header">
    <div class="dashboard-header__network-wrap">
      <div class="dashboard-header__network">
        <span class="dashboard-header__network-icon" :style="{ '--color': networkColor }" />
        {{ networkName }}
      </div>
    </div>

    <div class="dashboard-header__total-balance">
      <div
        class="dashboard-header__title"
        v-text="'Total Platform Balance'"
      />

      <UnSkeleton
        v-if="skeleton"
        :height="isDesktop ? '45px' : '35px'"
        width="180px"
        class="dashboard-header__skeleton"
      />

      <div
        v-else
        class="dashboard-header__balance"
        data-testid="dashboard-total-balance"
        v-text="totalBalanceUsdFormatted"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useBreakpoints } from '@/composable';
import { formatToCurrencyDisplay } from '@/helpers/formatters';

import UnSkeleton from '@/components/ui/UnSkeleton.vue';

export default defineComponent({
  name: 'DashboardHeader',
  components: {
    UnSkeleton,
  },
  props: {
    networkColor: {
      type: String,
      required: true,
    },
    networkName: {
      type: String,
      required: true,
    },
    totalBalanceUsd: {
      type: Number,
      required: true,
    },
    skeleton: Boolean,
    loading: Boolean,
  },
  setup(props) {
    const { isDesktop } = useBreakpoints();
    const totalBalanceUsdFormatted = computed(() => (
      formatToCurrencyDisplay(props.totalBalanceUsd || 0, 0)
    ));

    return {
      totalBalanceUsdFormatted,
      isDesktop,
    };
  },
});
</script>

<style lang="scss">
$box-shadow: 10px 10px 20px rgba(31, 63, 174, 0.02),
  13px 2px 6px rgba(31, 63, 174, 0.02),
  7px 0 50px rgba(31, 63, 174, 0.02);

.dashboard-header {
  @include media-gt(tablet) {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: space-between;
  }

  &__network-wrap {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    @include media-lt(tablet) {
      margin-bottom: 20px;
    }
  }

  &__network {
    display: flex;
    align-items: center;
    padding: 8px 13px 8px 10px;
    font-size: 15px;
    font-weight: 600;
    line-height: 26px;
    background: #233e92;
    border-radius: 8px;
    box-shadow: $box-shadow;
  }

  &__network-icon {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    margin-right: 4px;
    background:
      radial-gradient(
        50% 50% at 50% 50%,
        rgba(1, 166, 117, 0.3) 0%,
        rgba(1, 166, 117, 0) 100%
      );
    border-radius: 100px;

    &::after {
      position: absolute;
      width: 6px;
      height: 6px;
      content: "";
      background:
        radial-gradient(
          50% 50% at 50% 50%,
          #fff 0%,
          var(--color) 100%
        );
      border-radius: 100%;
    }
  }

  &__balance,
  &__skeleton {
    margin: 8px 0 0;
    font-size: 35px;
    font-weight: 700;
    line-height: 100%;

    @include media-gt(tablet) {
      margin: 17px 0 0;
      font-size: 45px;
    }
  }

  &__title {
    font-size: 16px;
    font-weight: 500;
    line-height: 100%;
    color: #739efa;
    letter-spacing: 0.01em;
  }
}
</style>
