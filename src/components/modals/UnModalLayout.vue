<template>
  <div
    :class="[{
      'is-blue': blue,
      'is-dark': dark,
      'is-mobile-full-screen': mobileFullScreen,
    }, $attrs.class]"
    :style="$attrs.style"
    class="un-modal-layout"
  >
    <header
      :class="{
        'is-lined': headerLined,
        'is-full-width': fullWidthHeader,
        'is-left': titleLeft
      }"
      class="un-modal-layout__header"
    >
      <slot name="prepend-header" />
      <div
        v-if="blue"
        class="un-modal-layout__circle"
      />
      <slot name="header">
        <div class="un-modal-layout__header-inner">
          <h3
            v-if="title"
            :class="{ 'is-bold': titleBold }"
            class="un-modal-layout__title"
            data-testid="modal-title"
            v-text="title"
          />
          <h4
            v-if="subtitle"
            class="un-modal-layout__subtitle"
            data-testid="modal-subtitle"
            v-text="subtitle"
          />
        </div>
      </slot>

      <div
        v-if="closable"
        class="un-modal-layout__close"
        data-testid="close-button"
        @click="$emit('close')"
      >
        <img
          v-svg-inline
          :src="require('@/assets/images/icons/close.svg')"
          class="un-modal-layout__close-icon"
          @click="$emit('close')"
        >
      </div>
    </header>

    <main
      class="un-modal-layout__main"
      :class="{
        'no-grow': footerUp,
        'no-padding': contentNoPadding,
      }"
    >
      <slot>
        the content
      </slot>
    </main>

    <footer
      :class="{
        'is-lined': footerLined,
        'is-lined--mobile': headerLined,
      }"
      class="un-modal-layout__footer"
    >
      <slot name="footer" />
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';


export default defineComponent({
  name: 'UnModalLayout',
  inheritAttrs: false,
  props: {
    title: String,
    titleBold: Boolean,
    titleLeft: Boolean,
    subtitle: String,
    headerLined: Boolean,
    fullWidthHeader: Boolean,
    blue: Boolean,
    dark: Boolean,
    footerUp: Boolean,
    footerLined: Boolean,
    contentNoPadding: Boolean,
    closable: {
      type: Boolean,
      default: true,
    },
    mobileFullScreen: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['close'],
});
</script>

<style lang="scss">
$box-shadow: 0 5px 15px rgb(0 0 0 / 50%),
  0 4px 70px 10px rgb(17 41 124 / 35%),
  10px 10px 20px rgb(31 63 174 / 2%),
  13px 2px 6px rgb(31 63 174 / 2%),
  7px 0 50px rgb(31 63 174 / 2%);

.un-modal-layout {
  $root: &;

  display: flex;
  flex-direction: column;
  padding-bottom: 15px;
  color: white;
  background: linear-gradient(180deg, #13296d 0%, rgba(19, 41, 109, 0.85) 100%);
  box-shadow: $box-shadow;

  &__header {
    display: flex;
    border-bottom: 2px solid transparent;

    &.is-lined {
      border-bottom-color: $un-color-grey-0;
    }

    &.is-full-width {
      margin: 0;
    }

    &:not(.is-left) {
      text-align: center;
    }
  }

  @include media-lte(tablet) {
    &.is-mobile-full-screen {
      width: 100vw;
      height: 100%;
      min-height: calc(var(--vh, 1vh) * 100);
    }

    &:not(.is-mobile-full-screen) {
      width: calc(100% - 32px);
      margin: 0 auto;
      border-radius: 40px;
    }

    &__header {
      #{$root}.is-mobile-full-screen & {
        padding: 30px 15px 20px 15px;
      }
      #{$root}:not(.is-mobile-full-screen) & {
        padding: 30px 15px 0 15px;
      }

      &.is-full-width {
        padding: 30px 0 20px 0;
        margin-top: 50px;
      }
    }

    &__main {
      padding: 10px 15px 0 15px;
    }

    &__footer {
      padding: 20px 15px 10px 15px;
    }

    &.is-blue {
      background: linear-gradient(180deg, #13296d 0%, rgba(19, 41, 109, 0.85) 100%);
    }
  }

  @include media-gt(tablet) {
    width: 500px;
    border-radius: 37px;

    &__header {
      padding: 30px 0 17px 0;
      margin: 0 30px;
    }

    &__main {
      padding: 0 30px;
    }

    &__footer {
      padding: 10px 0;
      margin: 0 30px;
    }

    &.is-blue {
      background: transparent;

      &::before {
        position: absolute;
        top: 95px;
        left: 0;
        z-index: 1;
        width: 100%;
        height: calc(100% - 95px);
        content: "";
        background: linear-gradient(180deg, #13296d 0%, rgba(19, 41, 109, 0.85) 100%);
        border-bottom-right-radius: 37px;
        border-bottom-left-radius: 37px;
      }

      #{$root}__main,
      #{$root}__footer {
        position: relative;
        z-index: 2;
      }

      #{$root}__close {
        z-index: 2;
      }
    }

    #{$root}__circle {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 500px;
      height: 95px;
      margin: 0 auto;
      overflow: hidden;
      border-top-left-radius: 37px;
      border-top-right-radius: 37px;

      &::before {
        position: absolute;
        top: -50px;
        left: 198px;
        z-index: -1;
        width: 105px;
        height: 105px;
        content: "";
        border-radius: 50%;
        box-shadow: 0 0 0 9999px #13296d;
      }

      &::after {
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        width: 100%;
        height: 100%;
        content: "";
        box-shadow: inset 0 -300px 600px -300px #13296d;
      }
    }
  }

  &__header-inner {
    width: 100%;
  }

  &__footer {
    border-top: 1px solid transparent;

    &.is-lined {
      border-top-color: #1a327c;
    }

    @include media-lte(tablet) {
      &.is-lined--mobile {
        border-top-color: $un-color-grey-0;
      }
    }
  }

  &__main {
    display: flex;
    flex-direction: column;
    // overflow-y: hidden; ЗАЧЕМ ???????????????????????????????????????????????

    &:not(.no-grow) {
      flex-grow: 1;
    }

    &.no-padding {
      padding: 0;
    }
  }

  &__title {
    font-size: 20px;
    font-weight: 600;
    line-height: 26px;

    &.is-bold {
      font-size: 25px;
      font-weight: 700;
    }
  }

  &__subtitle {
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 500;
    color: #798dca;

    @include media-gte(tablet) {
      font-size: 16px;
    }
  }

  &__close {
    position: absolute;
    right: 30px;
    color: #2a4eba;
    cursor: pointer;
    transition: color 0.3s;

    #{$root}.is-dark & {
      color: $un-color-blue-2;

      &:hover {
        color: $un-color-blue-1;
      }
    }

    @include media-lte(tablet) {
      top: 25px;
      right: 25px;
    }

    &:hover {
      color: $un-color-gray;
    }

    &-icon {
      width: 14px;
      height: 14px;
      margin-top: 6px;
      outline: none;
    }
  }

  &__default-button {
    display: block;
    margin-top: 1rem;
  }

  &.is-dark {
    color: #fff;
    background: linear-gradient(180deg, #13296d 0%, rgba(19, 41, 109, 1) 100%);

    @include media-gt(tablet) {
      border-radius: 37px;
    }
  }
}
</style>
