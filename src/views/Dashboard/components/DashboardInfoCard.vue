<template>
  <div
    class="dashboard-info-card"
    :class="{ 'is-text--orange': textOrange }"
  >
    <div class="dashboard-info-card__text-wrap">
      <div v-if="icon" class="dashboard-info-card__icon-wrap">
        <img
          v-svg-inline
          :src="icon"
          class="dashboard-info-card__icon"
        >
      </div>

      <div
        class="dashboard-info-card__text"
        v-text="text"
      />
    </div>

    <UnSkeleton
      v-if="skeleton"
      width="115px"
      height="22px"
      class="dashboard-info-card__skeleton"
    />

    <div v-else class="dashboard-info-card__value-wrap">
      <div
        v-if="value"
        class="dashboard-info-card__value"
        v-text="value"
      />
      <div
        v-if="subvalue"
        class="dashboard-info-card__subvalue"
        v-text="subvalue"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import UnSkeleton from '@/components/ui/UnSkeleton.vue';


export default defineComponent({
  name: 'DashboardInfoCard',
  components: {
    UnSkeleton,
  },
  props: {
    icon: String,
    value: String,
    subvalue: String,
    text: {
      type: String,
      required: true,
    },
    textOrange: Boolean,
    small: Boolean,
    skeleton: Boolean,
    loading: Boolean,
  },
});
</script>

<style lang="scss">
.dashboard-info-card {
  $root: &;

  min-height: auto !important;

  @include media-gt(desktop) {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__text-wrap {
    display: flex;
    align-items: center;
  }

  &__icon-wrap {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    margin-right: 16px;
    background: rgba(51, 119, 255, 0.1);
    border-radius: 100%;

    #{$root}.is-text--orange & {
      background: rgba(218, 145, 78, 0.1);
    }
  }

  &__icon {
    width: 18px;
    height: 18px;
    color: #37f;

    #{$root}.is-text--orange & {
      color: #da914e;
    }
  }

  &__text {
    font-size: 13px;
    line-height: 19px;

    @include media-gt(tablet) {
      font-size: 14px;
      line-height: 21px;
    }
  }

  &__value-wrap {
    @include media-lt(desktop) {
      margin-top: 9px;
    }

    @include media-gt(desktop) {
      text-align: end;
    }
  }

  &__value {
    font-size: 16px;
    font-weight: 600;
    line-height: 100%;

    @include media-gt(tablet) {
      font-size: 22px;
    }

    #{$root}.is-text--orange & {
      color: #da914e;
    }
  }

  &__subvalue {
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    color: #739efa;
  }

  &__skeleton {
    @include media-lt(desktop) {
      margin: 15px 0 6px;
    }
  }
}
</style>
