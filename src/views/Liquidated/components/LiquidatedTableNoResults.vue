<template>
  <div class="liquidated-table-no-results">
    <img
      :src="require('@/assets/images/icons/not-found-icon.svg')"
      class="liquidated-table-no-results__icon"
      alt="not found"
    >
    <div class="liquidated-table-no-results__text">
      <h5 class="liquidated-table-no-results__title">
        No results found
      </h5>
      <p class="liquidated-table-no-results__description">
        There were no results for “{{ search }}”
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LiquidatedTableNoResults',
  props: {
    search: String,
  },
});
</script>

<style lang="scss">
.liquidated-table-no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 76px 0;
  text-align: center;

  &__icon {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }

  &__text {
    font-size: 13px;
    font-weight: 500;
    line-height: 19px;
    color: $un-color-havelock-blue;
    text-align: center;
  }

  &__title {
    margin-bottom: 4px;
    font-size: 18px;
    font-weight: 600;
    line-height: 26px;
  }
}
</style>
