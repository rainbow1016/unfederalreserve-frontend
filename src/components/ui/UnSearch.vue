<template>
  <div class="un-search">
    <img
      :src="require('@/assets/images/icons/search.svg')"
      class="un-search__icon"
      alt="search"
    >
    <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
    <input
      :value="modelValue"
      type="text"
      placeholder="Search..."
      class="un-search__input"
      data-testid="search-input"
      @input="$emit('update:modelValue', $event.target.value)"
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';


export default defineComponent({
  name: 'UnSearch',
  props: {
    modelValue: String,
  },
  emits: ['update:modelValue'],
});
</script>

<style lang="scss">
.un-search {
  position: relative;
  width: 100%;
  padding-left: 35px;
  background-color: rgba(35, 58, 129, 0.4);
  border-radius: 5px;

  &__icon {
    position: absolute;
    top: 50%;
    left: 10px;
    display: flex;
    align-items: center;
    width: 17px;
    transform: translateY(-50%);
  }

  &__input {
    width: 100%;
    padding: 12px 12px 10px 0;
    appearance: none;
    font-size: 13px;
    font-weight: 500;
    line-height: 16px;
    color: $un-color-white;
    letter-spacing: 0.1px;
    background-color: transparent;
    border: 0;
    outline: none;

    &::placeholder {
      font-weight: 400;
      color: $un-color-havelock-blue;
      opacity: 1;
    }
  }
}
</style>
