<template>
  <div class="social-links">
    <!-- eslint-disable-next-line vuejs-accessibility/anchor-has-content -->
    <a
      v-for="item in socialList"
      :key="item.icon"
      :href="item.href"
      target="_blank"
      class="social-links__item"
    >
      <img
        v-svg-inline
        :src="item.icon"
      >
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UnSocialLinks',
  props: {
    socialList: {
      type: Array,
      required: true,
    },
  },
});
</script>

<style lang="scss">
.social-links {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;

  @include media-lte(tablet) {
    flex-wrap: wrap;
    justify-content: center;
  }

  @include media-lte(tablet-xs) {
    justify-content: flex-start;
  }

  &__item {
    padding-bottom: 0;
    margin-right: 0;
    margin-bottom: 0;
    color: inherit;
    opacity: 1;

    &:last-child {
      margin-right: 0;
    }

    @include media-lte(tablet) {
      margin-right: 28px;
      margin-bottom: 10px;
    }

    &:hover {
      opacity: 0.8;
    }

    @include media-gte(tablet) {
      margin-right: 40px;
    }
  }
}
</style>
