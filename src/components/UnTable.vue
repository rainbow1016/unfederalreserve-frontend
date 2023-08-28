<template>
  <div class="un-table">
    <header
      v-if="!hiddenHeaders"
      class="un-table__header is-header"
    >
      <UnTableTh
        v-for="(header, index) in headers"
        :key="header.key"
        :header="header"
        :index="index"
      >
        <template v-for="(_, key) in $slots" #[key]="props">
          <slot :name="key" v-bind="props" />
        </template>
      </UnTableTh>
    </header>

    <UnLoaderLine
      v-if="loading"
      class="un-table__loader"
    />

    <main v-if="data.length" class="un-table__main">
      <template v-for="(item, index) in data" :key="item?.[itemKey] || index">
        <UnTableRow
          :headers="headers"
          :data="item"
          :index="index"
          :with-border="withBorder"
          :expanded="innerExpanded.includes(itemKey ? item?.[itemKey] : item)"
          :hoverable="hoverable || expandable"
          :get-row-location="getRowLocation"
          :data-testid="item?.[itemKey]"
          @click="onClick(item)"
        >
          <template v-for="(_, key) in $slots" #[key]="props">
            <slot :name="key" v-bind="props" />
          </template>
        </UnTableRow>
      </template>
    </main>

    <template v-else-if="loading && dataLoading">
      <main class="un-table__main is-data-loading">
        <slot name="data-loading">
          {{ dataLoading }}
        </slot>
      </main>
    </template>

    <main v-else class="un-table__main is-data-empty">
      <slot name="data-empty">
        {{ dataEmpty }}
      </slot>
    </main>

    <footer class="un-table__footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<script lang="ts">
import {
  PropType,
  defineComponent,
  ref,
} from 'vue';
import { ITableHeader } from './UnTable/utils';

import UnLoaderLine from '@/components/ui/UnLoaderLine.vue';
import UnTableTh from './UnTable/UnTableTh.vue';
import UnTableRow from './UnTable/UnTableRow.vue';


export default defineComponent({
  name: 'UnTable',
  components: {
    UnLoaderLine,
    UnTableTh,
    UnTableRow,
  },
  props: {
    hoverable: Boolean,
    expandable: Boolean,
    loading: Boolean,
    withBorder: Boolean,
    itemKey: String,
    headers: {
      type: Array as PropType<ITableHeader[]>,
      required: true,
    },
    hiddenHeaders: {
      type: Boolean,
    },
    data: {
      type: Array as PropType<Record<string, unknown>[]>,
      required: true,
    },
    expanded: {
      type: Array,
      default: () => [],
    },
    dataEmpty: {
      type: String,
      default: 'NO DATA',
    },
    dataLoading: {
      type: String,
      default: 'DATA LOADING...',
    },
    getRowLocation: {
      type: Function,
    },
  },
  emits: [
    'click-row',
    'update:expanded',
  ],
  setup: (props, ctx) => {
    const expanded = props.expandable ? props.expanded : [];
    const innerExpanded = ref(expanded);

    const onClick = (data: typeof props.data[number]) => {
      ctx.emit('click-row', data);

      if (props.expandable) {
        const { itemKey } = props;
        const val = itemKey ? data[itemKey] : data;
        let list = innerExpanded.value.slice();
        const index = list.indexOf(val);

        if (index === -1) {
          list = list.concat(val);
        } else {
          list.splice(index, 1);
        }

        innerExpanded.value = list;
        ctx.emit('update:expanded', list);
      }
    };

    return {
      innerExpanded,
      onClick,
    };
  },
});
</script>

<style lang="scss">
.un-table {
  padding-bottom: 17px;

  &__header {
    display: flex;
    padding: 0 25px;
    margin-bottom: 20px;
  }

  &__main {
    &.is-data-empty,
    &.is-data-loading {
      padding: 16px;
      color: white;
      text-align: center;
      opacity: 0.75;
    }
  }

  &__loader {
    height: 2px;
    margin-top: -2px;
  }
}
</style>
