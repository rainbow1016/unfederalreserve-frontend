<template>
  <div
    :styles="header.style"
    :class="[header.class, {
      'is-left': header.left,
      'is-right': header.right,
      [`th-${header.key}`]: true,
    }]"
    class="un-table-th"
  >
    <slot
      :name="`th-${header.key}`"
      :header="header"
      :index="index"
    >
      <UnTooltip
        :content-text="header.tooltipText"
        content-width="240px"
        :disabled="!header.tooltipText"
        bordered
      >
        <template #activator>
          {{ header.label }}
        </template>
      </UnTooltip>
    </slot>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { ITableHeader } from './utils';

import UnTooltip from '@/components/ui/UnTooltip.vue';


export default defineComponent({
  name: 'UnTableTh',
  components: {
    UnTooltip,
  },
  inheritAttrs: false,
  props: {
    index: {
      type: Number as PropType<number>,
      required: true,
    },
    header: {
      type: Object as PropType<ITableHeader[]>,
      required: true,
      validator: (prop: ITableHeader) => (
        true
        && 'label' in prop
        && 'key' in prop
      ),
    },
  },
});
</script>

<style lang="scss">
.un-table-th {
  display: flex;
  flex: 1 1;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  line-height: 26px;
  color: $un-color-soft-gray;

  &.is-left {
    justify-content: flex-start;
    text-align: left;
  }

  &.is-right {
    justify-content: flex-end;
    text-align: right;
  }
}
</style>
