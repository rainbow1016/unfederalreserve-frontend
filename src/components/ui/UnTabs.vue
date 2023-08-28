<template>
  <div
    :class="{
      'is-lined': lined,
      'is-dense': dense,
      'is-light': light,
      'is-full': full,
      'is-switch': fullAsSwitch,
    }"
    class="un-tabs"
  >
    <UnTooltip
      v-for="item in options"
      :key="item.value"
      :content-text="item.tooltipText"
      :disabled="!item.tooltipText"
      class="un-tabs__tooltip"
    >
      <template #activator>
        <component
          :is="link ? 'router-link' : 'span'"
          :to="link && { hash: `#${item.value}` }"
          :class="{
            'is-active': (active = modelValue?.value === item.value),
            'is-disabled': item.disabled,
          }"
          :style="{
            color: active && !light && !full ? item.color : null,
            backgroundColor: active && full ? item.color : null,
          }"
          :data-testid="`${item.label.toLowerCase()}-tab`"
          class="un-tabs__item"
          @click.prevent="$emit('update:modelValue', item)"
          v-text="item.label"
        />
      </template>
    </UnTooltip>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import UnTooltip from '@/components/ui/UnTooltip.vue';


type ITab = {
  value: string;
  name: string;
  tooltipText?: string;
  disabled?: boolean;
}

export default defineComponent({
  name: 'UnTabs',
  components: {
    UnTooltip,
  },
  props: {
    lined: Boolean,
    link: Boolean,
    dense: Boolean,
    full: Boolean,
    fullAsSwitch: Boolean,
    light: Boolean,
    modelValue: {
      type: Object as PropType<ITab>,
      required: true,
      validator: (prop: ITab) => (
        prop
        && 'value' in prop
        && 'label' in prop
      ),
    },
    options: {
      type: Array as PropType<ITab[]>,
      required: true,
      validator: ([prop]: ITab[]) => (
        prop
        && 'value' in prop
        && 'label' in prop
      ),
    },
  },
  emits: ['update:modelValue'],
});
</script>

<style lang="scss">
.un-tabs {
  $root: &;

  display: flex;
  flex-direction: row;

  &__tooltip {
    display: block;
    width: 100%;
  }

  &__item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0 0 10px;
    font-weight: 600;
    color: #798dca;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.2s;

    @include media-lt(tablet) {
      padding-bottom: 28px;
    }

    &.is-active,
    &.is-disabled {
      pointer-events: none;
      cursor: pointer;
    }

    &.is-active,
    &:hover {
      color: #fff;
    }
  }

  &.is-full {
    padding: 2px;
    background: rgba(0, 11, 50, 0.2);
    border-radius: 11px;

    #{$root}__item {
      padding: 7px 0;
      color: #fff;
      border-radius: 11px;

      &.is-active {
        background: #37f;
      }
    }
  }

  &.is-switch {
    border-radius: 5px;

    #{$root}__item {
      min-width: 66px;
      padding: 5px 13px;
      border-radius: 5px;
    }
  }

  &.is-dense {
    #{$root}__item {
      width: auto;
      padding-right: 17px;
      padding-left: 17px;
    }
  }

  &.is-lined {
    #{$root}__item {
      &::before {
        position: absolute;
        bottom: -2px;
        justify-self: center;
        width: 0;
        height: 2px;
        content: "";
        background-color: currentColor;
        transition: width 0.2s, color 0.2s;
      }
    }

    #{$root}__item:not(.is-disabled):hover,
    #{$root}__item:not(.is-disabled).is-active {
      &::before {
        width: 100%;
        visibility: visible;
      }
    }
  }

  &.is-light {
    height: auto;

    #{$root}__item {
      padding: 5px 0 20px;
      font-size: 18px;
      opacity: 1;

      @include media-lt(tablet) {
        font-size: 15px;
      }

      &::before {
        bottom: 1px;
      }

      &:not(.is-disabled):hover,
      &:not(.is-disabled).is-active {
        color: #01d7dc;
      }
    }
  }
}
</style>
