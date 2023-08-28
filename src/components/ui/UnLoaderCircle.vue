<template>
  <div
    class="un-loader-circle"
    :class="{
      'is-small': small,
      'is-medium': medium,
      'is-large': large,
      'is-light': light,
    }"
  >
    <div class="un-loader-circle__spinner" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';


export default defineComponent({
  name: 'UnLoaderCircle',
  props: {
    small: Boolean,
    medium: Boolean,
    large: Boolean,
    light: Boolean,
  },
});
</script>

<style lang="scss">
.un-loader-circle {
  width: 100%;
  height: 100%;

  &.is-small {
    width: 21px;
    height: 21px;
  }

  &.is-medium {
    width: 28px;
    height: 28px;
  }

  &.is-large {
    width: 63px;
    height: 63px;
  }

  &__spinner {
    position: relative;
    content: "";
    border: 2px solid #253977;
    border-width: 2px;
    border-top-color: #14aef0;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  &.is-small &__spinner {
    width: 21px;
    height: 21px;
  }

  &.is-medium &__spinner {
    width: 28px;
    height: 28px;
  }

  &.is-large &__spinner {
    width: 63px;
    height: 63px;
    border-color: #304a9f;
    border-width: 5px;
    border-top-color: white;
  }

  &.is-light &__spinner {
    border-color: #6095ff;
    border-top-color: white;
  }
}
</style>
