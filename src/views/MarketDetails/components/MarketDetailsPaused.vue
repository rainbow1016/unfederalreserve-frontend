<template>
  <div class="market-details-paused">
    <img
      v-svg-inline
      :src="require('@/assets/images/icons/market-paused.svg')"
    >
    <div
      class="market-details-paused__description"
      v-text="'Financial operations including this asset are paused.'"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';


export default defineComponent({
  name: 'MarketDetailsPaused',
  components: {
  },
});
</script>

<style lang="scss">
.market-details-paused {
  padding: 0 70px;
  margin-top: 45px;
  margin-bottom: 70px;
  text-align: center;

  &__description {
    margin-top: 30px;
    font-size: 21px;
    font-weight: 500;
    color: $un-color-blue-6;
  }
}
</style>
