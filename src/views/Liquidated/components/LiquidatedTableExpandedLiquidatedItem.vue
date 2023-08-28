<template>
  <div class="liquidated-table-expanded-liquidated-item">
    <strong
      v-if="label"
      :data-testid="`liquidated--${label}`"
      class="liquidated-table-expanded-liquidated-item__label"
      v-text="label"
    />

    <UnSkeleton
      v-if="skeleton"
      :height="href ? '17px' : '16px'"
      width="100px"
      class="liquidated-table-expanded-liquidated-item__skeleton"
    />

    <component
      :is="href ? 'a' : 'span'"
      v-else
      :href="href"
      :class="{ 'is-link': href }"
      class="liquidated-table-expanded-liquidated-item__value"
      target="_blank"
      data-testid="liquidated-value"
      v-text="text"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import UnSkeleton from '@/components/ui/UnSkeleton.vue';


export default defineComponent({
  name: 'LiquidatedTableExpandedLiquidatedItem',
  components: {
    UnSkeleton,
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    href: {
      type: String,
    },
    text: {
      type: String,
      required: true,
    },
    skeleton: Boolean,
  },
});
</script>

<style lang="scss">
.liquidated-table-expanded-liquidated-item {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  margin-bottom: 11px;

  &__label {
    margin-right: 10px;
    font-size: 13px;
    font-weight: 700;
    line-height: 19px;
    color: $un-color-white;
  }

  &__value {
    margin-bottom: 0;
    font-size: 13px;
    font-weight: 500;
    line-height: 19px;
    color: $un-color-white;

    &.is-link {
      padding-bottom: 0;
      font-size: 13px;
      line-height: 19px;
      color: $un-color-dodger-blue;
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: all 0.2s ease-in-out;

      &:hover {
        border-bottom: 1px solid $un-color-dodger-blue;
      }
    }
  }

  &__skeleton {
    margin-bottom: 3px;
  }
}
</style>
