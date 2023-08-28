<template>
  <UnTooltip
    v-if="options"
    :critical="options.critical"
    :content-width="options.contentWidth"
    content-small-text
    class="un-modal-transaction-limits-warning"
  >
    <template #activator>
      <span
        :class="options.classes"
        class="un-modal-transaction-limits-warning__icon"
        v-html="require('!raw-loader!@/assets/images/icons/warning.svg').default"
      />
    </template>

    <template #content>
      <span
        :class="options.classes"
        class="un-modal-transaction-limits-warning__icon-inner"
        v-html="require('!raw-loader!@/assets/images/icons/warning.svg').default"
      />
      <span
        class="un-modal-transaction-limits-warning__content"
        v-html="options.content"
      />
    </template>
  </UnTooltip>
</template>

<script lang="ts">
import { PropType, computed, defineComponent } from 'vue';
import { getWarningTooltipOptions } from '../utils-warning';

import UnTooltip from '@/components/ui/UnTooltip.vue';


export default defineComponent({
  name: 'UnModalTransactionLimitsWarning',
  components: {
    UnTooltip,
  },
  props: {
    value: {
      type: [String, Number] as PropType<string | number>,
      required: true,
    },
  },
  setup(props) {
    const options = computed(() => {
      // convert 0,22% -> 0.22%
      const value = props.value.toString().replace(',', '.').replace(/($|%)/, '');
      return getWarningTooltipOptions(parseFloat(value));
    });

    return {
      options,
    };
  },
});
</script>

<style lang="scss">
$color-red: #fd5252;
$color-orange: #fd7e20;

.un-modal-transaction-limits-warning {
  margin-right: 4px;

  &__icon,
  &__icon-inner {
    &.is-red {
      color: $color-red;
    }

    &.is-orange {
      color: $color-orange;
    }

    &.is-yellow {
      color: $un-color-warning;
    }
  }

  &__icon-inner {
    position: relative;
    top: 2px;
    display: inline-flex;
    align-items: center;

    &.is-red {
      color: white;
    }
  }
}
</style>
