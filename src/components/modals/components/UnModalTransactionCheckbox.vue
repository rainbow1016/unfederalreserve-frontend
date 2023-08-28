<template>
  <label
    class="un-modal-transaction-checkbox"
    :class="{ 'is-blue': blue }"
  >
    <input
      v-model="value"
      type="checkbox"
      class="un-modal-transaction-checkbox__input"
      @change="$emit('update:modelValue', value)"
    >
    <UnTooltip
      :content-text="checkboxTooltip"
      content-width="220px"
    >
      <template #activator>
        <span
          :class="{ 'is-checked': modelValue }"
          class="un-modal-transaction-checkbox__mark"
        />
      </template>
    </UnTooltip>

    <div class="un-modal-transaction-checkbox__text">
      I understand that keeping my Borrow Limit
      <span class="un-modal-transaction-checkbox__below">below 80%</span>
      is crucial to avoid liquidation and irreversible loss of supplied tokens.
    </div>
  </label>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import UnTooltip from '@/components/ui/UnTooltip.vue';


export default defineComponent({
  name: 'UnModalTransactionCheckbox',
  components: { UnTooltip },
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    blue: Boolean,
  },
  emits: ['update:modelValue'],
  setup: (props) => {
    const value = ref(props.modelValue);
    const checkboxTooltip = 'Please check this box if you want to proceed';

    return {
      value,
      checkboxTooltip,
    };
  },
});
</script>

<style lang="scss">
$checkbox-size: 18px;

.un-modal-transaction-checkbox {
  $root: &;

  display: flex;
  font-size: 13px;
  font-weight: 500;
  color: $un-color-midnight-express;
  cursor: pointer;
  user-select: none;

  &.is-blue {
    color: white;

    #{$root}__mark {
      background-color: #1a327c;
      border: 1px solid #314a96;
    }
  }

  &__input {
    display: none;
  }

  &__mark {
    position: relative;
    display: block;
    width: $checkbox-size;
    min-width: $checkbox-size;
    height: $checkbox-size;
    background-color: #f9fafb;
    border: 1px solid #c2cfe0;
    border-radius: 2px;

    &::after {
      position: absolute;
      top: 0;
      left: 5px;
      width: 7px;
      height: 12px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }

    &.is-checked {
      background-color: $un-color-normal;
      border-color: $un-color-normal;

      &::after {
        display: block;
        content: "";
      }
    }
  }

  &__text {
    margin-left: 13px;
    overflow: hidden;
  }

  &__below {
    font-weight: 700;
    color: $un-color-normal;
    white-space: break-spaces;
  }
}
</style>
