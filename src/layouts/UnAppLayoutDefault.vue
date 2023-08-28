<template>
  <section class="un-ap-layout-default">
    <header class="un-ap-layout-default__header">
      <UnLayoutDefaultHeader />
      <UnHeaderNetworkLabel
        v-if="withLabel"
      />
    </header>

    <main class="un-ap-layout-default__main">
      <router-view />
    </main>

    <footer class="un-ap-layout-default__footer">
      <UnLayoutDefaultFooter />
    </footer>
  </section>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import UnLayoutDefaultHeader from './components/UnLayoutDefaultHeader.vue';
import UnLayoutDefaultFooter from './components/UnLayoutDefaultFooter.vue';


const UnHeaderNetworkLabel = defineAsyncComponent(() => import(
  './components/UnHeaderNetworkLabel.vue'
));

export default defineComponent({
  name: 'UnAppLayoutDefault',
  components: {
    UnLayoutDefaultHeader,
    UnLayoutDefaultFooter,
    UnHeaderNetworkLabel,
  },
  setup: () => ({
    withLabel: process.env.VUE_APP_ENV !== 'master',
  }),
});
</script>

<style lang="scss">
.un-ap-layout-default {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 100%;
  background: linear-gradient(336deg, #011044 18.92%, #2c4ba9 84.6%);

  &__header,
  &__footer {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  &__header {
    position: sticky;
    top: 0;
    z-index: 100;
    height: $un-header-height;
    background: #1e3a94;
  }

  &__main {
    display: flex;
    flex-grow: 1;
    flex-wrap: wrap;
    width: 100%;
  }

  &__footer {
    width: 100%;
  }
}
</style>
