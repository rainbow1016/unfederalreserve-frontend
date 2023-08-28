<template>
  <UnHeaderCard
    class="un-header-account"
    :clickable="clickable"
    :class="{ 'is-connected': connected }"
    @click="onAccount"
  >
    <slot>
      <div
        v-if="txPendingHistory.length > 0"
        class="un-header-account__pending"
      >
        <div>{{ txPendingHistory.length }} pending</div>
        <UnLoaderCircle
          small
          light
          class="un-header-account__loader"
        />
      </div>

      <div v-else class="un-header-account__main">
        <div class="un-header-account__wrapper-wallet" data-testid="account-wallet">
          <img
            :class="{ 'is-selected': isSelectedEthAccount }"
            class="un-header-account__wallet-icon"
            :src="walletLogo"
          >
          <span>{{ address }}</span>
        </div>

        <UnTooltip
          content-text="Disconnect wallet"
          content-min-width="160px"
          class="un-header-account__close-tooltip"
        >
          <template #activator>
            <div class="un-header-account__close-icon-wrap" @click.stop="onDisconnect">
              <img
                v-svg-inline
                class="un-header-account__close-icon"
                data-testid="disconnect-wallet"
                :src="require('@/assets/images/icons/disconnect-wallet2.svg')"
              >
            </div>
          </template>
        </UnTooltip>
      </div>
    </slot>
  </UnHeaderCard>
</template>

<script lang="ts">
// eslint-disable-next-line object-curly-newline
import { PropType, defineComponent, computed, toRef } from 'vue';

import { Wallet } from '@/types/common.d';
import { shortenToken } from '@/helpers/shortenToken';
import { useDisconnectModal, useAccountModal } from '@/components/modals/modals';

import UnLoaderCircle from '@/components/ui/UnLoaderCircle.vue';
import UnTooltip from '@/components/ui/UnTooltip.vue';

import UnHeaderCard from './UnHeaderCard.vue';


export default defineComponent({
  name: 'UnHeaderAccount',
  components: {
    UnLoaderCircle,
    UnTooltip,
    UnHeaderCard,
  },
  props: {
    clickable: Boolean,
    connected: {
      type: Boolean,
      required: true,
    },
    wallet: {
      type: Object as PropType<Wallet>,
      required: true,
    },
  },
  setup(props) {
    const disconnectModal = useDisconnectModal();
    const accountModal = useAccountModal();

    const txPendingHistory = toRef(props.wallet, 'txPendingHistory');

    const address = computed(() => (
      shortenToken(props.wallet.ethAccount)
    ));

    const walletLogo = computed(() => {
      const settings = props.wallet.current_provider_settings;
      return settings ? settings.logo : '';
    });

    const isSelectedEthAccount = computed(() => (
      props.wallet.isSelectedEthAccount
    ));

    const onDisconnect = () => {
      void disconnectModal.show(props);
    };

    const onAccount = () => {
      void accountModal.show(props);
    };

    return {
      isSelectedEthAccount,
      walletLogo,
      address,
      txPendingHistory,
      onDisconnect,
      onAccount,
    };
  },
});
</script>

<style lang="scss">
.un-header-account {
  &__main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
  }

  &__close-tooltip {
    width: 30px;
    height: 100%;

    @include media-lt(tablet) {
      display: none;
    }
  }

  &__close-icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 100%;
    cursor: pointer;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;

    &:hover {
      background-color: #2c4aa9;
    }
  }

  &__close-icon {
    width: 16px;
    height: 16px;
    color: #fff;
  }

  &__wallet-icon {
    width: 14px;
    height: 14px;
    margin-right: 8px;
  }

  &__wrapper-wallet {
    display: flex;
    align-items: center;
    padding-left: 10px;

    &:hover {
      background: #4065d8;
    }

    @include media-lt(tablet) {
      padding: 0 10px;
      font-size: 12px;
    }
  }

  &__pending {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 134px;
    height: 100%;
    padding: 0 18px;
    background: $un-color-blue-8;
    border-radius: 8px;
    box-shadow:
      10px 10px 20px rgba(31, 63, 174, 0.02),
      13px 2px 6px rgba(31, 63, 174, 0.02),
      7px 0 50px rgba(31, 63, 174, 0.02);
  }
}
</style>
