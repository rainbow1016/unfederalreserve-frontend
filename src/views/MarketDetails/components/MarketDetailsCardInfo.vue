<template>
  <UnCard
    light
    class="market-details-card-info"
  >
    <div class="market-details-card-info__select-wrap">
      <MarketDetailsSelect
        :all_markets="all_markets"
        :skeleton="skeleton"
        :market_data="market_data"
      />
    </div>

    <div class="market-details-card-info__total-wrap">
      <div class="market-details-card-info__total">
        <div
          v-for="item in settings"
          :key="item.value + item.title"
          :data-testid="item.title"
          class="market-details-card-info__total-item"
        >
          <h5
            v-if="item.title"
            class="market-details-card-info__total-title"
            v-text="item.title"
          />

          <UnSkeleton
            v-if="skeleton"
            height="22px"
            width="70px"
            class="market-details-card-info__skeleton"
          />

          <template v-else>
            <div
              v-if="item.value"
              :class="{ 'is-stub': item.text }"
              class="market-details-card-info__total-value"
              data-testid="value"
            >
              <img
                v-if="item.logo"
                class="market-details-card-info__total-icon"
                :src="item.logo"
              >
              <span
                class="market-details-card-info__total-value-text"
                v-text="item.value"
              />
            </div>

            <span
              v-if="item.subvalue"
              class="market-details-card-info__total-subvalue"
              v-text="item.subvalue"
            />

            <UnTooltip
              :disabled="isCollateralDisabled || isEnteredTheMarket"
              class="market-details-card-info__collateral-wrap"
            >
              <template #activator>
                <UnSwitch
                  v-if="item.collateral"
                  :model-value="isEnteredTheMarket"
                  :readonly="isCollateralReadonly"
                  :disabled="isCollateralDisabled"
                  data-testid="collateral-switch"
                  class="market-details-card-info__collateral"
                  @update:model-value="onClickCollateral(market_account)"
                />
              </template>

              <b>Enable Collateral</b>
              <br>Supply an asset to use it as collateral
            </UnTooltip>
          </template>
        </div>
      </div>
    </div>
  </UnCard>
</template>

<script lang="ts">
import { PropType, defineComponent, computed } from 'vue';
import { Market } from '@/types/common.d';
import { IAllMarket } from '@/types/api/allMarkets';
import { formatBalanceDisplay } from '@/helpers/formatters';
import { formatSymbol } from '@/helpers/formatters/legacy';
import { useModalCollateral } from '@/components/modals/modals';
import { useCore } from '@/store';

import UnCard from '@/components/ui/UnCard.vue';
import UnSkeleton from '@/components/ui/UnSkeleton.vue';
import UnSwitch from '@/components/ui/UnSwitch.vue';
import MarketDetailsSelect from './MarketDetailsSelect.vue';
import UnTooltip from '@/components/ui/UnTooltip.vue';


