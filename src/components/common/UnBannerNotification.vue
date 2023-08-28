<template>
  <!-- eslint-disable vue/no-multiple-template-root -->
  <UnBanner
    v-if="errorMessage"
    v-model="errorMessage.show"
    class="un-banner-notification"
    :text="errorMessage.text"
  />

  <!--
  <UnBanner
    is-blue
    is-more-info
    is-update-agents
    class="un-banner-notification"
  >
    Please be advised in accordance with our newly launched policy,
    adjustments will be made to the APY model for stablecoins. You may notice
    a change in rates as a result.
  </UnBanner>
  -->

  <UnBanner
    v-if="!isSelectedEthAccount"
    is-blue
    class="un-banner-notification"
    text="To make transactions, please, switch to the account as in your wallet"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  reactive,
  ref,
  watch,
  onBeforeUnmount,
  onMounted,
} from 'vue';
import uniqBy from 'lodash/uniqBy';
import { useCore, useGasPrice } from '@/store';
import { checkGas } from '@/services/checkGas';
import { ethSyncing, IEthSync } from '@/services/ethSyncing';

import UnBanner from '@/components/common/UnBanner.vue';


const CHECK_TIMEOUT = 60_000;
const GAS_ESTIMATE_LIMIT = 140;
const BLOCKCHAIN_CONGESTED_TIME = 5 * 60; // in seconds

const enum ErrorMessageTypes {
  out_of_current_block,
  not_enough_gas_eth,
  blockchain_overloaded,
  blockchain_congested,
}

const ERROR_MESSAGE_LIST = {
  [ErrorMessageTypes.out_of_current_block]: (p: IEthSync) => `
    The data on this site has only synced to Ethereum block
    ${p.currentBlock} (out of ${p.highestBlock}).
    Please check back soon.
  `,
  [ErrorMessageTypes.not_enough_gas_eth]: () => `
    Your ETH Balance maybe not be enough to pay for the Gas fee.
    Please make sure you can cover the Gas fee by ETH before creating the transactions.
  `,
  [ErrorMessageTypes.blockchain_overloaded]: () => `
    The Ethereum blockchain is currently congested, affecting the transactions fee.
    We kindly ask you to retry your request after some time.
  `,
  [ErrorMessageTypes.blockchain_congested]: () => `
    The Ethereum blockchain is currently congested, affecting the transactions fee.
    We kindly ask you to retry your request after some time.
  `,
};

const createErrorData = (value: boolean, message = '') => ({
  show: value && !!message,
  value,
  text: message,
});

export default defineComponent({
  name: 'UnBannerNotification',
  components: {
    UnBanner,
  },
  setup() {
    const { wallet, account, appEnv } = useCore();
    const { data: gasEstimate } = useGasPrice();

    const errorsMap = reactive({
      [ErrorMessageTypes.out_of_current_block]: createErrorData(false),
      [ErrorMessageTypes.blockchain_congested]: createErrorData(false),
      [ErrorMessageTypes.not_enough_gas_eth]: createErrorData(false),
      [ErrorMessageTypes.blockchain_overloaded]: createErrorData(false),
    });

    const errorMessages = ref<ReturnType<typeof createErrorData>[]>([]);

    const errorMessage = computed(() => (
      errorMessages.value.find((_) => _.show)
    ));

    const isSelectedEthAccount = computed(() => (
      wallet.value.isSelectedEthAccount
    ));

    const updateErrorData = (
      value: boolean,
      key: ErrorMessageTypes,
      data?: IEthSync,
    ) => {
      const isEqual = value === errorsMap[key].value;
      if (isEqual) return;

      // eslint-disable-next-line no-nested-ternary
      const message = key === ErrorMessageTypes.out_of_current_block
        ? data ? ERROR_MESSAGE_LIST[key](data) : ''
        : ERROR_MESSAGE_LIST[key]();

      errorsMap[key] = createErrorData(value, message);

      const list = Object.values(errorsMap).filter((_) => _.show);
      errorMessages.value = uniqBy(list, 'text');
    };

    const onCheckSyncing = async () => {
      const { syncing, block } = await ethSyncing(appEnv.value);

      const key1 = ErrorMessageTypes.out_of_current_block;
      if (typeof syncing === 'object') {
        updateErrorData(true, key1, syncing);
      } else {
        updateErrorData(false, key1);
      }

      const key2 = ErrorMessageTypes.blockchain_congested;
      if (block) {
        const value = Date.now() / 1000 - block.timestamp > BLOCKCHAIN_CONGESTED_TIME;
        updateErrorData(value, key2);
      } else {
        updateErrorData(false, key2);
      }
    };

    const onCheckNoEnoughGasETH = async () => {
      const key = ErrorMessageTypes.not_enough_gas_eth;

      if (!account.value) {
        updateErrorData(false, key);
      } else {
        const result = (await checkGas(account.value));
        updateErrorData(!result, key);
      }
    };

    watch(gasEstimate, (value) => {
      const key = ErrorMessageTypes.blockchain_overloaded;
      const result = !!(value && value.average / 10 > GAS_ESTIMATE_LIMIT);
      updateErrorData(result, key);
    });

    watch(account, () => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      void onCheck();
    });

    const onCheck = () => {
      void onCheckSyncing();
      void onCheckNoEnoughGasETH();
    };

    let interval: ReturnType<typeof setInterval>;
    onMounted(() => {
      void onCheck();
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      interval = setInterval(onCheck, CHECK_TIMEOUT);
    });

    onBeforeUnmount(() => {
      clearInterval(interval);
    });

    return {
      isSelectedEthAccount,

      errorsMap,
      errorMessages,
      errorMessage,
    };
  },
});
</script>

<style lang="scss">
.un-banner-notification {
  position: relative;
  z-index: 9;
}
</style>
