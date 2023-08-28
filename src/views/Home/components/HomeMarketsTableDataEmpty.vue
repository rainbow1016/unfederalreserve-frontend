<template>
  <div class="home-markets-table-data-empty">
    <img
      v-svg-inline
      :src="require('@/assets/images/icons/bubble.svg')"
      class="home-markets-table-data-empty__image"
    >

    <div class="home-markets-table-data-empty__text">
      <div class="home-markets-table-data-empty__title">
        {{ title }}
      </div>

      <div class="home-markets-table-data-empty__description">
        {{ description }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';


export default defineComponent({
  name: 'HomeMarketsTableDataEmpty',
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="scss">
.home-markets-table-data-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 11px;
  margin-bottom: 17px;
  line-height: 26px;
  color: $un-color-soft-gray;

  &__image {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
  }

  &__text {
    margin-left: 22px;
    text-align: left;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
  }

  &__description {
    font-size: 14px;
    font-weight: 400;
  }
}
</style>
