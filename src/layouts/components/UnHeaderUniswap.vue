<template>
  <UnHeaderCard
    class="un-header-uniswap"
    :clickable="clickable"
  >
    <slot>
      <UnTooltip
        :content-text="tooltipText"
        content-width="220px"
        class="un-header-uniswap__tooltip"
      >
        <template #activator>
          <!-- eslint-disable-next-line vuejs-accessibility/anchor-has-content -->
          <a
            class="un-header-uniswap__link"
            :href="hrefToSwap"
            target="_blank"
          >
            <img
              src="@/assets/images/currency/UNI.svg"
              class="un-header-uniswap__icon"
            >
          </a>
        </template>
      </UnTooltip>
    </slot>
  </UnHeaderCard>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { env as ENV } from '@/global/env';
import { useCore } from '@/store';

import UnHeaderCard from './UnHeaderCard.vue';
import UnTooltip from '@/components/ui/UnTooltip.vue';

const tooltipText = `
  Purchase eRSDL here.
  <br>Note: please ensure uniswap connected wallet matches your
  lending platform connected wallet address before buying
`;

export default defineComponent({
  name: 'UnHeaderUniswap',
  components: {
    UnHeaderCard,
    UnTooltip,
  },
  props: {
    clickable: Boolean,
  },
  setup() {
    const { appEnv } = useCore();
    const DEFAULT_ENV = ENV[process.env.VUE_APP_DEFAULT_NETWORK];

    const hrefToSwap = computed(() => {
      const address = (appEnv.value || DEFAULT_ENV).eRSDL_ADDRESS;
      return `https://app.uniswap.org/#/swap?outputCurrency=${address}&inputCurrency=ETH`;
    });

    return {
      tooltipText,
      hrefToSwap,
    };
  },
});
</script>

<style lang="scss">
.un-header-uniswap {
  &__tooltip {
    height: 100%;
  }

  &__link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 33px;
    height: 100%;
  }

  &__icon {
    width: 20px;
  }
}
</style>
