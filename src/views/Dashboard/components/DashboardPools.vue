<template>
  <UnCard
    transparent-dark
    class="dashboard-pools"
  >
    <DashboardSectionHeader
      title="Liquidity Pools"
      class="dashboard-pools__header"
    />

    <UnExpansionPanel
      class="dashboard-pools__expansion-panel"
    >
      <template #main>
        <DashboardInfoCard
          :loading="loading"
          :skeleton="skeleton"
          :value="totalLiquidityFormatted"
          :subvalue="totalUnclaimedFeesFormatted"
          text="Total Pools Balance"
          :icon="require('@/assets/images/icons/droplet.svg')"
          class="dashboard-pools__info"
        />
      </template>

      <template #item>
        <UnSkeleton
          v-if="skeleton"
          width="calc(100% - 48px)"
          height="22px"
          class="dashboard-pools__skeleton"
        />

        <div v-else-if="!poolListActive.length" class="dashboard-pools__empty">
          <div
            class="dashboard-pools__empty-text"
            v-text="'No active position yet'"
          />
          <UnBtn
            square
            :to="toPoolLiquidity"
            :pre-icon="require('@/assets/images/icons/plus.svg')"
            font-size="14px"
            text="New position"
            class="dashboard-pools__empty-button"
          />
        </div>

        <div v-else class="dashboard-pools__small-expansion-panel-wrap">
          <DashboardPoolsPosition
            v-for="position in poolListActive"
            :key="position.tokenId"
            :position="position"
            class="dashboard-pools__small-expansion-panel"
          />
        </div>
      </template>
    </UnExpansionPanel>
  </UnCard>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { ROUTE_POOL_LIQUIDITY } from '@/helpers/enums/routes';
import { useCore } from '@/store';
import { formatToCurrencyDisplay } from '@/helpers/formatters';
import { useBreakpoints } from '@/composable';

import DashboardSectionHeader from './DashboardSectionHeader.vue';
import DashboardInfoCard from './DashboardInfoCard.vue';
import DashboardPoolsPosition from './DashboardPoolsPosition.vue';

import UnSkeleton from '@/components/ui/UnSkeleton.vue';
import UnBtn from '@/components/ui/UnBtn.vue';
import UnCard from '@/components/ui/UnCard.vue';
import UnExpansionPanel from '@/components/ui/UnExpansionPanel.vue';


export default defineComponent({
  name: 'DashboardPools',
  components: {
    DashboardSectionHeader,
    DashboardInfoCard,
    DashboardPoolsPosition,
    UnSkeleton,
    UnBtn,
    UnCard,
    UnExpansionPanel,
  },
  props: {
    skeleton: Boolean,
    loading: Boolean,
    totalLiquidity: {
      type: Number,
      default: 0.00,
    },
    totalUnclaimedFees: {
      type: Number,
      default: 0.00,
    },
  },
  setup(props) {
    const { account } = useCore();
    const { isDesktop } = useBreakpoints();

    const totalLiquidityFormatted = computed(() => (
      formatToCurrencyDisplay(props.totalLiquidity)
    ));

    const totalUnclaimedFeesFormatted = computed(() => (
      `Unclaimed Earnings: : ${formatToCurrencyDisplay(props.totalUnclaimedFees)}`
    ));


    const poolListActive = computed(() => account.value?.positions
      .filter((_) => !_.isClosed) || []);

    return {
      isDesktop,
      poolListActive,
      totalLiquidityFormatted,
      totalUnclaimedFeesFormatted,
      toPoolLiquidity: { name: ROUTE_POOL_LIQUIDITY },
    };
  },
});
</script>

<style lang="scss">
.dashboard-pools {
  @include media-lt(desktop) {
    padding: 25px 16px !important;
  }

  &__header {
    margin-bottom: 25px;
  }

  &__empty {
    padding: 20px 16px;
    margin: 0 16px 20px;
    background: rgba(41, 73, 171, 0.44);
    border-radius: 20px;

    @include media-gt(desktop) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 20px;
      margin: 0 20px 20px;
    }

    &-text {
      font-size: 17px;
      line-height: 25px;
      color: #798dca;
    }

    &-button {
      max-width: 163px;

      @include media-lt(desktop) {
        margin-top: 15px;
      }
    }
  }

  &__skeleton {
    margin: 0 24px 24px 24px;
  }

  &__item {
    & + & {
      margin-top: 18px;
    }
  }

  &__small-expansion-panel {
    & + & {
      margin-top: 11px;
    }
  }

  &__small-expansion-panel-wrap {
    padding: 0 16px 20px;

    @include media-gt(desktop) {
      padding: 0 20px 20px;
    }
  }
}
</style>
