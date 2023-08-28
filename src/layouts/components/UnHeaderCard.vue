<template>
  <div
    :class="{
      'is-loading': loading,
      'is-clickable': clickable,
    }"
    class="un-header-card"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UnHeaderCard',
  props: {
    loading: Boolean,
    clickable: Boolean,
  },
});
</script>

<style lang="scss">
.un-header-card {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 33px;
  font-size: 13px;
  font-weight: 600;
  line-height: 19px;
  color: #fff;
  background: #2c4aa9;
  border-radius: 8px;
  box-shadow:
    10px 10px 20px rgba(31, 63, 174, 0.02),
    13px 2px 6px rgba(31, 63, 174, 0.02),
    7px 0 50px rgba(31, 63, 174, 0.02);
  transition: all 0.2s;

  &.is-clickable:hover {
    cursor: pointer;
    background: #4065d8;
  }

  &.is-loading {
    pointer-events: none;
  }
}
</style>
