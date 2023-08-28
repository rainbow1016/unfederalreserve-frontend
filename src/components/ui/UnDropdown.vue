<template>
  <div
    class="un-dropdown"
    :class="{
      'is-dark': dark,
      'is-transparent': transparent,
      'is-transparent-dark': transparentDark,
      'is-dropdown-center': dropdownCenter,
      'is-dropdown-right': dropdownRight,
    }"
    :style="{
      '--right': arrowRight+'px',
      '--minItemsWidth': minItemsWidth+'px',
    }"
  >
    <div
      class="un-dropdown__selected"
      :class="{ 'is-active': isActive }"
      @click="isActive = !isActive"
    >
      <slot name="selected" />

      <img
        v-svg-inline
        :src="require('@/assets/images/icons/arrow-down.svg')"
        class="un-dropdown__selected-arrow"
      >
    </div>
    <div v-show="isActive" class="un-dropdown__items">
      <div class="un-dropdown__elements">
        <slot name="listItem" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useOutsideClick } from '@/composable';


export default defineComponent({
  name: 'UnDropdown',
  props: {
    dark: Boolean,
    transparent: Boolean,
    transparentDark: Boolean,
    arrowRight: {
      type: Number,
      default: 15,
    },
    minItemsWidth: {
      type: Number,
      default: 250,
    },
    dropdownCenter: Boolean,
    dropdownRight: Boolean,
  },
  setup: () => {
    const isActive = ref(false);

    useOutsideClick('.un-dropdown__selected', () => {
      isActive.value = false;
    });

    return {
      isActive,
    };
  },
});
</script>

<style lang="scss">
.un-dropdown {
  $root: &;

  position: relative;

  &__selected {
    position: relative;
    display: flex;
    align-items: center;
    padding: 8px 18px 8px 18px;
    cursor: pointer;
    border-radius: 14px;

    #{$root}:not(.is-transparent) & {
      background: $un-color-blue-3;
    }

    &-arrow {
      position: absolute;
      top: auto;
      right: 33px;
      width: 14px;
      color: $un-color-gray-1;
      transition: all 0.3s;
      transform-origin: center;

      @include media-lt(tablet) {
        right: 18px;
      }
    }

    &.is-active {
      .un-dropdown__selected-arrow {
        transform: rotate(180deg);
      }
    }
  }

  &__items {
    position: absolute;
    top: calc(100% + 7px);
    z-index: 1;
    width: 100%;
    padding: 13px 6px 13px 0;
    background: $un-color-blue-3;
    border-radius: 15px;
    box-shadow: 0 4px 13px rgba(4, 4, 4, 0.2);

    #{$root}:not(.is-dropdown-center, .is-dropdown-right) & {
      left: 0;
    }

    #{$root}.is-dropdown-center & {
      left: 37px;
      transform: translateX(-50%);
    }

    #{$root}.is-dropdown-right & {
      right: 0;
    }
  }

  &__elements {
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: #2d489d;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: #7690e0;
      border-radius: 3px;
    }
  }

  &.is-dark,
  &.is-transparent-dark {
    #{$root}__selected {
      padding: 4px 5px;
      border-radius: 25px;
    }

    #{$root}:not(.is-transparent) & {
      background: #1d3582;
    }

    #{$root}__selected-arrow {
      right: var(--right);
      width: 10px;

      @include media-lt(tablet) {
        right: 10px;
      }
    }

    #{$root}__items {
      min-width: var(--minItemsWidth);
      background: #1d3582;
      border-radius: 15px;
      box-shadow: 0 4px 13px rgba(4, 4, 4, 0.2);
    }
  }

  &.is-transparent-dark {
    #{$root}__selected {
      background: rgba(0, 11, 50, 0.2);
      border: 1px solid transparent;
      transition: 0.3s all ease;

      &.is-active {
        border: 1px solid #527af9;
      }
    }

    #{$root}__items {
      border: 1px solid #27459d;
    }
  }
}
</style>
