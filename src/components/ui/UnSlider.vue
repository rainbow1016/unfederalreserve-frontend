<template>
  <!-- eslint-disable vuejs-accessibility/form-control-has-label -->

  <div class="un-slider">
    <div class="un-slider__wrap">
      <input
        ref="input"
        :value="modelValue"
        type="range"
        :min="min"
        :max="max"
        class="un-slider__input"
        :style="{'--bar-w': modelValue + '%'}"
        @input="$emit('update:modelValue', +$event.target.value)"
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';


export default defineComponent({
  name: 'UnSlider',
  props: {
    disabled: Boolean,
    modelValue: Number,
    min: Number,
    max: Number,
  },
  emits: ['update:modelValue'],
});
</script>

<style lang="scss">
.un-slider {
  &__input {
    position: relative;
    appearance: none;
    width: 100%;
    height: 5px;
    background: #415aad;
    border-radius: 100px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.08);
    transition: all 0.2s;

    &::after {
      position: absolute;
      top: 0;
      left: 0;
      width: var(--bar-w);
      height: 5px;
      content: "";
      background: #fff;
      border-radius: 100px;
    }

    &::-webkit-slider-thumb {
      appearance: none;
      width: 29px;
      height: 29px;
      cursor: pointer;
      background: #fff;
      border-radius: 50%;
    }

    &::-moz-range-thumb {
      width: 29px;
      height: 29px;
      cursor: pointer;
      background: #fff;
      border-radius: 50%;
    }
  }
}
</style>
