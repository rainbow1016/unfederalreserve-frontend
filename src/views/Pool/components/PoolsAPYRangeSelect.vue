<template>
  <UnSkeleton
    v-if="skeleton"
    height="32px"
    width="145px"
    class="pools-apy-range-select__skeleton"
  />

  <UnDropdown
    v-else
    :disabled="disabled"
    :min-items-width="145"
    transparent-dark
    class="pools-apy-range-select"
  >
    <template #selected>
      <div
        class="pools-apy-range-select__selected-name"
        v-text="modelValue.text"
      />
    </template>

    <template #listItem>
      <ul class="pools-apy-range-select__lists">
        <li
          v-for="item in options"
          :key="item.value"
          class="pools-apy-range-select__item"
          :class="{ 'is-active': item.selected }"
          @click="$emit('update:modelValue', item)"
        >
          <div
            class="pools-apy-range-select__item-name"
            v-text="item.text"
          />
        </li>
      </ul>
    </template>
  </UnDropdown>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import UnDropdown from '@/components/ui/UnDropdown.vue';
import UnSkeleton from '@/components/ui/UnSkeleton.vue';

export default defineComponent({
  name: 'PoolsAPYRangeSelect',
  components: {
    UnDropdown,
    UnSkeleton,
  },
  props: {
    skeleton: Boolean,
    disabled: Boolean,
    options: {
      type: Array,
      required: true,
    },
    modelValue: {
      type: Object,
      required: true,
    },
  },
  emits: ['update:modelValue'],
});
</script>

<style lang="scss">
.pools-apy-range-select {
  &__selected-name {
    padding: 2px 5px;
    font-size: 12px;
    line-height: 18px;
  }

  &__item {
    padding: 11px 18px;
    font-size: 12px;
    line-height: 100%;
    color: #84adfe;
    cursor: pointer;

    &:hover {
      color: #fff;
      background: #28429a;
    }
  }
}
</style>
