<template>
  <div
    class="un-header-help"
    @click="onHelp"
  >
    Help
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useModalHelp } from '@/components/modals/modals';


export default defineComponent({
  name: 'UnHeaderHelp',
  setup() {
    const modalHelp = useModalHelp();

    const onHelp = () => {
      void modalHelp.show({});
    };

    return {
      onHelp,
    };
  },
});
</script>

<style lang="scss">
.un-header-help {
  font-size: 12px;
  color: #7c8297;
  cursor: pointer;

  &:hover {
    color: white;
  }
}
</style>
