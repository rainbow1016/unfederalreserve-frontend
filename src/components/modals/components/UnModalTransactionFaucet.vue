<template>
  <div class="un-modal-transaction-faucet">
    <span
      :class="{ 'is-disabled': disabled }"
      class="un-modal-transaction-faucet__link"
      @click="$emit('faucet')"
      v-text="'Faucet'"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';


export default defineComponent({
  name: 'UnModalTransactionFaucet',
  props: {
    disabled: Boolean,
  },
  emits: ['faucet'],
});
</script>

<style lang="scss">
.un-modal-transaction-faucet {
  text-align: center;

  &__link {
    font-weight: 600;
    color: #a8b6c7;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: $un-color-blue-4;
    }

    &.is-disabled {
      pointer-events: none;
    }
  }
}
</style>
