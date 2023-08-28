<template>
  <div class="un-loader" data-testid="un-loader">
    <div class="un-loader__circle">
      <div class="un-loader__wrap">
        <img
          class="un-loader__ship"
          src="@/assets/images/background/loader-ship.svg"
        >
        <img
          class="un-loader__wave"
          src="@/assets/images/background/loader-wave.svg"
        >
        <img
          class="un-loader__wave-2"
          src="@/assets/images/background/loader-wave2.svg"
        >
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, onBeforeUnmount } from 'vue';
import { blockedBody, unBlockedBody } from '@/helpers/blocked-body';


export default defineComponent({
  name: 'UnLoader',
  setup: () => {
    onMounted(() => blockedBody());
    onBeforeUnmount(() => unBlockedBody());
  },
});
</script>

<style lang="scss">
.un-loader {
  position: fixed;
  top: 0;
  left: 0;
  z-index: $un-z-index-loader-global;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(0deg, #fbfbfb 0%, #edf5ff 110.68%);
  background-color: #fff;

  &__circle {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 120px;
    border: 2px solid #b6d1ff;
    border-radius: 100%;

    &::before {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 240px;
      height: 240px;
      content: "";
      background: $un-color-white;
      border-radius: 100%;
      opacity: 0.6;
      transform: translate(-50%, -50%);

      @include media-gt(tablet) {
        width: 180px;
        height: 180px;
      }
    }

    &::after {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 428px;
      height: 428px;
      content: "";
      background: $un-color-white;
      border-radius: 100%;
      opacity: 0.32;
      transform: translate(-50%, -50%);

      @include media-gt(tablet) {
        width: 280px;
        height: 280px;
      }
    }
  }

  &__wrap {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    overflow: hidden;
    background: #ccdfff;
    border-radius: 100%;
  }

  &__wave,
  &__wave-2 {
    position: absolute;
    left: -26px;
    animation-iteration-count: infinite;
  }

  &__wave {
    top: 50px;
    z-index: 1;
    width: 132px;
    height: 82px;
    animation: move 2s ease-in-out;
  }

  &__wave-2 {
    top: 56px;
    z-index: 3;
    width: 252px;
    height: 203px;
    animation: moveTopToBottom 2s ease-in-out;
  }

  &__ship {
    position: relative;
    z-index: 2;
    width: 86px;
    height: 77px;
    animation: roteteShip 2s ease-in-out;
    animation-iteration-count: infinite;
  }

  @keyframes move {
    0% {
      transform: translateX(0);
    }

    50% {
      transform: translateX(5px);
    }

    100% {
      transform: translateX(0);
    }
  }

  @keyframes moveTopToBottom {
    0% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(3px);
    }

    100% {
      transform: translateY(0);
    }
  }

  @keyframes roteteShip {
    0% {
      transform: rotate(0deg);
    }

    50% {
      transform: rotate(10deg);
    }

    100% {
      transform: rotate(0deg);
    }
  }
}
</style>
