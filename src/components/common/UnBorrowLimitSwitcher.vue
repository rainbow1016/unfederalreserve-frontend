<template>
  <!-- eslint-disable vue/no-multiple-template-root -->

  <template v-if="normal">
    <slot name="normal" :type="type" />
  </template>

  <template v-else-if="warning">
    <slot name="warning" :type="type" />
  </template>

  <template v-else-if="danger">
    <slot name="danger" :type="type" />
  </template>

  <template v-else-if="critical">
    <slot name="critical" :type="type" />
  </template>

  <slot
    :type="type"
    :normal="normal"
    :warning="warning"
    :danger="danger"
    :critical="critical"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { BorrowLimitTypes, getBorrowLimitType } from '@/helpers/getBorrowLimitType';


export default defineComponent({
  name: 'UnBorrowLimitSwitcher',
  props: {
    percent: {
      type: Number,
      required: true,
    },
  },
  setup: (props) => {
    const type = computed(() => (
      getBorrowLimitType(props.percent)
    ));

    const normal = computed(() => (
      type.value === BorrowLimitTypes.normal
    ));

    const warning = computed(() => (
      type.value === BorrowLimitTypes.warning
    ));

    const danger = computed(() => (
      type.value === BorrowLimitTypes.danger
    ));

    const critical = computed(() => (
      type.value === BorrowLimitTypes.critical
    ));

    return {
      type,
      normal,
      warning,
      danger,
      critical,
    };
  },
});
</script>
