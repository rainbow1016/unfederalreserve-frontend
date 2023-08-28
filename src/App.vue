<template>
  <!-- eslint-disable vue/no-multiple-template-root -->

  <transition name="transition--fade-out">
    <UnLoader v-if="!isReady || isLoadingGlobal" />
  </transition>

  <UnBannerNotification />

  <UnAppLayoutDefault
    v-if="isReady"
    :key="key"
  />

  <notifications position="top right" group="transaction">
    <template #body="props">
      <UnNotification
        v-bind="props.item"
        :duration="props.item.data.duration"
        @close="props.close"
      />
    </template>
  </notifications>
</template>

<script lang="ts">
import {
  computed,
  defineAsyncComponent,
  defineComponent,
  onBeforeUnmount,
  ref,
  watch,
} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { env as ENVS } from '@/global';
import { useCore, useGlobalLoader, useGasPrice } from '@/store';
import {
  ROUTE_DASHBOARD, ROUTE_LEND, ROUTE_POOL, ROUTE_ERROR_404,
} from '@/helpers/enums/routes';
import { useModalConnectWallet } from '@/components/modals';
import { useModalTerms } from '@/components/modals/modals';

import UnLoader from '@/components/common/UnLoader.vue';
import UnBannerNotification from '@/components/common/UnBannerNotification.vue';
import UnAppLayoutDefault from '@/layouts/UnAppLayoutDefault.vue';


const UnNotification = defineAsyncComponent(() => import(
  '@/components/common/UnNotification.vue'
));

const OPEN_CONNECTION_ONSTART_ROUTES = [
  ROUTE_DASHBOARD,
  ROUTE_LEND,
  ROUTE_POOL,
];

const GET_GAS_TIMEOUT = 60_000;

const options = defineComponent({
  name: 'App',
  components: {
    UnAppLayoutDefault,
    UnNotification,
    UnLoader,
    UnBannerNotification,
  },
  setup: () => {
    const {
      wallet,
      appChainId,
      isAnyConnected,
      isLoadingConnect,
    } = useCore();
    const { fetchData: fetchGasPrice } = useGasPrice();
    const router = useRouter();
    const route = useRoute();
    const globalLoader = useGlobalLoader();
    const modalConnectWallet = useModalConnectWallet();
    const modalTerms = useModalTerms();
    const isReady = ref(false);

    globalLoader.toggle(isAnyConnected.value);

    void fetchGasPrice(ENVS.mainnet);
    const intervalId = setInterval(() => {
      void fetchGasPrice(ENVS.mainnet);
    }, GET_GAS_TIMEOUT);

    const key = computed(() => {
      const {
        ethAccount,
        current_provider_settings,
        chainId,
        // isLoadingConnect,
      } = wallet.value;

      // if (isLoadingConnect) return '';
      if (!isAnyConnected.value) return appChainId.value;

      const values = [
        current_provider_settings?.name,
        chainId,
        ethAccount,
        isLoadingConnect.value.toString(),
      ].filter(Boolean);

      return values.length === 4 ? values.join('-') : '';
    });

    void router.isReady().then(() => {
      isReady.value = true;
      if (isAnyConnected.value) {
        const { ethAccount } = wallet.value;
        if (route.name !== ROUTE_ERROR_404) void modalTerms.show({ ethAccount });
      }
      if (isAnyConnected.value) return null;
      const name = router.currentRoute.value.name?.toString();
      const isNeedConnect = name && OPEN_CONNECTION_ONSTART_ROUTES.includes(name);
      if (!isNeedConnect) return null;
      return modalConnectWallet.show({ wallet: wallet.value });
    });

    watch(() => wallet.value.ethAccount, (ethAccount) => {
      void modalTerms.hide();
      if (!ethAccount || !isAnyConnected.value) return;
      void modalTerms.show({ ethAccount });
    });

    watch(() => route.name, (newValue, oldValue) => {
      if (isAnyConnected.value) {
        const { ethAccount } = wallet.value;
        if (oldValue === ROUTE_ERROR_404) void modalTerms.show({ ethAccount });
      }
    });

    onBeforeUnmount(() => {
      clearInterval(intervalId);
    });

    return {
      isReady,
      key,
      wallet,
      isLoadingGlobal: globalLoader.isLoading,
    };
  },
});

export default options;
</script>

<style lang="scss">

@media (max-height: 680px) {
  .walletconnect-connect__buttons__wrapper {
    max-height: 100% !important;
  }

  .walletconnect-qrcode__base {
    overflow: auto;
  }

  .walletconnect-modal__base {
    top: 20px !important;
    transform: none !important;
  }
}
</style>
