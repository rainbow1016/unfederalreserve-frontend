<template>
  <UnWarningMessage v-once>
    <template #title>
      <div class="un-warning-message-connect__title">
        <div
          class="un-warning-message-connect__icon"
          v-html="require('!raw-loader!@/assets/images/icons/connect.svg').default"
        />
        Please connect a wallet
      </div>
    </template>

    <template #description>
      <div class="un-warning-message-connect__description">
        We are unable to show you any data until you connect your wallet

        <UnBtn
          class="un-warning-message-connect__btn"
          data-testid="unlock-wallet"
          square
          font-size="16px"
          :uppercase="false"
          @click="onConnect"
          v-text="'Connect Wallet'"
        />
      </div>
    </template>
  </UnWarningMessage>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import { useCore } from '@/store';
import { useModalConnectWallet } from '@/components/modals';

import UnWarningMessage from './UnWarningMessage.vue';
import UnBtn from '@/components/ui/UnBtn.vue';


export default defineComponent({
  name: 'UnWarningMessageConnect',
  components: {
    UnWarningMessage,
    UnBtn,
  },
  setup() {
    const { wallet } = useCore();
    const modalConnectWallet = useModalConnectWallet();

    const onConnect = () => {
      void modalConnectWallet.show({ wallet: wallet.value });
    };

    return {
      onConnect,
    };
  },
});
</script>

<style lang="scss">
.un-warning-message-connect {
  &__icon {
    margin-bottom: 15px;
  }

  &__btn {
    display: block;
    max-width: 178px;
    margin: 29px auto 0;
  }

  &__title {
    margin-bottom: 5px;
  }
}
</style>
