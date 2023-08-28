<template>
  <div class="pool-add-liquidity-header">
    <div class="pool-add-liquidity-header__header">
      <div
        class="pool-add-liquidity-header__title"
        data-testid="title"
        v-text="'Select Pair'"
      />

      <UnCheckbox
        :model-value="singleSide"
        label-text="Single-Sided Staking"
        data-testid="single-side-staking"
        @update:model-value="$emit('update:singleSide', $event)"
      />
    </div>

    <UnAttentionCard
      v-if="singleSide"
      class="pool-add-liquidity-main-card__attention-card"
      data-testid="attention-card"
    >
      <template #text>
        <strong>No immediate APY.</strong>
        You will start earning once the eRSDL price rises by
        {{ priceRisesPercent }}
      </template>
    </UnAttentionCard>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import UnAttentionCard from '@/components/common/UnAttentionCard.vue';
import UnCheckbox from '@/components/ui/UnCheckbox.vue';


export default defineComponent({
  name: 'PoolAddLiquidityHeader',
  components: {
    UnAttentionCard,
    UnCheckbox,
  },
  props: {
    singleSide: Boolean,
    priceRisesPercent: String,
  },
  emits: ['update:singleSide'],
});
</script>

<style lang="scss">
.pool-add-liquidity-header {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    @include media-gt(tablet) {
      margin-bottom: 23px;
    }
  }

  &__title {
    font-size: 18px;
    font-weight: 500;
    line-height: 144%;
  }
}
</style>
