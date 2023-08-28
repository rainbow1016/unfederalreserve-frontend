<template>
  <label
    :class="{
      'is-checked': modelValue,
      'is-disabled': disabled
    }"
    class="un-checkbox"
  >
    <input
      type="checkbox"
      :disabled="disabled"
      class="un-checkbox__input"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    >
    <span class="un-checkbox__checkmark-wrap">
      <img
        v-svg-inline
        :src="require(`@/assets/images/icons/checked.svg`)"
        class="un-checkbox__checkmark"
      >
    </span>
    <span
      class="un-checkbox__label-text"
      v-text="labelText"
    />
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue';


export default defineComponent({
  name: 'UnCheckbox',
  props: {
    disabled: Boolean,
    modelValue: Boolean,
    labelText: String,
  },
  emits: ['update:modelValue'],
});
</script>

<style lang="scss">
.un-checkbox {
  $root: &;

  position: relative;
  display: flex;
  align-items: center;

  &:not(.is-disabled) {
    cursor: pointer;
  }

  &__input {
    position: absolute;
    width: 0;
    height: 0;
    cursor: pointer;
    opacity: 0;
  }

  &__checkmark-wrap {
    display: inline-flex;
    width: 18px;
    height: 18px;
    background: #244199;
    border: 1px solid #3859bc;
    border-radius: 2px;
  }

  &__checkmark {
    display: none;
    width: 18px;
    height: 18px;
    color: #244199;
  }

  &.is-checked {
    #{$root}__checkmark-wrap {
      background: #37f;
      border: 1px solid #37f;
    }

    #{$root}__checkmark {
      display: flex;
    }
  }

  &__label-text {
    margin-left: 7px;
    font-size: 14px;
    line-height: 100%;
  }
}
</style>
