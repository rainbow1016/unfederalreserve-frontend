<template>
  <ViewPoolAddLiquidity
    v-if="!isLoading"
    v-bind="tokensData"
    :position="position"
    :token-id="tokenId"
  />
</template>


<script lang="ts">
import { computed, defineComponent, onBeforeUnmount } from 'vue';
import { useCore, useGlobalLoader } from '@/store';

import ViewPoolAddLiquidity from './ViewPoolAddLiquidity.vue';


const UPDATE_POSITION_TIMEOUT = 30_000;

export default defineComponent({
  name: 'ViewPoolIncreaseLiquidity',
  components: {
    ViewPoolAddLiquidity,
  },
  props: {
    tokenId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { account, isSupportedNetwork } = useCore();
    const globalLoader = useGlobalLoader();

    const position = computed(() => (
      account.value?.positions.find((_) => (
        _.tokenId === props.tokenId
      ))
    ));

    const tokensData = computed(() => {
      // eslint-disable-next-line object-curly-newline
      const { quote, base, positionData } = position.value || {};
      const fee = positionData?.fee;
      let tokenIdA = quote?.symbol?.replace('WETH', 'ETH');
      let tokenIdB = base?.symbol?.replace('WETH', 'ETH');

      if (tokenIdB === 'eRSDL') {
        tokenIdB = tokenIdA;
        tokenIdA = 'eRSDL';
      }

      return { tokenIdA, tokenIdB, fee };
    });

    globalLoader.toggle(!position.value && isSupportedNetwork.value);

    if (!position.value) {
      void account.value?.updateAllPositions()
        .finally(() => { globalLoader.hide(); });
    }

    const intervalId = setInterval(() => {
      void position.value?.update();
    }, UPDATE_POSITION_TIMEOUT);

    onBeforeUnmount(() => {
      clearInterval(intervalId);
    });

    return {
      isLoading: globalLoader.isLoading,
      tokensData,
      position,
    };
  },
});
</script>
