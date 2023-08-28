<template>
  <div class="home-markets-table-col-asset">
    <span
      v-if="loading"
      class="home-markets-table-col-asset__loader"
    />
    <img
      v-if="icon"
      :src="icon"
      :alt="symbol"
      class="home-markets-table-col-asset__symbol"
    >
    <span class="home-markets-table-col-asset__name">
      {{ symbol }}
    </span>

    <UnTooltip
      v-if="paused"
      :content-text="tooltipPaused"
      content-width="320px"
    >
      <template #activator>
        <img
          v-svg-inline
          :src="require('@/assets/images/icons/paused.svg')"
          class="home-markets-table-col-asset__paused"
        >
      </template>
    </UnTooltip>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { CURRENCIES } from '@/helpers/enums/currencies';

import UnTooltip from '@/components/ui/UnTooltip.vue';


export default defineComponent({
  name: 'HomeMarketsTableColAsset',
  components: {
    UnTooltip,
  },
  inheritAttrs: false,
  props: {
    symbol: {
      type: String,
      required: true,
    },
    paused: {
      type: Boolean,
      required: true,
    },
    loading: {
      type: Boolean,
    },
    tooltipPaused: {
      type: String,
    },
  },
  setup: (props) => {
    const icon = CURRENCIES[props.symbol];

    return {
      icon,
    };
  },
});
</script>

<style lang="scss">
.home-markets-table-col-asset {
  display: flex;
  align-items: center;
  font-size: 15px;

  &__loader {
    position: absolute;
    z-index: 3;
    display: block;
    width: 36px;
    height: 36px;
    margin-left: -3px;
    content: "";
    border: 2px solid #6095ff;
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @include media-lte(tablet-xs) {
      width: 21px;
      height: 21px;
      margin-left: -3px;
    }
  }

  &__symbol {
    width: 30px;
    height: 30px;
    margin-right: 10px;

    @include media-lte(tablet-xs) {
      width: 15px;
      height: 15px;
      margin-right: 8px;
    }
  }

  &__paused {
    margin-left: 10px;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
