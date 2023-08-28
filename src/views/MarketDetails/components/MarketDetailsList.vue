<template>
  <ul class="market-details-list">
    <li
      v-for="(item, index) in data"
      :key="index"
      class="market-details-list__item"
    >
      <span
        class="market-details-list__title"
        v-text="item.title"
      />

      <UnSkeleton
        v-if="skeleton"
        height="16px"
        width="70px"
        class="market-details-list__value market-details-list__skeleton"
      />

      <strong
        v-else
        class="market-details-list__value"
        :data-testid="item.title"
        v-text="item.value"
      />
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import UnSkeleton from '@/components/ui/UnSkeleton.vue';


export default defineComponent({
  name: 'MarketDetailsList',
  components: {
    UnSkeleton,
  },
  props: {
    skeleton: Boolean,
    data: {
      type: Array,
      reuired: true,
    },
  },
});
</script>

<style lang="scss">
.market-details-list {
  &__item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  &__title {
    margin-right: 10px;
    font-size: 15px;
    font-weight: 600;
    line-height: 26px;
    color: $un-color-blue-5;
    white-space: nowrap;
  }

  &__value {
    font-size: 15px;
    font-weight: 600;
    line-height: 26px;
    color: $un-color-white;
    text-align: right;
    word-break: break-word;
  }

  &__skeleton {
    margin: 5px 0;
  }
}
</style>
