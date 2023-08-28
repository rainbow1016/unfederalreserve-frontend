<template>
  <div
    class="pool-position-overview"
    :class="{ 'is-active': active }"
  >
    <h5
      v-if="title"
      class="pool-position-overview__title"
      v-text="title"
    />

    <div
      v-if="!poolList.length"
      class="pool-position-overview__empty"
      data-testid="empty-pool-positions"
      v-text="emptyText"
    />

    <PoolPosition
      v-for="position in poolList"
      :key="position.tokenId"
      v-bind="position"
      :active="active"
      :skeleton="skeleton"
      :pending="pending"
      class="pool-position-overview__item"
    />
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { IPositionData } from '@/types/common.d';

import PoolPosition from './PoolPosition.vue';


export default defineComponent({
  name: 'PoolPositionOverview',
  components: {
    PoolPosition,
  },
  props: {
    active: Boolean,
    skeleton: Boolean,
    pending: Boolean,
    emptyText: String,
    title: String,
    poolList: {
      type: Array as PropType<IPositionData[]>,
      required: true,
    },
  },
});
</script>

<style lang="scss">
.pool-position-overview {
  $root: &;

  letter-spacing: 0.01em;
  word-spacing: 0;

  &__title {
    margin-bottom: 23px;
    font-size: 14px;
    font-weight: 500;
    line-height: 100%;

    @include media-gt(tablet) {
      margin-bottom: 11px;
    }
  }

  &__empty {
    padding: 44px 0;
    margin: 6px 0;
    font-size: 17px;
    line-height: 25px;
    color: $un-color-soft-gray;
    text-align: center;
    background: rgba(3, 9, 32, 0.2);
    backdrop-filter: blur(5px);
    border-radius: 20px;

    @include media-gt(tablet) {
      padding: 36px 0;
    }
  }

  &__item {
    margin: 0 0 16px;
  }
}
</style>
