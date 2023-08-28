<template>
  <img
    v-svg-inline
    :src="require('@/assets/images/icons/plus-circle.svg')"
    class="home-markets-table-col-plus"
  >
</template>

<script lang="ts">
import { defineComponent } from 'vue';


export default defineComponent({
  name: 'HomeMarketsTableColPlus',
  inheritAttrs: false,
});
</script>

<style lang="scss">
.home-markets-table-col-plus {
  path {
    transition: fill-opacity 0.3s;

    @media (hover: hover) and (pointer: fine) {
      .is-hoverable:hover & {
        fill-opacity: 1;
      }
    }
  }
}
</style>
