<template>
  <div class="un-modal-transaction-balance">
    <span class="un-modal-transaction-balance__input-label">
      {{ inputLabel }}
    </span>
    <div class="un-modal-transaction-balance__wrapper">
      <span class="un-modal-transaction-balance__value" data-testid="transaction-balance">
        {{ label }}:

        <UnSkeleton
          v-if="skeleton"
          height="12px"
          width="70px"
          class="un-modal-transaction-balance__value-formatted un-modal-transaction-balance__skeleton"
        />

        <span
          v-else
          class="un-modal-transaction-balance__value-formatted"
          v-text="value_f"
        />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { formatBalanceDisplay } from '@/helpers/formatters';
import { formatSymbol } from '@/helpers/formatters/legacy';

import UnSkeleton from '@/components/ui/UnSkeleton.vue';


export default defineComponent({
  name: 'UnModalTransactionBalance',
  components: {
    UnSkeleton,
  },
  props: {
    skeleton: Boolean,
    label: {
      type: String,
      required: true,
    },
    value: {
      type: [Number, String],
      required: true,
    },
    symbol: {
      type: String,
      required: true,
    },
    inputLabel: {
      type: String,
    },
  },
  setup(props) {
    const value_f = computed(() => (
      `${formatBalanceDisplay(props.value)} ${formatSymbol(props.symbol)}`
    ));

    return {
      value_f,
    };
  },
});
</script>

<style lang="scss">
.un-modal-transaction-balance {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  color: #739efa;

  &__input-label {
    font-size: 12px;
    color: #fff;
  }

  &__value {
    margin-left: 5px;
    font-size: 14px;
    font-weight: 500;
  }

  &__value-formatted {
    margin-left: 5px;
  }

  &__skeleton {
    display: inline-flex;
  }
}
</style>
