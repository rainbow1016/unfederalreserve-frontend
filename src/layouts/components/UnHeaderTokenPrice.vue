<template>
  <UnHeaderCard class="un-header-token-price">
    <template #default>
      <img
        v-svg-inline
        src="@/assets/images/currency/base-tsp.svg"
        class="un-header-token-price__icon"
      >

      <UnLoaderCircle
        v-if="isLoadingStart"
        small
        class="un-header-balance__loader"
      />
      <span
        v-else
        class="un-header-token-price__value"
        v-text="ersdlPriceUsd"
      />
    </template>
  </UnHeaderCard>
</template>

<script lang="ts">
import { defineComponent, computed, onBeforeUnmount } from 'vue';
import { useCore, useErsdlPrice } from '@/store';
import { formatToCurrency } from '@/helpers/formatters';

import UnHeaderCard from './UnHeaderCard.vue';
import UnLoaderCircle from '@/components/ui/UnLoaderCircle.vue';


const FETCH_TIMEOUT = 60_000;

export default defineComponent({
  name: 'UnHeaderTokenPrice',
  components: {
    UnHeaderCard,
    UnLoaderCircle,
  },
  setup() {
    const { appEnv } = useCore();
    const { isLoading, data: ersdlPrice, fetchData } = useErsdlPrice();

    const isLoadingStart = computed(() => (
      isLoading.value && !ersdlPrice.value
    ));

    const ersdlPriceUsd = computed(() => (
      formatToCurrency(ersdlPrice.value)
    ));

    void fetchData(appEnv.value);

    const intervalId = setInterval(() => {
      void fetchData(appEnv.value);
    }, FETCH_TIMEOUT);

    onBeforeUnmount(() => {
      clearTimeout(intervalId);
    });

    return {
      isLoadingStart,
      ersdlPriceUsd,
    };
  },
});
</script>

<style lang="scss">
.un-header-token-price {
  padding: 0 10px;

  &__icon {
    width: 20px;
    margin-right: 7px;
  }
}
</style>
