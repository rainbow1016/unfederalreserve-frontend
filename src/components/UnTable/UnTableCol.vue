<template>
  <div
    :style="[header.style, header.cellStyle]"
    :class="[header.class, header.cellClass, {
      'is-left': header.left,
      'is-right': header.right,
      [`col-${header.key}`]: true,
    }]"
    :data-testid="header.key"
    class="un-table-col is-col"
  >
    <slot
      :header="header"
      :data="data"
      :value="value"
      :index="index"
    >
      {{ value }}
    </slot>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, computed } from 'vue';
import { ITableHeader } from './utils';


const getValue = (
  header: ITableHeader,
  data: Record<string, unknown> | undefined,
  index: number,
) => {
  const { key, field } = header;
  const value = data && key in data ? data[key] : key;

  return field
    ? field(value, data, header, index)
    : value;
};

export default defineComponent({
  name: 'UnTableCol',
  inheritAttrs: false,
  props: {
    index: {
      type: Number as PropType<number>,
      required: true,
    },
    header: {
      type: Object as PropType<ITableHeader>,
      required: true,
      validator: (prop: ITableHeader) => (
        true
        && 'key' in prop
      ),
    },
    data: {
      type: Object as PropType<Record<string, unknown>>,
      // required: true,
    },
  },
  setup: (props) => {
    const value = props.header.field
      ? computed(() => (
        getValue(props.header, props.data, props.index)
      ))
      : getValue(props.header, props.data, props.index);

    return { value };
  },
});
</script>

<style lang="scss">
.un-table-col {
  display: flex;
  align-items: center;

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
