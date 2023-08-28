<template>
  <UnSkeleton
    v-if="skeleton"
    height="16px"
    width="100%"
    class="markets-top-3-details markets-top-3-details__skeleton"
  />

  <UnProgressLine
    v-else
    :value="data.percent"
    :max="100"
    class="markets-top-3-details"
  >
    <template #info-before>
      {{ data.symbol }}
    </template>

    <template #info-percent="{ percent }">
      <span
        class="markets-top-3-details__percent"
        v-text="percent + '%'"
      />
    </template>
  </UnProgressLine>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';

import UnProgressLine from '@/components/common/UnProgressLine.vue';
import UnSkeleton from '@/components/ui/UnSkeleton.vue';

type IMarketsTop3Details = {
  symbol: number;
  percent: string;
}

export default defineComponent({
  name: 'MarketsTop3Details',
  components: {
    UnProgressLine,
    UnSkeleton,
  },
  props: {
    data: {
      type: Object as PropType<IMarketsTop3Details>,
      required: true,
      validator: (prop: IMarketsTop3Details) => (
        prop
        && 'symbol' in prop
        && 'percent' in prop
      ),
    },
    skeleton: Boolean,
  },
});
</script>

<style lang="scss">
.markets-top-3-details {
  &__percent {
    color: $un-color-green;
  }

  &__skeleton {
    margin: 21px 0 1px;
  }
}
</style>
