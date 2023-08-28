<template>
  <div class="market-details-balance">
    <UnTooltip
      :content-text="tooltipText"
      :activator-text="label"
      class="market-details-balance__title"
      bordered
    />

    <UnSkeleton
      v-if="skeleton"
      height="16px"
      width="70px"
      class="market-details-balance__skeleton"
    />

    <template v-else>
      <strong
        class="market-details-balance__percent"
        :data-testid="label"
        v-text="percent"
      />
      <div
        class="market-details-balance__changes"
        :class="{
          'is-up': up,
          'is-down': down
        }"
        :data-testid="`${label}-change`"
        v-text="changes"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import UnTooltip from '@/components/ui/UnTooltip.vue';
import UnSkeleton from '@/components/ui/UnSkeleton.vue';


export default defineComponent({
  name: 'MarketDetailsBalance',
  components: {
    UnTooltip,
    UnSkeleton,
  },
  props: {
    skeleton: Boolean,
    label: {
      type: String,
      required: true,
    },
    tooltipText: {
      type: String,
      required: true,
    },
    percent: {
      type: String,
      required: true,
    },
    changes: {
      type: String,
      required: true,
    },
    up: {
      type: Boolean,
      required: true,
    },
    down: {
      type: Boolean,
      required: true,
    },
  },
});
</script>

<style lang="scss">
.market-details-balance {
  @include media-lt(tablet) {
    text-align: center;
  }

  &__title {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
    font-weight: 600;
    line-height: 26px;
    color: $un-color-gray-1;
    word-break: break-word;

    @include media-lt(tablet) {
      font-size: 12px;
      line-height: 16.68px;
    }
  }

  &__percent {
    display: block;
    font-size: 22px;
    font-weight: 600;
    line-height: 100%;
    color: $un-color-white;
    letter-spacing: 0.01em;

    @include media-lt(tablet) {
      font-size: 16px;
    }
  }

  &__changes {
    margin-left: 1px;
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    color: $un-color-gray-1;

    &.is-up {
      color: $un-color-green;
    }

    &.is-down {
      color: $un-color-red;
    }
  }

  &__skeleton {
    margin: 15px 0;

    @include media-lt(tablet) {
      margin: 12px 0;
    }
  }
}
</style>
