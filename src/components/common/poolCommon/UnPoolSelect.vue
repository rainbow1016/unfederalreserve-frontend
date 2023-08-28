<template>
  <UnDropdown
    :disabled="disabled"
    dark
    class="un-pool-select"
  >
    <template #selected>
      <UnToken
        v-if="selected"
        :icons="[selected.icon]"
        :symbol="selected.symbol"
      />
    </template>

    <template #listItem>
      <ul
        v-if="options"
        class="un-pool-select__lists"
      >
        <li
          v-for="item in options"
          :key="item.symbol"
          :class="{ 'is-active': item === selected }"
          class="un-pool-select__item-wrap"
          @click="$emit('change', item)"
        >
          <UnToken
            :icons="[item.icon]"
            :symbol="item.symbol"
            class="un-pool-select__item"
          />
        </li>
      </ul>
    </template>
  </UnDropdown>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import UnDropdown from '@/components/ui/UnDropdown.vue';
import UnToken from '@/components/common/UnToken.vue';


export default defineComponent({
  name: 'UnPoolSelect',
  components: {
    UnDropdown,
    UnToken,
  },
  props: {
    disabled: Boolean,
    options: {
      type: Array,
      required: true,
    },
    selected: {
      type: Object,
      required: true,
    },
  },
  emits: ['change'],
});
</script>

<style lang="scss">
.un-pool-select {
  min-width: 126px;
  min-height: 38px;
  background: #1d3582;
  border-radius: 25px;

  @include media-gt(tablet) {
    min-width: 160px;
  }

  &__item-wrap {
    padding: 7px 15px;

    &:hover {
      cursor: pointer;
      background: #244199;
    }
  }
}
</style>
