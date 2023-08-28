<template>
  <component
    :is="href ? 'a' : to ? 'router-link' : 'button'"
    v-bind="$attrs"
    :to="to"
    :href="href"
    :class="classes"
    :disabled="to ? null : disabled"
    class="un-btn"
    :style="{
      '--iconSize': iconSize,
      '--fontSize': fontSize,
    }"
    @click="$emit('click', $event)"
  >
    <img
      v-if="preIcon"
      v-svg-inline
      :src="preIcon"
      class="un-btn__pre-icon"
    >
    <span class="un-btn__inner">
      <slot>{{ text }}</slot>
    </span>
    <span v-if="number" class="un-btn__number">
      {{ number }}
    </span>
    <span
      v-if="loading"
      class="un-btn__loader"
    />
    <img
      v-if="postIcon"
      v-svg-inline
      :src="postIcon"
      class="un-btn__post-icon"
    >
  </component>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';


export default defineComponent({
  name: 'UnBtn',
  props: {
    to: [String, Object],
    href: String,
    text: String,
    number: String,

    // general props
    uppercase: {
      type: Boolean,
      default: true,
    },
    preIcon: String,
    postIcon: String,

    // condition props
    outlined: Boolean,
    small: Boolean,
    square: Boolean,
    disabled: Boolean,

    // type props
    cancel: Boolean,
    loading: Boolean,
    success: Boolean,
    danger: Boolean,
    light: Boolean,
    warning: Boolean,
    limeGreen: Boolean,

    iconSize: {
      type: String,
      default: '18px',
    },
    fontSize: {
      type: String,
      default: '15px',
    },
  },
  emits: ['click'],
  setup(props) {
    const classes = computed(() => ({
      'is-outlined': props.outlined,
      'is-square': props.square,
      'is-small': props.small,
      'is-disabled': props.disabled,

      'is-uppercase': props.uppercase,

      'is-cancel': props.cancel,
      'is-loading': props.loading,
      'is-success': props.success,
      'is-danger': props.danger,
      'is-light': props.light,
      'is-warning': props.warning,
      'is-lime-green': props.limeGreen,
    }));

    return {
      classes,
    };
  },
});
</script>

<style lang="scss">
// stylelint-disable scale-unlimited/declaration-strict-value

.un-btn {
  $root: &;
  // eslint-disable-next-line no-extra-semicolons
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  overflow: hidden;
  font-size: var(--fontSize);
  font-weight: 600;
  line-height: 15px;
  color: white;
  text-decoration: none;
  cursor: pointer;
  background:
    linear-gradient(
      103.04deg,
      #2e73ff 19.64%,
      #184ce8 77.74%,
    );
  border: none;
  border-radius: 100px;
  outline: none;
  transition: color 0.25s;

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    content: "";
    background:
      linear-gradient(
        03.04deg,
        #0245cb 19.64%,
        #03258c 84.61%,
      );
    opacity: 0;
    transition: opacity 0.25s;
  }

  &:active {
    box-shadow: 1px 1px 8px 1px rgba(0, 0, 0, 0.2);
    transition: all 0.2s;
  }

  &:not(.is-disabled):hover {
    &::after {
      opacity: 0.5;
    }
  }

  @include media(tablet) {
    padding: 17px 20px;
  }

  &__inner {
    z-index: 1;
    pointer-events: none;
  }

  &__number {
    position: absolute;
    left: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    font-size: 15px;
    font-weight: 700;
    color: #296bfa;
    background: #fff;
    border-radius: 50%;
  }

  &__pre-icon {
    width: var(--iconSize);
    height: var(--iconSize);
    margin-right: 10px;
  }

  &__post-icon {
    width: var(--iconSize);
    height: var(--iconSize);
    margin-left: 5px;
  }

  &.is-uppercase {
    text-transform: uppercase;
  }

  &.is-square {
    height: 40px;
    padding: 0;
    background: #37f;
    border-radius: 10px;
  }

  &.is-small {
    height: 36px;
    padding: 5px 0;
    font-size: 12px;
  }

  &.is-disabled {
    color: #739efa;
    pointer-events: none;
    cursor: not-allowed;
    background: #244199;

    #{$root}__number {
      color: #244199;
      background: #13296d;
    }
  }

  &.is-outlined {
    color: white;
    background: transparent;
    border: 1px solid #37f;

    &::after {
      background:
        linear-gradient(
          103.04deg,
          #2e73ff 19.64%,
          #184ce8 77.74%,
        );
    }

    &:not(.is-disabled):hover {
      color: white;
    }

    // stylelint-disable no-descending-specificity
    &:active {
      box-shadow: 1px 1px 8px 1px rgba(0, 0, 0, 0.2);
      transition: all 0.2s;
    }

    &.is-disabled {
      opacity: 0.5;
    }
  }

  &.is-cancel {
    color: #37f;
    background: linear-gradient(90deg, #183386 2.84%, #142b71 100%);
    border: 2px solid #213983;

    &::after {
      background: rgba(51, 119, 255, 0.1);
    }

    &.is-disabled {
      opacity: 0.5;
    }
  }

  // type loading
  &.is-loading {
    pointer-events: none;

    #{$root}__loader {
      position: absolute;
      z-index: 3;
      display: block;
      width: 35px;
      height: 35px;
      content: "";
      border: 3px solid #6095ff;
      border-width: 3px;
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    // default disabled
    // default disabled dark
    // default outlined
  }

  // type success
  &.is-success {
    color: #00d395;
    background: rgba(0, 211, 149, 0.1);

    &::before {
      width: 24px;
      height: 24px;
      margin-right: 7px;
      content: "";
      background-image: url(~@/assets/images/icons/check-circle.svg);
    }

    // default disabled
    // default disabled dark
    // default outlined
  }

  // type danger
  &.is-danger {
    color: white;
    background-image:
      linear-gradient(
        90deg,
        #f95050 0%,
        #e92121 100%,
      );

    &::after {
      background-image:
        linear-gradient(
          90deg,
          #ba1f1f 0%,
          #a21010 100%,
        );
    }

    // danger disabled
    &.is-disabled {
      color: #ff5252;
      background: rgba(255, 82, 82, 0.15);
    }

    // danger outlined
    &.is-outlined {
      color: #ff5252;
      background: linear-gradient(270deg, rgba(255, 82, 82, 0.12) 0%, rgba(255, 82, 82, 0.06) 100%);
      border: 1px solid #704a87;

      &:hover {
        background: linear-gradient(270deg, rgba(255, 82, 82, 0.12) 0%, rgba(255, 82, 82, 0.33) 100%);
        border: 1px solid #ff5252;
      }
    }
  }

  // type light
  &.is-light {
    background-image:
      linear-gradient(
        90deg,
        #00fbec 0%,
        #00c6d3 100%,
      );

    &::after {
      background-image:
        linear-gradient(
          90deg,
          #0da9b3 0%,
          #00fbec 100%
        );
    }

    // light disabled
    &.is-disabled {
      color: #6882d4;
      background: #294089;
    }
    // default outlined
  }

  // type warning
  &.is-warning {
    // no default design
    // warning disabled
    &.is-disabled {
      color: #da914e;
      background: rgba(218, 145, 78, 0.15);
    }

    // default outlined
  }

  // type lime green
  &.is-lime-green {
    color: #fff;
    background: #00d395;

    &::after {
      background-image:
        linear-gradient(
          90deg,
          #00d395 0%,
          #00fbec 100%
        );
    }

    // default disabled
    // default disabled dark
    // default outlined
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
