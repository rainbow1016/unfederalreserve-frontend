<template>
  <UnProgressLine
    :value="value"
    :max="limit"
    with-type
    class="home-borrow-progress"
  >
    <template #info-before>
      Borrow Limit
    </template>

    <template #info-percent="{ percent }">
      <UnWarningPercent
        :percent="percent"
      />
    </template>

    <template #info-value>
      <UnTooltip
        content-text="Available credit"
        content-min-width="140px"
        :activator-text="limit_f"
      />
    </template>
  </UnProgressLine>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { formatToCurrency } from '@/helpers/formatters';

import UnTooltip from '@/components/ui/UnTooltip.vue';
import UnProgressLine from '@/components/common/UnProgressLine.vue';
import UnWarningPercent from '@/components/common/UnWarningPercent.vue';


export default defineComponent({
  name: 'HomeBorrowProgress',
  components: {
    UnTooltip,
    UnProgressLine,
    UnWarningPercent,
  },
  props: {
    value: {
      type: Number,
      required: true,
    },
    limit: {
      type: Number,
      required: true,
    },
  },
  setup: (props) => {
    const limit_f = computed(() => (
      formatToCurrency(props.limit)
    ));

    return { limit_f };
  },
});
</script>

<style lang="scss">
.home-borrow-progress {
  width: 100%;
}
</style>
