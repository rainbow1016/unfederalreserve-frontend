<template>
  <!-- eslint-disable vue/no-multiple-template-root -->

  <component
    v-bind="$attrs"
    :is="to ? 'router-link' : 'div'"
    :to="to"
    :class="{
      'is-hoverable': hoverable || !!to,
      'is-expanded': expanded,
      'with-border': withBorder,
    }"
    class="un-table-row"
  >
    <UnTableCol
      v-for="header in headers"
      :key="header.key"
      :header="header"
      :index="index"
      :data="data"
    >
      <template #default="props">
        <slot
          :name="`col-${header.key}`"
          v-bind="props"
        />
      </template>
    </UnTableCol>
  </component>

  <div
    v-if="expanded"
    class="un-table-row-expanded is-expanded"
  >
    <slot
      name="data-expanded"
      :headers="headers"
      :data="data"
      :index="index"
    />
  </div>
</template>

<script lang="ts">
import { RouteLocationRaw } from 'vue-router';
import { PropType, defineComponent, computed } from 'vue';
import { ITableHeader } from './utils';

import UnTableCol from './UnTableCol.vue';


type IGetRowLocation = (data: Record<string, unknown>) => RouteLocationRaw | void;

export default defineComponent({
  name: 'UnTableRow',
  components: {
    UnTableCol,
  },
  inheritAttrs: false,
  props: {
    withBorder: Boolean,
    hoverable: Boolean,
    expanded: Boolean,
    getRowLocation: {
      type: Function as PropType<IGetRowLocation>,
    },
    headers: {
      type: Array as PropType<ITableHeader[]>,
      required: true,
      validator: ([prop]: ITableHeader[]) => (
        true
        && 'key' in prop
      ),
    },
    data: {
      type: Object as PropType<Record<string, unknown>>,
      // required: true,
    },
    index: {
      type: Number as PropType<number>,
      required: true,
    },
  },
  setup: (props) => {
    const to = computed(() => (
      props.data && props.getRowLocation?.(props.data)
    ));

    return { to };
  },
});
</script>

<style lang="scss">
.un-table-row,
.un-table-row-expanded {
  padding: 0 25px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;

  &.with-border {
    border-top: 1px solid rgba(149, 173, 255, 0.1);
  }

  &.is-expanded {
    background: rgba(0, 25, 102, 0.2);
  }

  @include media-lte(tablet) {
    padding: 0 20px;
    font-size: 13px;
  }
}

.un-table-row {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  min-height: 60px;
  text-decoration: none;
  word-wrap: break-word;

  &:first-child {
    border-top: 0;
  }

  @media (hover: hover) and (pointer: fine) {
    &.is-hoverable:hover {
      cursor: pointer;
      background-image:
        linear-gradient(
          90deg,
          rgba(79, 118, 255, 0.3) 9.36%,
          rgba(79, 118, 255, 0.08) 100%
        );
    }
  }
}

.un-table-row-expanded {
  border-top: 1px solid #2c4597;
  border-bottom: 1px solid #2c4597;
}
</style>
