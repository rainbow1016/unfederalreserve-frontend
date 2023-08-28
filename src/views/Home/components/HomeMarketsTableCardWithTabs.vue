<template>
  <UnCard
    no-padding
    class="home-markets-table-card-with-tabs"
  >
    <template #header>
      <UnTabs
        v-model="currentTab"
        :options="options"
        dense
        class="home-markets-table-card-with-tabs__tabs"
      />
    </template>

    <HomeMarketsTable
      v-bind="currentData"
      :loading="loading"
      class="home-markets-table-card-with-tabs__table"
      @click-row="$attrs.onClickRow($event, currentData.type)"
      @click-collateral="$attrs.onClickCollateral"
    />
  </UnCard>
</template>

<script lang="ts">
// eslint-disable-next-line object-curly-newline
import { PropType, computed, defineComponent, ref } from 'vue';

import UnCard from '@/components/ui/UnCard.vue';
import UnTabs from '@/components/ui/UnTabs.vue';
import HomeMarketsTable from './HomeMarketsTable.vue';

type IMarketItem = {
  title: string;
  empty_title: string;
  empty_description: string;
  headers: unknown[];
  markets: unknown[];
}

export default defineComponent({
  name: 'HomeMarketsTableCardWithTabs',
  components: {
    UnCard,
    UnTabs,
    HomeMarketsTable,
  },
  props: {
    loading: Boolean,
    marketList: {
      type: Array as PropType<IMarketItem[]>,
      required: true,
      validator: ([prop]: IMarketItem[]) => (
        prop
        && 'title' in prop
        && 'empty_title' in prop
        && 'empty_description' in prop
        && 'headers' in prop
        && 'markets' in prop
      ),
    },
  },
  setup: (props) => {
    const options = computed(() => (
      props.marketList.map((data, index) => ({
        label: data.title,
        value: index,
      }))
    ));

    const currentTab = ref(options.value[0]);

    const currentData = computed(() => (
      props.marketList[currentTab.value.value]
    ));

    return {
      currentTab,
      currentData,
      options,
    };
  },
});
</script>

<style lang="scss">
.home-markets-table-card-with-tabs {
  &__tabs {
    font-size: 17px;

    @include media-lte(tablet-xs) {
      width: 10%;
      font-size: 14px;
    }
  }

  &__table {
    margin-top: 35px;

    &.is-disabled {
      margin-top: 20px;
    }
  }
}
</style>
