<template>
  <div class="market-details-select">
    <UnDropdown>
      <template #selected>
        <img
          :src="selectedItem?.icon"
          class="market-details-select__selected-icon"
        >
        <div class="market-details-select__selected-info">
          <div
            class="market-details-select__selected-name"
            v-text="selectedItem?.symbol_f"
          />

          <UnSkeleton
            v-if="skeleton"
            height="15px"
            width="70px"
            class="market-details-select__skeleton"
          />

          <div
            v-else
            class="market-details-select__selected-price"
            v-text="selectedItem.price"
          />
        </div>
      </template>

      <template #listItem>
        <ul class="market-details-select__lists">
          <li
            v-for="item in options"
            :key="item.address"
            :class="{ 'is-active': item.selected }"
          >
            <router-link
              :to="item.to"
              class="market-details-select__item"
              :class="{ 'is-active': item.selected }"
            >
              <img
                :src="item.icon"
                class="market-details-select__item-icon"
              >
              <div
                class="market-details-select__item-name"
                v-text="item.symbol_f"
              />
            </router-link>
          </li>
        </ul>
      </template>
    </UnDropdown>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, computed } from 'vue';
import { IAllMarket } from '@/types/api/allMarkets';
import { formatToCurrency } from '@/helpers/formatters';
import { formatSymbol } from '@/helpers/formatters/legacy';
import { CURRENCIES } from '@/helpers/enums/currencies';
import { ROUTE_MARKET_DETAILS } from '@/helpers/enums/routes';

import UnDropdown from '@/components/ui/UnDropdown.vue';
import UnSkeleton from '@/components/ui/UnSkeleton.vue';

export default defineComponent({
  name: 'MarketDetailsSelect',
  components: {
    UnDropdown,
    UnSkeleton,
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
  },
  setup: (props) => {
    const options = computed(() => (
      props.all_markets.map((market) => ({
        address: market.address,
        price: formatToCurrency(market.price),
        symbol: market.underlyingSymbol,
        symbol_f: formatSymbol(market.underlyingSymbol),
        icon: CURRENCIES[market.underlyingSymbol],
        to: {
          name: ROUTE_MARKET_DETAILS,
          params: { symbol: market.underlyingSymbol },
        },
        selected: market.underlyingSymbol === props.market_data?.underlyingSymbol,
      }))
    ));

    const selectedItem = computed(() => options.value.find((_) => (
      _.symbol === props.market_data?.underlyingSymbol
    )));

    return {
      options,
      selectedItem,
    };
  },
});
</script>

<style lang="scss">
.market-details-select {
  position: relative;
  z-index: 1;
  width: 253px;

  @include media-lt(tablet) {
    width: 100%;
  }

  &__selected {
    &-icon {
      width: 33px;
      margin-right: 17px;
    }

    &-info {
      width: calc(100% - 75px);
    }

    &-name {
      overflow: hidden;
      font-size: 28px;
      font-weight: 700;
      line-height: 34px;
      color: $un-color-white;
      text-overflow: ellipsis;
      letter-spacing: 0.01em;
      white-space: nowrap;
    }

    &-price {
      font-size: 15px;
      font-weight: 600;
      line-height: 100%;
      color: $un-color-gray-1;
    }
  }

  &__lists {
    max-height: 291px;
  }

  &__item {
    display: flex;
    align-items: center;
    padding: 8px 27px 9px;
    text-decoration: none;
    cursor: pointer;

    &.is-active {
      pointer-events: none;
      background-color: $un-color-blue-2;
    }

    &:hover {
      background-color: $un-color-blue-2;
    }

    &-icon {
      width: 18px;
      margin-right: 15px;
    }

    &-name {
      font-size: 15px;
      font-weight: 600;
      line-height: 26px;
      color: $un-color-white;
    }
  }
}

</style>
