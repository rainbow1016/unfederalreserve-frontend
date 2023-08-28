<template>
  <label
    :class="{
      'is-active': modelValue,
      'is-light': light,
      'is-disabled': disabled,
      'is-readonly': readonly,
      'with-label': label,
    }"
    class="un-switch"
  >
    <input
      :value="modelValue"
      type="checkbox"
      :disabled="disabled"
      class="un-switch__input"
      @change="onChange($event.target.checked)"
    >
    <span class="un-switch__switch" />
    <span
      v-if="label"
      class="un-switch__label"
      v-text="label"
    />
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue';


export default defineComponent({
  name: 'UnSwitch',
  props: {
    disabled: Boolean,
    readonly: Boolean,
    light: Boolean,
    modelValue: Boolean,
    label: String,
  },
  emits: ['update:modelValue'],
  setup: (props, ctx) => {
    const onChange = (checked: boolean) => {
      if (props.readonly || props.disabled) return;
      ctx.emit('update:modelValue', checked);
    };

    return {
      onChange,
    };
  },
});
</script>

<style lang="scss">
.un-switch {
  $root: &;

  display: flex;
  align-items: center;

  &:not(.is-disabled):not(.is-readonly) {
    cursor: pointer;
  }

  &__input {
    display: none;
  }

  &__label {
    font-size: 12px;
    line-height: 100%;

    @include media-gt(tablet) {
      font-size: 14px;
    }
  }

  &__switch {
    position: relative;
    display: flex;
    align-items: center;
    width: 36px;
    height: 11px;
    background: $un-color-cerulean-blue;
    border-radius: 100px;
    box-shadow:
      0 10px 20px rgba(0, 0, 0, 0.08),
      0 2px 6px rgba(0, 0, 0, 0.08),
      0 0 1px rgba(0, 0, 0, 0.08);
    transition: all 0.25s;

    #{$root}.with-label & {
      margin-right: 10px;
    }

    &::after {
      position: absolute;
      left: 0;
      display: block;
      width: 20px;
      height: 20px;
      content: "";
      background-color: #fff;
      background-repeat: no-repeat;
      background-position: center;
      background-size: auto;
      border-radius: 50%;
      transition: all 0.25s cubic-bezier(0.5, -0.6, 0.5, 1.6);
      transform: translateX(0);
    }
  }

  &.is-active &__switch {
    background: $un-color-green;

    &::after {
      transform: translateX(36px - 20px);
    }
  }

  &.is-disabled &__switch {
    &::after {
      background: #3f58a8;
    }
  }

  &.is-light &__switch {
    background: $un-color-switch-bg;
  }

  &.is-light.is-active &__switch {
    background: $un-color-accent;

    &::after {
      background-color: $un-color-white;
    }
  }
}
</style>
