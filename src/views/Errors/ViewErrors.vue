<template>
  <Errors404
    v-if="error_code === 404"
    :full-path="fullPath"
  />

  <ErrorsCommon
    v-else
    :error_code="error_code"
    :full-path="fullPath"
  >
    <template #description>
      The server has beed deserted for a while
      <br> Please be patient or try again later
    </template>
  </ErrorsCommon>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, PropType } from 'vue';
import { useGlobalLoader } from '@/store';


const Errors404 = defineAsyncComponent(() => import(
  /* webpackChunkName: "Errors404" */
  './components/Errors404.vue'
));

const ErrorsCommon = defineAsyncComponent(() => import(
  /* webpackChunkName: "Errors404" */
  './components/ErrorsCommon.vue'
));

export default defineComponent({
  name: 'ViewError',
  components: {
    Errors404,
    ErrorsCommon,
  },
  props: {
    error_code: {
      type: Number,
      default: 500,
    },
    fullPath: {
      type: String,
    },
    path_match: {
      type: Array as PropType<string[]>,
    },
  },
  setup: () => {
    useGlobalLoader().hide();
  },
});
</script>
