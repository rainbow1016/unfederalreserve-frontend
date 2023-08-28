<template>
  <component
    :is="to ? 'router-link' : 'div'"
    :to="to"
    :style="$attrs.style"
    :class="[$attrs.class, {
      'is-padding': !noPadding,
      'is-light': light,
      'is-transparent-dark': transparentDark,
      'is-neon': neon,
      'is-dark': dark,
      'is-link': to,
      'is-transparent': transparent,
    }]"
    class="un-card"
  >
    <template v-if="title || $slots.header || $slots['header-right']">
      <div class="un-card__header">
        <slot name="header">
          <UnTooltip
            :disabled="!tooltipText"
            :content-text="tooltipText"
            :content-width="tooltipWidth"
            bordered
          >
            <template #activator>
              <h3 class="un-card__title">
                {{ title }}
              </h3>
            </template>
          </UnTooltip>
        </slot>

        <slot name="header-right" />
      </div>
    </template>

    <div
      v-if="headerLined"
      class="un-card__line"
    />

    <UnLoaderLine
      v-if="loading"
      class="un-card__loading"
    />

    <slot />
  </component>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';


const UnTooltip = defineAsyncComponent(() => import(
  /* webpackChunkName: "UnTooltip" */
  './UnTooltip.vue'
));

const UnLoaderLine = defineAsyncComponent(() => import(
  /* webpackChunkName: "UnLoaderLine" */
  './UnLoaderLine.vue'
));

export default defineComponent({
  name: 'UnCard',
  components: {
    UnTooltip,
    UnLoaderLine,
  },
  inheritAttrs: false,
  props: {
    title: String,
    tooltipText: String,
    tooltipWidth: String,
    headerLined: Boolean,
    loading: Boolean,

    light: Boolean,
    neon: Boolean,
    dark: Boolean,
    transparentDark: Boolean,
    transparent: Boolean,
    to: [String, Object],
    noPadding: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss">
$padding-size: 25px;

.un-card {
  $root: &;

  min-height: 80px;
  border-radius: 20px;

  &:not(.is-transparent) {
    background-color: $un-color-card;
    box-shadow: 0 0 20px rgb(56 71 109 / 3%);
    backdrop-filter: blur(8px);
  }

  &.is-padding {
    padding: $padding-size;
  }

  &__header {
    display: flex;
    color: $un-color-white;

    #{$root}:not(.is-padding) & {
      padding: $padding-size $padding-size 0 $padding-size;
    }
  }

  &__loading,
  &__line {
    #{$root}.is-padding & {
      position: relative;
      right: -($padding-size);
      left: -($padding-size);
      width: calc(100% + 2 * #{$padding-size});
    }
  }

  #{$root} &__loading {
    position: relative;
    z-index: 2;
    margin-top: -2px;
  }

  &__line {
    margin-top: -3px;
    border-bottom: 2px solid white;
    opacity: 0.3;

    #{$root}.is-light & {
      border-bottom-color: $un-color-blue-3;
      opacity: 1;
    }
  }

  &__title {
    display: inline-block;
    flex-shrink: 0;
    font-size: 17px;
    font-style: normal;
    font-weight: 600;
    line-height: 26px;
    cursor: default;
  }

  &.is-transparent-dark {
    background: rgba(0, 11, 50, 0.2);
    box-shadow: none;

    &.is-link {
      transition: background 0.2s;

      &:hover {
        background: rgba(0, 11, 50, 0.1);
      }
    }
  }

  &.is-dark {
    background: #2c4aa9;
    box-shadow: none;
  }

  &.is-neon {
    background: rgba(51, 119, 255, 0.28);
    border: 1px solid $un-color-normal;
    box-shadow: 0 0 10px rgba(64, 123, 255, 0.5);

    &.is-link {
      transition: box-shadow 0.2s;

      &:hover {
        box-shadow: 0 0 2px rgba(#2c4aa9, 0.5);
      }
    }
  }
}
</style>
