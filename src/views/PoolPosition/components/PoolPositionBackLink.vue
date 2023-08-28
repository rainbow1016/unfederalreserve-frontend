<template>
  <div class="pool-position-back-link">
    <router-link :to="to" class="pool-position-back-link__router">
      <img
        v-svg-inline
        src="@/assets/images/icons/arrow-right.svg"
        class="pool-position-back-link__back-arrow"
      >
      <span
        class="pool-position-back-link__title"
        v-text="'Back to Pools Overview'"
      />
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ROUTE_POOL } from '@/helpers/enums/routes';


export default defineComponent({
  name: 'PoolPositionBackLink',
  setup: () => ({
    to: {
      name: ROUTE_POOL,
    },
  }),
});
</script>

<style lang="scss">
.pool-position-back-link {
  &__router {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    line-height: 100%;
    color: #739efa;
    text-decoration: none;
    letter-spacing: 0.01em;

    &:hover {
      text-decoration: underline;
    }
  }

  &__back-arrow {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    transform: rotate(180deg);
  }
}
</style>