export default defineComponent({
  name: 'MarketDetailsCardInfo',
  components: {
    UnCard,
    UnSwitch,
    UnTooltip,
    UnSkeleton,
    MarketDetailsSelect,
  },
  props: {
    skeleton: Boolean,
    all_markets: {
      type: Array as PropType<IAllMarket[]>,
      required: true,
    },
    market_data: {
      type: Object as PropType<IAllMarket>,
    },
    market_account: {
      type: Object as PropType<Market>,
    },
  },
  setup: (props) => {
    const modalCollateral = useModalCollateral();
    const { wallet } = useCore();

    const isEnteredTheMarket = computed(() => (
      props.market_account?.isEnteredTheMarket
    ));

    const isCollateralReadonly = computed(() => (
      !props.market_account
      // eslint-disable-next-line no-mixed-operators
      || !isEnteredTheMarket.value && (
        +props.market_account.supply_balance <= 0
      )
    ));

    const isCollateralDisabled = computed(() => (
      !props.market_account
      // eslint-disable-next-line no-mixed-operators
      || !isEnteredTheMarket.value && (
        // eslint-disable-next-line no-underscore-dangle
        props.market_account._tokenMetadata.collateralFactorMantissa.isZero()
      )
    ));

    const settings = computed(() => {
      const { market_account, market_data } = props;

      const settingsObject = {
        supply_balance: {
          value: market_data?.mintGuardianPaused ? 'Disabled' : '-',
          subvalue: '',
          title: 'Supply balance',
          text: true,
        },
        borrow_balance: {
          value: market_data?.borrowGuardianPaused ? 'Disabled' : '-',
          subvalue: '',
          title: 'Borrow balance',
          text: true,
        },
        wallet_balance: {
          value: '-',
          subvalue: '',
          title: 'Wallet balance',
          logo: wallet.value.current_provider_settings?.logo,
          text: true,
        },
        collateral: {
          title: 'Collateral',
          collateral: true,
        },
      };

      if (!market_account) return settingsObject;

      // eslint-disable-next-line object-curly-newline
      const { symbol, supply_balance, borrow_balance, balance } = market_account;
      const symbol_f = formatSymbol(symbol);
      const isLegacy = symbol.includes('legacy');

      const settingsSupply = settingsObject.supply_balance;
      const settingsBorrow = settingsObject.borrow_balance;
      const settingsWallet = settingsObject.wallet_balance;

      if (+supply_balance > 0) {
        const value = formatBalanceDisplay(supply_balance);

        if (isLegacy) {
          settingsSupply.value = value;
          settingsSupply.subvalue = symbol_f;
        } else {
          settingsSupply.value = `${value} ${symbol_f}`;
        }

        settingsSupply.text = false;
      } else if (market_data?.mintGuardianPaused) {
        settingsSupply.value = 'Disabled';
      } else {
        settingsSupply.value = 'Not supplying';
      }

      if (+borrow_balance > 0) {
        const value = formatBalanceDisplay(borrow_balance);

        if (isLegacy) {
          settingsBorrow.value = value;
          settingsBorrow.subvalue = symbol_f;
        } else {
          settingsBorrow.value = `${value} ${symbol_f}`;
        }

        settingsBorrow.text = false;
      } else if (market_data?.borrowGuardianPaused) {
        settingsBorrow.value = 'Disabled';
      } else {
        settingsBorrow.value = 'Not borrowing';
      }

      if (isLegacy) {
        const value = `${formatBalanceDisplay(balance)}`;
        settingsWallet.text = false;
        settingsWallet.value = value;
        settingsWallet.subvalue = symbol_f;
      } else {
        const value = `${formatBalanceDisplay(balance)} ${symbol_f}`;
        settingsWallet.text = false;
        settingsWallet.value = value;
      }

      return settingsObject;
    });

    const onClickCollateral = (market: Market) => {
      void modalCollateral.show({ market });
    };

    return {
      settings,
      isEnteredTheMarket,
      isCollateralReadonly,
      isCollateralDisabled,
      onClickCollateral,
    };
  },
});
</script>

<style lang="scss">
.market-details-card-info {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  padding: 21px 39px 17px 24px !important;

  @include media-lt(desktop) {
    flex-direction: column;
    padding: 29px 15px 36px 15px !important;
    margin-bottom: 20px;
  }

  &__select-wrap {
    position: relative;
    z-index: 3;
    display: flex;

    @include media-lt(desktop) {
      width: 100%;
      margin-bottom: 20px;
    }
  }

  &__total-wrap {
    width: 100%;
    margin-left: 55px;

    @include media-lt(desktop) {
      max-width: 100%;
      padding: 0 5px;
      margin-left: 0;
    }
  }

  &__total {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    &-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-weight: 600;
      text-align: center;

      @include media-lt(tablet) {
        width: 50%;
        margin-top: 20px;
        margin-bottom: 12px;
      }

      &:not(:last-child) {
        @include media-lt(tablet) {
          &:nth-child(2n+1) {
            padding-right: 16px;
            border-right: 2px solid $un-color-blue-3;
          }
        }

        @include media-gt(tablet) {
          padding-right: 44px;
          border-right: 2px solid $un-color-blue-3;
        }
      }
    }

    &-title {
      margin-bottom: 6px;
      font-size: 14px;
      line-height: 26px;
      color: $un-color-gray-1;
      word-break: break-word;
    }

    &-value {
      min-height: 22px;

      &:not(.is-stub) {
        display: flex;
        font-size: 22px;
        line-height: 100%;
        color: white;
        letter-spacing: 0.01em;
      }

      &.is-stub {
        font-size: 16px;
        color: $un-color-soft-gray;
      }
    }

    &-icon {
      width: 21px;
      height: 21px;
      margin-right: 6px;

      @include media-lt(tablet) {
        display: none;
      }
    }

    &-subvalue {
      font-size: 15px;
      font-weight: 400;
      color: white;
    }
  }

  &__collateral {
    margin: 0 0 11px;
  }
}
</style>
