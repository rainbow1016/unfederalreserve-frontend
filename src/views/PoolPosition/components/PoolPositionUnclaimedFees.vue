<template>
  <UnCard
    no-padding
    transparent-dark
    class="pool-position-unclaimed-fees"
  >
    <div class="pool-position-unclaimed-fees__header">
      <div class="pool-position-unclaimed-fees__header-wrap">
        <h5
          class="pool-position-unclaimed-fees__header-title"
          v-text="'Unclaimed fees'"
        />
        <div
          class="pool-position-unclaimed-fees__balance-usd"
          v-text="unclaimed"
        />
      </div>

      <UnBtn
        v-if="!isTablet && withCollect"
        :loading="isLoadingCollectFees"
        text="Collect fees"
        class="pool-position-unclaimed-fees__collect-button"
        @click.prevent="onCollectFeesAction"
      />
    </div>

    <div class="pool-position-unclaimed-fees__balance-tokens">
      <UnInfoField
        :symbol="tokenAData.symbol"
        :value="tokenAData.value"
        class="pool-position-unclaimed-fees__balance-token"
      />
      <UnInfoField
        :symbol="tokenBData.symbol"
        :value="tokenBData.value"
        class="pool-position-unclaimed-fees__balance-token"
      />
    </div>

    <UnSwitch
      v-if="withCollectAsWETH"
      v-model="asWETH"
      label="Collect as WETH"
      class="pool-position-unclaimed-fees__switch"
    />

    <UnBtn
      v-if="isTablet && withCollect"
      :loading="isLoadingCollectFees"
      text="Collect fees"
      class="pool-position-unclaimed-fees__collect-button"
      @click.prevent="onCollectFeesAction"
    />
  </UnCard>
</template>

<script lang="ts">
// eslint-disable-next-line object-curly-newline
import { PropType, defineComponent, computed, ref } from 'vue';
import { useBreakpoints } from '@/composable';
import { Position } from '@/types/common.d';
import { CURRENCIES } from '@/helpers/enums/currencies';
import { formatBalance, formatToCurrencyDisplay } from '@/helpers/formatters';
import { useCore } from '@/store';
import { TransactionPoolCollectFeesPosition, transactionNotifyError } from '@/classes/transaction';

import UnCard from '@/components/ui/UnCard.vue';
import UnBtn from '@/components/ui/UnBtn.vue';
import UnSwitch from '@/components/ui/UnSwitch.vue';
import UnInfoField from '@/components/common/UnInfoField.vue';


const getTokenData = (
  token: Position['base'] | Position['quote'],
  amount: string | undefined,
  asWETH: boolean,
) => ({
  icon: token.symbol && CURRENCIES[token.symbol],
  symbol: (asWETH ? token.symbol : token.symbol?.replace(/^WETH$/, 'ETH')) || 'UNKNOWN',
  value: amount ? formatBalance(+amount) : '-',
});

export default defineComponent({
  name: 'PoolPositionUnclaimedFees',
  components: {
    UnCard,
    UnBtn,
    UnSwitch,
    UnInfoField,
  },
  props: {
    position: {
      type: Object as PropType<Position>,
      required: true,
    },
  },
  setup(props) {
    const asWETH = ref(false);
    const { isTablet } = useBreakpoints();
    const { account } = useCore();
    const isClosed = computed(() => props.position.isClosed);
    const isLoadingCollectFees = ref(false);

    const withCollect = computed(() => {
      const { unclaimedUsd = 0 } = props.position;
      return (
        !isClosed.value
        && unclaimedUsd > 0
      );
    });

    const withCollectAsWETH = computed(() => {
      const { quote, base } = props.position;
      return (
        withCollect.value
        && (quote.symbol === 'WETH' || base.symbol === 'WETH')
      );
    });

    const tokenAData = computed(() => {
      const { quote, unclaimedAmountQuote } = props.position;
      return getTokenData(quote, unclaimedAmountQuote, asWETH.value);
    });

    const tokenBData = computed(() => {
      const { base, unclaimedAmountBase } = props.position;
      return getTokenData(base, unclaimedAmountBase, asWETH.value);
    });

    const unclaimed = computed(() => {
      const { unclaimedUsd } = props.position;
      const compact = unclaimedUsd ? +unclaimedUsd / 1_000_000 >= 10 : false;
      return unclaimedUsd ? formatToCurrencyDisplay(+unclaimedUsd, void 0, compact) : '';
    });

    const transactionPoolCollectFeesPosition = new TransactionPoolCollectFeesPosition();

    const onCollectFeesAction = async () => {
      isLoadingCollectFees.value = true;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await transactionPoolCollectFeesPosition.getTransaction(props.position, asWETH.value);

      if (result && account.value) {
        await transactionPoolCollectFeesPosition.collectFees(props.position, result, asWETH.value);
      } else {
        const text = 'Error with collect fees position transaction';
        transactionNotifyError({ text });
      }

      isLoadingCollectFees.value = false;
    };

    return {
      isLoadingCollectFees,
      tokenAData,
      tokenBData,
      unclaimed,
      withCollect,
      withCollectAsWETH,

      isTablet,
      isClosed,
      asWETH,
      onCollectFeesAction,
    };
  },
});
</script>

<style lang="scss">
.pool-position-unclaimed-fees {
  padding: 20px 17px;

  @include media-gt(tablet) {
    padding: 29px 33px;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 14px;
  }

  &__header-title {
    margin-bottom: 11px;
    font-size: 18px;
    font-weight: 500;
    line-height: 100%;
  }

  &__balance-usd {
    font-size: 38px;
    font-weight: 500;
    line-height: 100%;
    color: #00d395;
  }

  &__collect-button {
    @include media-lt(tablet) {
      margin-top: 28px;
    }

    @include media-gt(tablet) {
      max-width: 180px;
    }
  }

  &__balance-tokens {
    @include media-gt(tablet) {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  &__switch {
    margin-top: 28px;

    @include media-gt(tablet) {
      margin-top: 17px;
    }
  }

  &__balance-token {
    @include media-lt(tablet) {
      & + & {
        margin-top: 6px;
      }
    }

    @include media-gt(tablet) {
      width: calc(50% - 5px);
    }
  }
}
</style>
