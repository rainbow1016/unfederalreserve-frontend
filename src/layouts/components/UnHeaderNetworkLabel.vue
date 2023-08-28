<template>
  <div
    :style="styles"
    class="un-header-network-label"
    v-html="label"
  />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useCore } from '@/store';
import { NETWORK_SHORT_NAME_MAP as NETWORKS_MAP } from '@/helpers/enums/params';


export default defineComponent({
  name: 'UnHeaderNetworkLabel',
  setup() {
    const { appEnv, appChainId } = useCore();

    const label = computed(() => {
      const networkName = (
        NETWORKS_MAP[appChainId.value as keyof typeof NETWORKS_MAP]
        || (appChainId.value ? `<b>${appChainId.value as unknown as string}</b>` : '🙈')
      );

      return [
        process.env.VUE_APP_ENV,
        networkName,
      ].filter(Boolean).join(' | ');
    });

    const styles = computed(() => ({
      backgroundColor: appEnv.value?.NETWORK_COLOR,
    }));

    return {
      label,
      styles,
    };
  },
});
</script>

<style lang="scss">
.un-header-network-label {
  position: absolute;
  top: 0;
  left: 18px;
  z-index: 2;
  padding: 4px 8px;
  font-size: 11px;
  color: white;
  background-color: $un-color-critical;
}
</style>
