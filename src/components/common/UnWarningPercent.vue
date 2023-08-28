<template>
  <UnBorrowLimitSwitcher :percent="percent">
    <template #default="{ normal, warning, danger, critical, type }">
      <!--
        TODO: [Vue warn]: Extraneous non-props attributes (class) were passed
        to component but could not be automatically inherited because component
        renders fragment or text root nodes
      -->
      <UnTooltip
        :disabled="normal"
        :critical="critical"
        content-width="250px"
        content-small-text
        class="un-warning-percent"
      >
        <template #activator>
          <slot name="activator">
            <span
              :class="`is-type--${type}`"
              class="un-warning-percent__value"
              data-testid="borrow-limit-percentage"
            >
              <img
                v-if="!normal"
                v-svg-inline
                :src="require('@/assets/images/icons/warning.svg')"
                class="un-warning-percent__icon"
              >
              {{ percent }}%
            </span>
          </slot>
        </template>

        <template v-if="warning">
          <img
            v-svg-inline
            :src="require('@/assets/images/icons/warning.svg')"
            :class="`is-type--${type}`"
            class="un-warning-percent__icon is-content"
          >
          <span class="un-font-bold">
            You are in a danger zone.
          </span>
          <br>After your borrow limit exceeds 80%, your token position can be liquidated.
        </template>

        <template v-else-if="danger || critical">
          <img
            v-svg-inline
            :src="require('@/assets/images/icons/warning.svg')"
            :class="`is-type--${type}`"
            class="un-warning-percent__icon is-content"
          >
          Your token position might be liquidated
          <span class="un-font-bold">
            if you won't increase your supply or payback the debt
          </span>
        </template>
      </UnTooltip>
    </template>
  </UnBorrowLimitSwitcher>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import UnTooltip from '@/components/ui/UnTooltip.vue';
import UnBorrowLimitSwitcher from '@/components/common/UnBorrowLimitSwitcher.vue';


export default defineComponent({
  name: 'UnWarningPercent',
  components: {
    UnTooltip,
    UnBorrowLimitSwitcher,
  },
  props: {
    percent: {
      type: Number,
      required: true,
    },
  },
});
</script>

<style lang="scss">
.un-warning-percent {
  &__value,
  &__icon {
    &.is-type {
      &--warning {
        color: $un-color-warning;
      }

      &--danger {
        color: $un-color-danger;
      }

      &--critical:not(.is-content) {
        color: $un-color-critical;
      }
    }
  }

  &__icon {
    width: 20px;
    padding-right: 4px;
    margin-bottom: -2px;
    outline: none;
  }
}
</style>
