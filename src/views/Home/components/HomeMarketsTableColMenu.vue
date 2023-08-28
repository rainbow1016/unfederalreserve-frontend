<template>
  <UnTooltip
    v-model="isActive"
    bottom
    handler="custom"
    content-class="home-markets-table-col-menu__content"
    :class="classIndex"
    class="home-markets-table-col-menu"
  >
    <template #activator>
      <div
        :class="{ 'is-active': isActive }"
        class="home-markets-table-col-menu__dots"
        @click.stop="isActive = !isActive"
      >
        <div class="home-markets-table-col-menu__dot" />
        <div class="home-markets-table-col-menu__dot" />
        <div class="home-markets-table-col-menu__dot" />
      </div>
    </template>

    <div class="home-markets-table-col-menu__dropdown">
      <div
        v-for="(item, index) in dropdownList"
        :key="index"
        class="home-markets-table-col-menu__item"
        @click="item.handler"
        v-text="item.label"
      />
    </div>
  </UnTooltip>
</template>

<script lang="ts">
import { PropType, defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ROUTE_MARKET_DETAILS } from '@/helpers/enums/routes';
import { TransactionAddToMetaMask } from '@/classes/transaction';
import { Market } from '@/types/common.d';
import { useOutsideClick } from '@/composable';

import UnTooltip from '@/components/ui/UnTooltip.vue';


export default defineComponent({
  name: 'HomeMarketsTableColMenu',
  components: {
    UnTooltip,
  },
  inheritAttrs: false,
  props: {
    symbol: {
      type: String,
      required: true,
    },
    unSymbol: {
      type: String,
      required: true,
    },
    market: {
      type: Object as PropType<Market>,
      required: true,
    },
  },
  setup(props) {
    const isActive = ref(false);
    const classIndex = `is-symbol--${props.symbol}`;
    const router = useRouter();

    const openMarket = () => {
      void router.push({
        name: ROUTE_MARKET_DETAILS,
        params: { symbol: props.symbol },
      });
    };

    const transactionAddToMetaMask = new TransactionAddToMetaMask(props.market);

    const addToMetaMask = (isUnderlying: boolean) => {
      void transactionAddToMetaMask.addAssetToMetaMask(isUnderlying);
    };

    const dropdownList = [
      {
        label: 'View Market Info',
        handler: openMarket,
      },
      {
        label: `Add ${props.symbol} to Wallet`,
        handler: () => addToMetaMask(true),
      },
      {
        label: `Add ${props.unSymbol} to Wallet`,
        handler: () => addToMetaMask(false),
      },
    ];

    useOutsideClick(
      `.home-markets-table-col-menu.${classIndex}`,
      () => { isActive.value = false; },
    );

    return {
      isActive,
      classIndex,
      dropdownList,

      openMarket,
      addToMetaMask,
    };
  },
});
</script>

<style lang="scss">
.home-markets-table-col-menu {
  $root: &;

  &__dots {
    display: none;
    align-items: center;
    justify-content: space-between;
    width: 30px;
    height: 30px;
    padding: 0 6px;
    cursor: pointer;
    background: transparent;
    border-radius: 50%;
    transition: background 0.2s;

    &:hover,
    &.is-active {
      background: #2f4ba6;
    }

    @media (hover: hover) and (pointer: fine) {
      .is-hoverable:hover &,
      &.is-active {
        display: flex;
      }
    }
  }

  &__dot {
    width: 4px;
    height: 4px;
    background: #95a9e9;
    border-radius: 50%;
  }

  &__content {
    padding: 0;
    background: transparent;
  }

  &__dropdown {
    width: 100%;
    background: #1a327e;
    border: 1px solid #27459d;
    border-radius: 10px;
  }

  &__item {
    display: flex;
    justify-content: flex-start;
    padding: 13px 0 13px 18px;
    font-size: 14px;
    font-weight: 500;
    line-height: 100%;
    color: #84adfe;
    letter-spacing: 0.01em;
    cursor: pointer;
    transition: color 0.2s, background 0.2s;

    &:hover {
      color: white;
      background: #2b428f;
    }
  }
}
</style>
