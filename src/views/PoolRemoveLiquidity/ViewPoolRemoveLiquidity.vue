<template>
  <UnLayoutDefault
    v-if="!isLoading"
    class="view-pool-remove-liquidity"
    with-grass
    with-whale
    is-content-575
    check-connect
    check-network
  >
    <template #title>
      <UnPoolTitle
        :to="to"
        text="Remove Liquidity"
        class="view-pool-remove-liquidity__title"
      />
    </template>

    <template v-if="!position">
      {{ tokenId }} does not exist
    </template>

    <PoolRemoveLiquidityMainCard
      v-else
      :position="position"
      class="view-pool-remove-liquidity__main-card"
    />
  </UnLayoutDefault>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount } from 'vue';
import { useCore, useGlobalLoader } from '@/store';
import { ROUTE_POOL_POSITION, ROUTE_POOL } from '@/helpers/enums/routes';

import UnLayoutDefault from '@/components/layouts/UnLayoutDefault.vue';
import UnPoolTitle from '@/components/common/poolCommon/UnPoolTitle.vue';

import PoolRemoveLiquidityMainCard from './components/PoolRemoveLiquidityMainCard.vue';


const UPDATE_POSITION_TIMEOUT = 60_000;

export default defineComponent({
  name: 'ViewPoolRemoveLiquidity',
  components: {
    UnLayoutDefault,
    UnPoolTitle,
    PoolRemoveLiquidityMainCard,
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

    const to = computed(() => (
      position.value ? {
        name: ROUTE_POOL_POSITION,
        params: {
          tokenId: props.tokenId,
        },
      } : {
        name: ROUTE_POOL,
      }
    ));

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
      position,
      to,
    };
  },
});
</script>

<style lang="scss">
.view-pool-remove-liquidity {
  color: #fff;
}
</style>
