<template>
  <div class="markets-mob-table">
    <template v-if="markets.length">
      <MarketsMobileTableRow
        v-for="(item, index) in markets"
        :key="item.symbol || index"
        :data="item"
        :loading="loading"
        :skeleton="skeleton"
        :symbol="item.symbol"
      />
    </template>

    <template v-else-if="loading && dataLoading">
      <main>
        <slot name="data-loading">
          {{ dataLoading }}
        </slot>
      </main>
    </template>

    <main v-else>
      <slot name="data-empty">
        {{ dataEmpty }}
      </slot>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import MarketsMobileTableRow from './MarketsMobileTableRow.vue';

export default defineComponent({
  name: 'MarketsMobileTable',
  components: {
    MarketsMobileTableRow,
  },
  props: {
    loading: Boolean,
    skeleton: Boolean,
    markets: {
      type: Array,
      required: true,
    },
    dataEmpty: {
      type: String,
      default: 'NO DATA',
    },
    dataLoading: {
      type: String,
      default: 'DATA LOADING...',
    },
  },
});
</script>

<style lang="scss">
.markets-mob-table {
  margin-top: 25px;
}
</style>
