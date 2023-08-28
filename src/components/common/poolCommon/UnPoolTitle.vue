<template>
  <div class="un-pool-title">
    <router-link :to="to" class="un-pool-title__back-link">
      <img
        v-svg-inline
        src="@/assets/images/icons/arrow-right.svg"
        class="un-pool-title__back-arrow"
      >
    </router-link>
    <h1
      class="un-pool-title__title"
      v-text="text"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue';


export default defineComponent({
  name: 'UnPoolTitle',
  props: {
    to: Object,
    text: String,
  },
});
</script>

<style lang="scss">

.un-pool-title {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &__back-link {
    position: absolute;
    left: 14px;
    color: #fff;
    cursor: pointer;
    transition: opacity 0.2s;
    transform: rotate(180deg);

    &:hover {
      opacity: 0.5;
    }
  }

  &__back-arrow {
    width: 20px;
    height: 20px;
  }

  &__title {
    font-size: 20px;
    font-weight: 600;
    line-height: 144%;
  }
}
</style>
