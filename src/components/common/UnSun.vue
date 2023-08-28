<template>
  <div class="un-sun">
    <div class="un-sun__wrap">
      <div class="un-sun__value" data-testid="header-apy-value">
        {{ value }}
      </div>
      <UnTooltip
        :content-text="tooltipText"
        content-width="220px"
        class="un-sun__title"
        bordered
      >
        <template #activator>
          <h5>
            {{ title }}
          </h5>
        </template>
      </UnTooltip>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import UnTooltip from '@/components/ui/UnTooltip.vue';


export default defineComponent({
  name: 'UnSun',
  components: {
    UnTooltip,
  },
  props: {
    value: String,
    title: String,
    tooltipText: String,
  },
});
</script>

<style lang="scss">
.un-sun {
  width: 200px;
  height: 200px;
  color: $un-color-tundora;
  text-align: center;
  background-image: url(~@/assets/images/background/mobile-sun.svg);
  background-repeat: no-repeat;

  @include media-gte(tablet) {
    width: 655px;
    height: 655px;
    background-image: url(~@/assets/images/background/sun.svg);
    background-size: 100%;
  }

  @include media-lt(mobile-xs) {
    width: 140px;
    height: 144px;
    background-size: cover;
  }

  &__wrap {
    width: 100px;
    padding-top: 32%;
    margin: 0 auto;

    @include media-gte(tablet) {
      width: 130px;
    }

    @include media-lt(tablet) {
      padding-top: 28%;
      margin-left: 42px;
    }

    @include media-lt(mobile-xs) {
      padding-top: 25%;
      margin-left: 21px;
    }
  }

  &__value {
    margin-bottom: 5px;
    font-size: 22px;
    font-weight: 700;
    line-height: 37px;

    @include media-gte(tablet) {
      font-size: 25px;
    }
  }

  &__title {
    font-size: 13px;
    font-weight: 600;
    line-height: 20px;

    @include media-gte(tablet) {
      font-size: 17px;
    }
  }
}
</style>
