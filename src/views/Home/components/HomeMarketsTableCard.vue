<template>
  <UnCard
    :title="title"
    :transparent="transparent"
    no-padding
    class="home-markets-table-card"
  >
    <HomeMarketsTable
      :headers="headers"
      :markets="markets"
      :loading="loading"
      :skeleton="skeleton"
      :empty_title="empty_title"
      :empty_description="empty_description"
      :data-testid="testid"
      :type="$attrs.type"
      :hoverable="$attrs.onClickRow ? true : false"
      class="home-markets-table-card__table"
      @click-row="$attrs.onClickRow ? $attrs.onClickRow($event, $attrs.type) : null"
      @click-collateral="$attrs.onClickCollateral"
    />
  </UnCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import UnCard from '@/components/ui/UnCard.vue';
import HomeMarketsTable from './HomeMarketsTable.vue';


export default defineComponent({
  name: 'HomeMarketsTableCard',
  components: {
    UnCard,
    HomeMarketsTable,
  },
  props: {
    loading: Boolean,
    skeleton: Boolean,
    transparent: Boolean,
    title: {
      type: String,
    },
    empty_title: {
      type: String,
      required: true,
    },
    empty_description: {
      type: String,
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
    markets: {
      type: Array,
      required: true,
    },
    testid: {
      type: String,
    },
  },
});
</script>

<style lang="scss">
.home-markets-table-card {
  &__progress {
    margin-bottom: -8px;
    margin-left: 20px;
  }

  &__table {
    margin-top: 5px;

    .un-table {
      &__header {
        margin-bottom: 10px;
      }
    }

    &.is-disabled {
      margin-top: 20px;
    }
  }

  &__disabled-line {
    margin: 10px 25px;
  }
}
</style>
