<template>
  <div
    :class="`is-type--${type}`"
    class="un-mobile-menu-btn"
  >
    <img
      v-svg-inline
      :src="icon"
      class="un-mobile-menu-btn__icon"
    >
    <transition name="transition--fade" mode="out-in">
      <span :key="label">{{ label }}</span>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';


export default defineComponent({
  name: 'UnMobileMenuBtn',
  props: {
    type: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="scss">
.un-mobile-menu-btn {
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
  line-height: 26px;
  color: $un-color-primary;
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.5;
  }

  &__icon {
    width: 27px;
    height: 26px;
    margin-right: 10px;
  }

  &__help {
    margin-top: auto;
    margin-bottom: 0;
  }
}
</style>
