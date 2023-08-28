<template>
  <transition name="transition--fade" mode="out-in" appear>
    <div
      v-if="isShow"
      :key="text"
      :class="{ 'is-blue': isBlue }"
      class="un-banner"
    >
      <div
        class="un-banner__container un-container"
      >
        <div
          class="un-banner__content"
          :class="{ 'is-center': center }"
        >
          <img
            :src="require(`@/assets/images/icons/warning-notific.svg`)"
            class="un-banner__icon"
          >
          <p class="un-banner__text" data-testid="banner-text">
            <a
              v-if="isUpdateAgents"
              href="https://unfederalreserve.medium.com/new-stablecoin-apy-methodology-and-impact-on-liquidity-for-reservelending-participants-f36686e763da"
              target="_blank"
              class="un-banner__link un-banner__update"
              data-testid="banner-update-link"
              v-text="'Update unFed Agents:'"
            />

            <slot>{{ text }}</slot>

            <a
              v-if="isMoreInfo"
              href="https://unfederalreserve.medium.com/new-stablecoin-apy-methodology-and-impact-on-liquidity-for-reservelending-participants-f36686e763da"
              target="_blank"
              class="un-banner__link un-banner__more-info"
              data-testid="banner-info-link"
              v-text="'More info'"
            />
          </p>
        </div>

        <span @click="onClose">
          <img
            v-svg-inline
            src="@/assets/images/icons/close.svg"
            class="un-banner__close"
          >
        </span>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';


export default defineComponent({
  name: 'UnBanner',
  props: {
    isMoreInfo: Boolean,
    isUpdateAgents: Boolean,
    isBlue: Boolean,
    center: Boolean,
    text: String,
    modelValue: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const isShow = ref(props.modelValue);

    const onClose = () => {
      isShow.value = false;
      ctx.emit('update:modelValue', false);
    };

    watch(() => props.text, () => {
      isShow.value = props.modelValue;
    });

    return {
      isShow,
      onClose,
    };
  },
});
</script>

<style lang="scss">
.un-banner {
  position: relative;
  z-index: 11;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  background: $un-color-warning-notification;

  @include media-gte(tablet) {
    font-size: 14px;
    line-height: 140%;
  }

  @include media-lt(tablet) {
    font-size: 12px;
    line-height: 17px;
  }

  &.is-blue {
    background: #274191;
  }

  &__container {
    display: flex;

    @include media-gte(tablet) {
      align-items: center;
      padding: 8px 23px;
    }

    @include media-lt(tablet) {
      align-items: flex-start;
      padding: 8px;
    }
  }

  &__icon {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    height: 22px;
    margin-right: 7px;

    @include media-lt(tablet) {
      margin-top: 3px;
    }
  }

  &__text {
    margin: 0;
    word-spacing: 0;
  }

  &__content {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    font-weight: 400;
    color: $un-color-white;

    &.is-center {
      justify-content: center;
      text-align: center;
    }

    @include media-lt(tablet) {
      align-items: flex-start;
    }
  }

  &__link {
    padding-bottom: 0;
    line-height: inherit;
    color: $un-color-white;
    text-decoration: none;
    letter-spacing: 0;

    &:hover {
      opacity: 0.9;
    }
  }

  &__more-info {
    flex-shrink: 0;
    font-weight: 400;
    color: $un-color-white;
    text-decoration: underline;
    white-space: pre;
  }

  &__update {
    font-weight: 500;
  }

  &__close {
    display: flex;
    align-items: center;
    margin-left: 12px;
    color: white;
    cursor: pointer;
    transition: 0.3s;

    @include media-lt(tablet) {
      margin-top: 4px;
    }

    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
