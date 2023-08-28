<template>
  <UnLayoutDefault
    class="view-pool-add-liquidity"
    with-grass
    with-whale
    check-connect
    check-network
    is-content-575
  >
    <template #title>
      <UnPoolTitle
        :to="to"
        :text="tokenId ? 'Add more Liquidity' : 'Add Liquidity Position'"
        class="view-pool-add-liquidity__header"
      />
    </template>

    <template v-if="tokenId && !position">
      {{ tokenId }} does not exist
    </template>

    <PoolAddLiquidityMainCard
      v-else-if="!isLoadingConnect"
      :token-id-a="tokenIdA"
      :token-id-b="tokenIdB"
      :fee="fee"
      :position="position"
      class="view-pool-add-liquidity__card"
      @update:token-id-a="onUpdateTokenA"
      @update:token-id-b="onUpdateTokenB"
    />
  </UnLayoutDefault>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useCore, useGlobalLoader } from '@/store';

import { Position } from '@/types/common.d';
import {
  POOL_SUPPORTED_TOKEN_A_LIST,
  POOL_SUPPORTED_TOKEN_B_LIST,
  POOL_SUPPORTED_FEES,
  POOL_SUPPORTED_TOKEN_MAP,
} from '@/helpers/enums/pools';
import { ROUTE_POOL, ROUTE_POOL_POSITION } from '@/helpers/enums/routes';

import UnLayoutDefault from '@/components/layouts/UnLayoutDefault.vue';
import UnPoolTitle from '@/components/common/poolCommon/UnPoolTitle.vue';

import PoolAddLiquidityMainCard from './components/PoolAddLiquidityMainCard.vue';


export default defineComponent({
  name: 'ViewPoolAddLiquidity',
  components: {
    UnLayoutDefault,
    UnPoolTitle,
    PoolAddLiquidityMainCard,
  },
  inheritAttrs: false,
  props: {
    tokenId: {
      type: String,
    },
    tokenIdA: {
      type: String,
      required: true,
      validator: (prop: string) => (
        POOL_SUPPORTED_TOKEN_A_LIST.includes(prop)
      ),
    },
    tokenIdB: {
      type: String,
      required: true,
      validator: (prop: string) => (
        POOL_SUPPORTED_TOKEN_B_LIST.includes(prop)
      ),
    },
    fee: {
      type: Number as PropType<typeof POOL_SUPPORTED_FEES[number]>,
      required: true,
      validator: (prop: typeof POOL_SUPPORTED_FEES[number]) => (
        POOL_SUPPORTED_FEES.includes(prop)
      ),
    },
    position: {
      type: Object as PropType<Position>,
    },
  },
  setup(props) {
    const { isLoadingConnect } = useCore();
    const router = useRouter();
    const globalLoader = useGlobalLoader();

    const createOnUpdateToken = (name: string) => (
      (key: keyof typeof POOL_SUPPORTED_TOKEN_MAP) => {
        const { fee } = POOL_SUPPORTED_TOKEN_MAP[key];
        const params = { [name]: key, fee };
        void router.push({ params });
      });

    globalLoader.toggle(isLoadingConnect.value);

    const to = props.position ? {
      name: ROUTE_POOL_POSITION,
      params: {
        tokenId: props.position.tokenId,
      },
    } : {
      name: ROUTE_POOL,
    };

    return {
      to,
      isLoadingConnect,
      onUpdateTokenA: createOnUpdateToken('tokenIdA'),
      onUpdateTokenB: createOnUpdateToken('tokenIdB'),
    };
  },
});
</script>

<style lang="scss">
.view-pool-add-liquidity {
  color: #fff;

  &__header {
    margin-bottom: 23px;

    @include media-gt(tablet) {
      margin-bottom: 9px;
    }
  }
}
</style>
