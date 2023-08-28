<template>
  <UnCard
    transparent-dark
    class="dashboard-lending-position"
  >
    <DashboardSectionHeader
      title="Lending Position"
      class="dashboard-lending-position__header"
    />

    <UnExpansionPanel
      v-for="item in expansionOptions"
      :key="item.text"
      class="dashboard-lending-position__expansion-panel"
      :progress="item.progressStyles ? item.progressStyles : null"
    >
      <template #main>
        <DashboardInfoCard
          :loading="loading"
          :skeleton="skeleton"
          :value="item.value"
          :subvalue="item.subvalue"
          :text="item.text"
          :icon="item.icon"
          :text-orange="item.textOrange"
          class="dashboard-lending-position__info"
        />
      </template>

      <template #item>
        <HomeMarketsTableCard
          v-bind="item.lendTable"
          :loading="loading"
          :skeleton="skeleton"
          transparent
          no-title
          class="dashboard-lending-position__user-info"
        />
      </template>
    </UnExpansionPanel>
  </UnCard>
</template>

<script lang="ts">
import { PropType, defineComponent, computed } from 'vue';
import { Account } from '@/types/common.d';
import { USER_SUPPLY_TABLE_SETTINGS, USER_BORROWINGS_TABLE_SETTINGS } from '../utils';
import { formatToCurrencyDisplay, formatPercentDisplay } from '@/helpers/formatters';
import { toFixed } from '@/helpers/toFixed';

import DashboardSectionHeader from './DashboardSectionHeader.vue';
import DashboardInfoCard from './DashboardInfoCard.vue';

import HomeMarketsTableCard from '@/views/Home/components/HomeMarketsTableCard.vue';

import UnCard from '@/components/ui/UnCard.vue';
import UnExpansionPanel from '@/components/ui/UnExpansionPanel.vue';


export default defineComponent({
  name: 'DashboardLendingPosition',
  components: {
    DashboardSectionHeader,
    DashboardInfoCard,
    HomeMarketsTableCard,
    UnCard,
    UnExpansionPanel,
  },
  props: {
    loading: Boolean,
    skeleton: Boolean,
    account: {
      type: Object as PropType<Account>,
    },
  },
  setup(props) {
    const totalSupplyUsdFormatted = computed(() => {
      if (!props.account) return '-';
      return formatToCurrencyDisplay(props.account?.total_supply || 0);
    });

    const totalBorrowUsdFormatted = computed(() => (
      formatToCurrencyDisplay(props.account?.total_borrow || 0)
    ));

    const netApy = computed(() => (
      formatPercentDisplay(props.account?.net_apy || 0)
    ));

    const netApyFormatted = computed(() => (
      `Net APY: ${netApy.value}`
    ));

    const borrowLimitPercent = computed(() => {
      const totalBorrow = props.account?.total_borrow || 0;
      const borrowLimit = props.account?.borrow_limit || 0;
      const val = toFixed(100 * (totalBorrow / borrowLimit), 2);
      return Math.round(+val) === +val ? Math.round(+val) : +val;
    });

    const borrowLimitPercentFormatted = computed(() => (
      formatPercentDisplay(borrowLimitPercent.value || 0)
    ));

    const borrowLimitFormatted = computed(() => (
      `Borrow Limit: ${borrowLimitPercentFormatted.value}`
    ));

    const progressStyles = computed(() => (
      `${borrowLimitPercent.value < 0.1 ? 0 : borrowLimitPercent.value}%`
    ));

    const userSupply = computed(() => ({
      ...USER_SUPPLY_TABLE_SETTINGS,
      title: void 0,
      markets: props.account
        ? props.account.user_supplied_markets
        : Array.from({ length: 4 }),
    }));

    const userBorrow = computed(() => ({
      ...USER_BORROWINGS_TABLE_SETTINGS,
      title: void 0,
      markets: props.account
        ? props.account.user_borrowed_markets
        : Array.from({ length: 4 }),
    }));

    const expansionOptions = computed(() => ([
      {
        value: totalSupplyUsdFormatted.value,
        subvalue: netApyFormatted.value,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, global-require
        icon: require('@/assets/images/icons/archive.svg'),
        text: 'Lending Supply Balance',
        textOrange: false,
        lendTable: userSupply.value,
      },
      {
        value: totalBorrowUsdFormatted.value,
        subvalue: borrowLimitFormatted.value,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, global-require
        icon: require('@/assets/images/icons/percent.svg'),
        text: 'Lending Borrow Balance',
        textOrange: true,
        lendTable: userBorrow.value,
        progressStyles: progressStyles.value,
      },
    ]));

    return {
      expansionOptions,
    };
  },
});
</script>

<style lang="scss">
.dashboard-lending-position {
  @include media-lt(desktop) {
    padding: 25px 16px !important;
  }

  &__header {
    margin-bottom: 23px;
  }

  &__expansion-panel {
    & + & {
      margin-top: 16px;
    }
  }
}
</style>
