<template>
  <UnLayoutDefault
    :key="tokenId"
    class="view-pool-position"
    with-grass
    with-whale
    is-content-575
    check-connect
    check-network
  >
    <PoolPositionBackLink
      class="view-pool-position__back-link"
    />

    <template v-if="!position">
      {{ tokenId }} does not exist
    </template>

    <template v-else>
      <PoolPositionHeader
        :position="position"
        class="view-pool-position__header"
      />

      <PoolPositionLiquidity
        :position="position"
        class="view-pool-position__liquidity"
      />

      <PoolPositionUnclaimedFees
        :position="position"
        class="view-pool-position__unclaimed-fees"
      />

      <PoolPositionPriceRange
        :position="position"
        class="view-pool-position__price-range"
      />
    </template>
  </UnLayoutDefault>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount } from 'vue';
import { useCore, useGlobalLoader } from '@/store';

import UnLayoutDefault from '@/components/layouts/UnLayoutDefault.vue';

import PoolPositionBackLink from './components/PoolPositionBackLink.vue';
import PoolPositionHeader from './components/PoolPositionHeader.vue';
import PoolPositionPriceRange from './components/PoolPositionPriceRange.vue';
import PoolPositionLiquidity from './components/PoolPositionLiquidity.vue';
import PoolPositionUnclaimedFees from './components/PoolPositionUnclaimedFees.vue';


const UPDATE_POSITION_TIMEOUT = 60_000;

export default defineComponent({
  name: 'ViewPoolPosition',
  components: {
    UnLayoutDefault,
    PoolPositionBackLink,
    PoolPositionHeader,
    PoolPositionPriceRange,
    PoolPositionLiquidity,
    PoolPositionUnclaimedFees,
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

    const intervalId = setInterval(() => {
      void position.value?.update();
    }, UPDATE_POSITION_TIMEOUT);

    globalLoader.toggle(!position.value && isSupportedNetwork.value);

    if (!position.value) {
      void account.value?.updateAllPositions()
        .finally(() => { globalLoader.hide(); });
    }

    onBeforeUnmount(() => {
      clearInterval(intervalId);
    });

    return {
      position,
    };
  },
});
</script>

<style lang="scss">
.view-pool-position {
  color: #fff;

  &.center {
    text-align: center;
  }

  &__back-link {
    margin-bottom: 19px;

    @include media-gt(tablet) {
      margin-bottom: 16px;
    }
  }

  &__header {
    margin-bottom: 22px;

    @include media-gt(tablet) {
      margin-bottom: 20px;
    }
  }

  &__liquidity {
    margin-bottom: 16px;
  }

  &__unclaimed-fees {
    margin-bottom: 16px;
  }
}
</style>
