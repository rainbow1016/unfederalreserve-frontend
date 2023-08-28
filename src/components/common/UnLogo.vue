<template>
  <router-link
    class="un-logo"
    data-testid="main-logo"
    :to="to"
    exact
    v-html="require('!raw-loader!@/assets/images/logo.svg').default"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ROUTE_DASHBOARD } from '@/helpers/enums/routes';


export default defineComponent({
  name: 'UnLogo',
  setup: () => ({
    to: { name: ROUTE_DASHBOARD },
  }),
});
</script>

<style lang="scss">
.un-logo {
  display: flex;
  align-items: center;
  padding-bottom: 0;
  border-bottom: $un-unset-value;

  > svg {
    width: 100%;
    max-width: 133px;
    height: 30px;

    @include media(tablet) {
      width: 100%;
      max-width: 100%;
      height: 100%;
    }
  }
}

</style>
