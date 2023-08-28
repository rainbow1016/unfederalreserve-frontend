<template>
  <transition name="transition--fade" appear>
    <div class="un-modal-base">
      <div
        class="un-modal-base__backdrop"
        :class="{ 'is-backdrop-close': !noBackdropDismiss }"
        @click="onCloseBackdrop"
      />

      <transition name="transition--fade" appear>
        <div v-if="isActive" class="un-modal-base__wrapper">
          <div
            :class="{ 'is-maximized': maximized }"
            class="un-modal-base__container"
          >
            <slot>
              the content
            </slot>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script lang="ts" src="./UnModalBase.component"></script>

<style lang="scss">
.un-modal-base {
  position: fixed;
  top: 0;
  left: 0;
  z-index: $un-z-index-modal;
  display: table;
  width: 100%;
  height: 100%;

  &__backdrop {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: $un-color-backdrop;
    backdrop-filter: blur(3px);

    &.is-backdrop-close {
      cursor: pointer;
    }

    .app-modal-root + .app-modal-root & {
      background-color: transparent;
    }
  }

  &__wrapper {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    overflow: auto;
  }

  &__container {
    position: relative;

    @include media-lt(tablet) {
      width: 100%;
    }

    &.is-maximized {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
