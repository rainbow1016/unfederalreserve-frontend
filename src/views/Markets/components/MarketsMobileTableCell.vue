<template>
  <div class="markets-mobile-table-cell">
    <div class="markets-mobile-table-cell__label">
      {{ title }}
    </div>

    <UnSkeleton
      v-if="skeleton"
      height="16px"
      width="70px"
      class="markets-mobile-table-cell__skeleton"
    />

    <MarketsAllTableColChanges
      v-else
      :value="value"
      :changes="changes"
      :percent="percent"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import MarketsAllTableColChanges from './MarketsAllTableColChanges.vue';
import UnSkeleton from '@/components/ui/UnSkeleton.vue';

export default defineComponent({
  name: 'MarketsMobileTableCell',
  components: {
    MarketsAllTableColChanges,
    UnSkeleton,
  },
  props: {
    loading: Boolean,
    skeleton: Boolean,
    title: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    changes: {
      type: Number,
      required: true,
    },
    percent: {
      type: Boolean,
      required: true,
    },
  },
});
</script>

<style lang="scss">
.markets-mobile-table-cell {
  $root: &;

  width: 50%;
  margin-bottom: 13px;
  text-align: right;

  &:nth-child(1),
  &:nth-child(2) {
    #{$root}__label {
      margin-bottom: 23px;
    }
  }

  &__label {
    margin-bottom: 8px;
    font-size: 12px;
    font-weight: 600;
    line-height: 18px;
    color: $un-color-soft-gray;
  }

  &__skeleton {
    display: inline-flex;
    margin: 11px 0 10px;
  }
}
</style>
