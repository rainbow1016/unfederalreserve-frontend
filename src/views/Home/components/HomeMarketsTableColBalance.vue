<template>
  <div class="home-markets-table-col-balance">
    <UnTooltip
      :disabled="!tooltipUsd"
      :content-text="tooltipUsd"
      content-min-width="100px"
    >
      <template #activator>
        <div
          :class="{ 'is-green': green, 'is-brown': brown }"
          class="home-markets-table-col-balance__usd"
          v-text="usd"
        />
      </template>
    </UnTooltip>

    <UnTooltip
      :disabled="!tooltipValue"
      :content-text="tooltipValue"
      content-min-width="100px"
    >
      <template #activator>
        <div
          class="home-markets-table-col-balance__value"
          v-text="value"
        />
      </template>
    </UnTooltip>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import UnTooltip from '@/components/ui/UnTooltip.vue';


export default defineComponent({
  name: 'HomeMarketsTableColBalance',
  components: {
    UnTooltip,
  },
  inheritAttrs: false,
  props: {
    green: Boolean,
    brown: Boolean,
    tooltipUsd: String,
    tooltipValue: String,
    usd: {
      type: String as PropType<string>,
      required: true,
    },
    value: {
      type: String as PropType<string>,
    },
  },
});
</script>

<style lang="scss">
.home-markets-table-col-balance {
  line-height: 26px;

  &__usd {
    font-size: 15px;
    font-weight: 600;

    &.is-brown {
      color: #ea9650;
    }

    &.is-green {
      color: #00ffc2;
    }
  }

  &__value {
    font-size: 12px;
    font-weight: 500;
    color: $un-color-soft-gray;
  }
}
</style>
