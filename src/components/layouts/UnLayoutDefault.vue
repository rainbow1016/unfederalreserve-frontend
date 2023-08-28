<template>
  <div
    :class="{
      'with-home-grass': withHomeGrass,
    }"
    class="un-layout-default"
  >
    <img
      v-if="withWhale"
      class="un-layout-default__whale is-bg-img"
      :src="require('@/assets/images/background/bg-whale.svg')"
      alt="whale"
    >
    <img
      v-if="withGrass"
      class="un-layout-default__grass is-bg-img"
      :src="require('@/assets/images/background/bg-grass.svg')"
      alt="grass"
    >
    <img
      v-if="withMountain"
      class="un-layout-default__mountain is-bg-img"
      :src="require('@/assets/images/background/bg-mountain.svg')"
      alt="mountain"
    >
    <img
      v-if="withSmallFishes"
      class="un-layout-default__small-fishes is-bg-img"
      :src="require('@/assets/images/background/bg-small-fishes.svg')"
      alt="small fishes"
    >

    <UnWarningMessageConnect
      v-if="!isAnyConnected && checkConnect"
      class="un-layout-default__warning-message"
    />

    <UnWarningMessageNetwork
      v-else-if="!isSupportedNetwork && checkNetwork"
      :chain-id="chainId"
      class="un-layout-default__warning-message"
    />

    <div
      v-else
      class="un-layout-default__main"
    >
      <div
        class="un-layout-default__content un-container"
        :class="{
          'is-content-835': isContent835,
          'is-content-575': isContent575,
        }"
      >
        <div
          v-if="title || $slots.title"
          class="un-layout-default__title-container"
        >
          <slot name="title">
            <h1
              v-if="title"
              class="un-layout-default__title"
              v-text="title"
            />
          </slot>
        </div>

        <div
          v-if="details || $slots.details"
          class="un-layout-default__details-container"
        >
          <slot name="details">
            <h2
              class="un-layout-default__details"
              v-text="details"
            />
          </slot>
        </div>

        <div
          v-if="$slots.breadcrumbs"
          class="un-layout-default__breadcrumbs-container"
        >
          <slot name="breadcrumbs" />
        </div>

        <slot />
      </div>
    </div>

    <UnScrollUpBtn
      v-if="withScrollUp"
      class="un-layout-default__scroll-up-btn"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { useCore } from '@/store';


const UnScrollUpBtn = defineAsyncComponent(() => import(
  /* webpackChunkName: "UnScrollUpBtn" */
  '@/components/common/UnScrollUpBtn.vue'
));

const UnWarningMessageConnect = defineAsyncComponent(() => import(
  /* webpackChunkName: "UnWarningMessageConnect" */
  '@/components/common/UnWarningMessageConnect.vue'
));

const UnWarningMessageNetwork = defineAsyncComponent(() => import(
  /* webpackChunkName: "UnWarningMessageNetwork" */
  '@/components/common/UnWarningMessageNetwork.vue'
));

export default defineComponent({
  name: 'UnLayoutDefault',
  components: {
    UnScrollUpBtn,
    UnWarningMessageNetwork,
    UnWarningMessageConnect,
  },
  props: {
    title: String,
    details: String,
    isContent835: Boolean,
    isContent575: Boolean,

    checkConnect: Boolean,
    checkNetwork: Boolean,

    withScrollUp: Boolean,

    withHomeGrass: Boolean,
    withWhale: Boolean,
    withSmallFishes: Boolean,
    withMountain: Boolean,
    withGrass: Boolean,
  },
  setup: () => {
    const {
      isAnyConnected,
      isLoadingConnect,
      isSupportedNetwork,
      appChainId: chainId,
    } = useCore();

    return {
      isAnyConnected,
      isLoadingConnect,
      isSupportedNetwork,
      chainId,
    };
  },
});
</script>

<style lang="scss">
.un-layout-default {
  $root: &;

  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 562px;
  overflow: hidden; // need for 1060px and overflow bg-grass.svg
  background: linear-gradient(180deg, #2c4ba9 0%, #162d75 78.44%);

  &.with-home-grass {
    @include media-gte(tablet) {
      background:
        left 25% no-repeat url("~@/assets/images/background/home-bg-left.png"),
        right top no-repeat url("~@/assets/images/background/home-bg-right.png"),
        15% center no-repeat url("~@/assets/images/background/fish.svg"),
        90% 90% no-repeat url("~@/assets/images/background/fish-2.svg");
    }
  }

  &.view-terms {
    #{$root}__details-container {
      margin: 0 0 30px;
    }
  }

  &__content {
    position: relative;
    z-index: 3;
    margin: 7px auto;

    &.is-content-835 {
      max-width: 835px;
    }

    &.is-content-575 {
      max-width: 575px;
    }

    @include media-lte(tablet) {
      margin: 10px auto;
    }
  }

  &__title-container {
    margin-bottom: 14px;
  }

  &__details-container {
    margin-bottom: 15px;
  }

  &__breadcrumbs-container {
    margin-bottom: 15px;
  }

  &__title-container + &__details-container,
  &__title-container + &__breadcrumbs-container {
    margin-top: -14px;
  }

  &__title,
  &__details {
    line-height: 100%;
    color: #fff;
    letter-spacing: 0.01em;
  }

  &__title {
    font-size: 24px;
    font-weight: 600;
  }

  &__details {
    font-size: 18px;
    font-weight: 300;
  }

  &__scroll-up-btn {
    z-index: 1;
  }

  &__whale {
    top: 250px;
    right: 40px;
  }

  &__grass {
    top: 230px;
    left: -64px;
  }

  &__mountain {
    top: 106px;
    right: -0.44%;
  }

  &__small-fishes {
    top: 657.38px;
    left: 115px;
    width: 1315.6px;
    height: 817.28px;
  }

  .is-bg-img {
    position: absolute;
    z-index: 2;
    display: none;

    @include media-gte(desktop) {
      display: block;
    }
  }

  & &__warning-message {
    top: 50%;
    z-index: 3;
    transform: translateY(-50%);
  }
}
</style>
