<template>
  <UnCard
    transparent-dark
    class="dashboard-ersdl-balance"
  >
    <DashboardSectionHeader
      title="Your eRSDL Balance"
      class="dashboard-ersdl-balance__header"
    />

    <UnSkeleton
      v-if="skeleton"
      height="19px"
      width="100px"
      class="dashboard-ersdl-balance__skeleton__value-usd"
    />

    <div
      v-else
      class="dashboard-ersdl-balance__balance__value-usd"
      data-testid="dashboard-ersdl-balance-usd"
      v-text="balanceUsdFormatted"
    />

    <UnSkeleton
      v-if="skeleton"
      height="19px"
      width="100px"
      class="dashboard-ersdl-balance__skeleton__value-token"
    />

    <div
      v-else
      class="dashboard-ersdl-balance__balance__value-token"
      data-testid="dashboard-ersdl-balance"
      v-text="balanceFormatted"
    />

    <div class="dashboard-ersdl-balance__other-balance-wrap">
      <div
        v-for="el in otherBalances"
        :key="el.value"
        class="dashboard-ersdl-balance__other-balance"
      >
        <div
          class="dashboard-ersdl-balance__other-balance__title"
          v-text="el.title"
        />

        <UnSkeleton
          v-if="skeleton"
          height="19px"
          width="100px"
          class="dashboard-ersdl-balance__skeleton__other-balance"
        />

        <div
          v-else
          class="dashboard-ersdl-balance__other-balance__value"
          v-text="el.value"
        />
      </div>
    </div>
  </UnCard>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { formatToCurrencyDisplay, formatBalanceDisplay } from '@/helpers/formatters';
import { toFixed } from '@/helpers/toFixed';
import { CURRENCIES } from '@/helpers/enums/currencies';

import DashboardSectionHeader from './DashboardSectionHeader.vue';
import UnSkeleton from '@/components/ui/UnSkeleton.vue';
import UnCard from '@/components/ui/UnCard.vue';


export default defineComponent({
  name: 'DashboardErsdlBalance',
  components: {
    DashboardSectionHeader,
    UnSkeleton,
    UnCard,
  },
  props: {
    balance: {
      type: Number,
      default: 0,
    },
    balanceUsd: {
      type: Number,
      default: 0.00,
    },
    walletBalance: {
      type: Number,
      default: 0,
    },
    unclaimedBalance: {
      type: Number,
      default: 0,
    },
    skeleton: Boolean,
    loading: Boolean,
  },
  setup(props) {
    const token = 'eRSDL';
    const icon = CURRENCIES[token];

    const balanceUsdFormatted = computed(() => (
      formatToCurrencyDisplay(props.balanceUsd)
    ));

    const balanceFormatted = computed(() => (
      `${formatBalanceDisplay(+toFixed(props.balance, 0))} ${token}`
    ));

    const walletBalanceFormatted = computed(() => (
      `${formatBalanceDisplay(+toFixed(props.walletBalance, 0))} ${token}`
    ));

    const unclaimedBalanceFormatted = computed(() => (
      `${formatBalanceDisplay(+toFixed(props.unclaimedBalance, 0))} ${token}`
    ));

    const otherBalances = computed(() => [
      {
        title: 'Wallet balance',
        value: walletBalanceFormatted.value,
      },
      {
        title: 'Unclaimed balance',
        value: unclaimedBalanceFormatted.value,
      },
    ]);

    return {
      token,
      icon,
      balanceUsdFormatted,
      balanceFormatted,
      otherBalances,
    };
  },
});
</script>

<style lang="scss">
.dashboard-ersdl-balance {
  @include media-lt(desktop) {
    padding: 25px 16px !important;
  }

  &__balance {
    display: flex;
    align-items: center;

    &__value-usd {
      margin-top: 18px;
      font-size: 27px;
      font-weight: 600;
      line-height: 100%;
      letter-spacing: 0.01em;
    }

    &__value-token {
      display: flex;
      align-items: center;
      margin: 2px 0 11px;
      font-size: 14px;
      font-weight: 500;
      line-height: 26px;
      color: #739efa;
    }
  }

  &__other-balance-wrap {
    padding: 8px 0 0;
    border-top: 1px solid rgba(149, 173, 255, 0.1);
  }

  &__other-balance {
    display: flex;
    align-items: center;
    justify-content: space-between;

    & + & {
      margin-top: 5px;
    }

    &__title {
      font-size: 12px;
      font-weight: 500;
      line-height: 26px;
      color: #739efa;
    }

    &__value {
      font-size: 14px;
      font-weight: 600;
      line-height: 26px;
    }
  }

  &__skeleton {
    &__value-usd {
      margin: 22px 0 9px;
    }

    &__value-token {
      margin: 9px 0 15px;
    }

    &__other-balance {
      margin: 4px 0 3px;
    }
  }
}
</style>
