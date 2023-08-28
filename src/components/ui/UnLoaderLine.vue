<template>
  <div
    :style="`height: ${height}px`"
    class="un-loader-line"
  >
    <div class="un-loader-line__line" />
    <div class="un-loader-line__subline inc" />
    <div class="un-loader-line__subline dec" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UnLoaderLine',
  props: {
    height: {
      type: Number,
      default: 2,
    },
    color: String,
    indeterminate: Boolean,
  },
});
</script>

<style lang="scss">
.un-loader-line {
  display: flex;
  height: 2px;
  background-color: $un-color-blue-1;

  &,
  &::before {
    width: 100%;
    margin: 0;
  }

  &::before {
    height: 100%;
    content: "";
    background-color: $un-color-blue-7;
    animation: un-loader-line 2s cubic-bezier(0.5, 0, 0.3, 1) infinite;
  }
}

@keyframes un-loader-line {
  0% {
    margin-right: 100%;
    margin-left: 0;
  }

  50% {
    margin-right: 0%;
    margin-left: 25%;
  }

  100% {
    margin-right: 0;
    margin-left: 100%;
  }
}
</style>
