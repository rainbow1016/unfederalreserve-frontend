<template>
  <div
    class="un-expansion-panel"
    :class="{
      'is-active': isActive,
      'is-small': small,
    }"
  >
    <div
      class="un-expansion-panel__main"
      @click="isActive = !isActive"
    >
      <div class="un-expansion-panel__main-content">
        <slot name="main" />
      </div>

      <div class="un-expansion-panel__arrow-wrap">
        <img
          v-svg-inline
          :src="require('@/assets/images/icons/arrow-down.svg')"
          class="un-expansion-panel__arrow"
        >
      </div>
    </div>

    <div v-if="progress" class="un-expansion-panel__progress">
      <div
        class="un-expansion-panel__progress-inner"
        :style="{ width: progress }"
      />
    </div>

    <div class="un-expansion-panel__items">
      <slot name="item" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';


export default defineComponent({
  name: 'UnExpansionPanel',
  props: {
    progress: String,
    small: Boolean,
  },
  setup: () => {
    const isActive = ref(false);

    return {
      isActive,
    };
  },
});
</script>

<style lang="scss">
.un-expansion-panel {
  $root: &;

  position: relative;
  overflow: hidden;
  background: rgba(41, 73, 171, 0.44);
  border: 2px solid transparent;
  border-radius: 20px;
  transition: all 0.3s ease;

  &:hover,
  &.is-active {
    border: 2px solid #527af9;
    box-shadow: 0 0 6px rgba(82, 122, 249, 0.41);

    &:not(.is-small) > #{$root}__main > #{$root}__arrow-wrap {
      background: #527af9;
    }
  }

  &__main {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 18px 16px;
    cursor: pointer;

    #{$root}.is-small & {
      padding: 12px 16px;
    }

    @include media-gt(desktop) {
      padding: 18px 20px;

      #{$root}.is-small & {
        padding: 12px 20px;
      }
    }
  }

  &__main-content {
    display: inline-block;
    width: calc(100% - 40px);
  }

  &__arrow-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 15px;
    transition: all 0.3s ease;

    #{$root}:not(.is-small) > #{$root}__main >  & {
      width: 40px;
      height: 40px;
      background: #2845a4;
      border-radius: 10px;
    }
  }

  &__arrow {
    width: 13px;
    transition: all 0.3s;
    transform-origin: center;

    #{$root}.is-active > #{$root}__main > #{$root}__arrow-wrap > & {
      transform: rotate(180deg);
    }
  }

  &__items {
    z-index: 1;
    width: 100%;
    height: 0;
    overflow: hidden;
    opacity: 0;
    transition: all 0.5s ease;
    transform: translateY(-100%);

    #{$root}.is-active > & {
      height: auto;
      opacity: 1;
      transform: translateY(0);
    }
  }

  &__progress {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    overflow: hidden;
    border-radius: 3px;
  }

  &__progress-inner {
    width: 0;
    height: 3px;
    background-color: #ea9650;
    border-radius: 3px;
    transition: width 1s ease-out;
  }
}
</style>
