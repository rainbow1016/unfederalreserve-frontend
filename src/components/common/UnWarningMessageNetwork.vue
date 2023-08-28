<template>
  <UnWarningMessage>
    <template #title>
      <div class="un-warning-message-network__title">
        We've detected that your wallet's network is
        <span class="un-font-bolder">
          {{ currentNetwork }}
        </span>
      </div>
    </template>

    <template #image>
      <span
        class="un-warning-message-network__icon"
        v-html="require('!raw-loader!@/assets/images/icons/network.svg').default"
      />
    </template>

    <template #description>
      <div class="un-warning-message-network__description">
        Please switch your wallet to
        <!-- eslint-disable-next-line vue/no-lone-template -->
        <span v-html="supportedNetworks" />
        to continue using ReserveLending
      </div>
    </template>
  </UnWarningMessage>
</template>

<script lang="ts">
import { PropType, defineComponent, computed } from 'vue';
import { SUPPORTED_NETWORK_CHAIN_ID } from '@/classes/Wallet';
import { NETWORK_NAME_MAP as NETWORKS_MAP } from '@/helpers/enums/params';

import UnWarningMessage from './UnWarningMessage.vue';


const SUPPORTED_NETWORKS = (SUPPORTED_NETWORK_CHAIN_ID as unknown as Array<keyof typeof NETWORKS_MAP>)
  .map((id: keyof typeof NETWORKS_MAP) => NETWORKS_MAP[id])
  .filter(Boolean)
  .filter((_) => !_.includes('Private'))
  .map((id) => (`<span class="un-font-bolder">${id as string}</span>`))
  .join(' or ');

export default defineComponent({
  name: 'UnWarningMessageNetwork',
  components: {
    UnWarningMessage,
  },
  props: {
    chainId: {
      type: [Number, null] as PropType<keyof typeof NETWORKS_MAP>,
      required: true,
    },
  },
  setup: (props) => {
    const currentNetwork = computed(() => (
      NETWORKS_MAP[props.chainId]
      || NETWORKS_MAP.DEFAULT
    ));

    return {
      supportedNetworks: SUPPORTED_NETWORKS,
      currentNetwork,
    };
  },
});
</script>

<style lang="scss">
.un-warning-message-network {
  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 76px;
    height: 76px;
    margin: 0 auto;
    background-color: #4f76ff;
    border-radius: 100px;
  }

  &__title {
    margin-bottom: 38px;

    @include media-gt(tablet) {
      margin-bottom: 25px;
    }
  }

  &__description {
    margin-top: 28px;

    @include media-gt(tablet) {
      margin-top: 10px;
    }
  }
}
</style>
