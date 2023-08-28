<template>
  <div class="dashboard-old-staking">
    <div class="dashboard-old-staking__top-info">
      <img
        v-svg-inline
        class="dashboard-old-staking__top-info-img"
        src="@/assets/images/icons/warning-notific.svg"
      >
      <p>
        The old LP staking app is no longer supported.
        We encourage you to migrate your LP tokens to Uniswap v3.
      </p>
    </div>
    <div class="dashboard-old-staking__wrap">
      <div class="dashboard-old-staking__left">
        <div class="dashboard-old-staking__img">
          <img :src="require('@/assets/images/staking-old.png')">
        </div>
        <div class="dashboard-old-staking__input">
          <div class="dashboard-old-staking__currency">
            ERSDL-ETH UNI-V2 LP
          </div>
          <div class="dashboard-old-staking__amount">
            <UnSkeleton
              v-if="skeleton"
              height="20px"
              width="90px"
            />
            <span v-else>{{ balance }} LP</span>
          </div>
        </div>
      </div>
      <div class="dashboard-old-staking__right">
        <a href="https://app.uniswap.org/#/pool/v2" target="_blank" class="dashboard-old-staking__link">
          Manage
          <img class="dashboard-old-staking__link-icon" :src="require('@/assets/images/icons/link.svg')">
        </a>
        <a href="https://app.uniswap.org/#/migrate/v2" target="_blank" class="dashboard-old-staking__link">
          Migrate to V3
          <img class="dashboard-old-staking__link-icon" :src="require('@/assets/images/icons/link.svg')">
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import UnSkeleton from '@/components/ui/UnSkeleton.vue';

export default defineComponent({
  name: 'DashboardOldStaking',
  components: {
    UnSkeleton,
  },
  props: {
    skeleton: Boolean,
    balance: Number,
  },
});
</script>

<style lang="scss">
.dashboard-old-staking {
  padding: 24px 30px 30px;
  background: $un-color-pink-card;
  backdrop-filter: blur(5px);
  border-radius: 20px;

  @include media-lte(tablet-xs) {
    padding: 20px 15px 12px 15px;
  }

  &__top-info {
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 21px;
    color: $un-color-yellow-light;

    p {
      margin-bottom: 0;
    }
  }

  &__top-info-img {
    flex-shrink: 0;
    margin-right: 8px;

    path {
      fill: $un-color-yellow-light;
    }
  }

  &__wrap {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;

    @include media-lte(tablet) {
      flex-direction: column;
    }
  }

  &__left {
    display: flex;
    flex: 1;
    align-items: center;

    @include media-lte(tablet) {
      margin-bottom: 20px;
    }
  }

  &__img {
    display: flex;
    align-items: center;
    margin-right: 11px;
  }

  &__input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 465px;
    padding: 18px 16px;
    background: $un-color-pink-dark;
    border-radius: 20px;

    @include media-lte(tablet) {
      max-width: 100%;
    }

    @include media-lte(tablet-xs) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &__currency {
    font-size: 15px;
    line-height: 100%;
    color: $un-color-white;
    letter-spacing: 0.01em;

    @include media-lte(tablet-xs) {
      margin-bottom: 5px;
    }
  }

  &__amount {
    font-size: 18px;
    font-weight: 600;
    line-height: 100%;
    color: $un-color-white;
    letter-spacing: 0.01em;
  }

  &__right {
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    align-items: center;
  }

  &__link {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px 18px;
    margin-left: 9px;
    font-size: 12px;
    font-weight: 500;
    line-height: 21px;
    color: $un-color-white;
    text-align: center;
    text-decoration: none;
    background: $un-color-pink-gradient;
    border: 2px solid $un-color-pink-light;
    border-radius: 25px;
    transition: 0.3s;

    @include media-lte(tablet-xs) {
      margin-bottom: 8px;
    }

    &:hover {
      opacity: 0.8;
    }
  }

  &__link-icon {
    margin-left: 6px;
  }
}

</style>
