<template>
  <UnModalLayout
    :title="title"
    :subtitle="subtitle"
    class="un-modal-connect-wallet"
    @close="$emit('close')"
  >
    <template #prepend-header>
      <UnModalConnectWalletBack
        v-if="isAnyConnected"
        class="un-modal-connect-wallet__back"
        @click="onBack"
      />
    </template>

    <div class="un-modal-connect-wallet__btn-container">
      <template v-for="item in buttonList" :key="item.id">
        <a
          :class="{
            'is-disabled': item.disabled,
            'is-active': item.active,
          }"
          class="un-modal-connect-wallet__btn"
          :href="`#${item.id}`"
          @click.prevent="onConnect(item)"
        >
          <img
            v-if="item.logo"
            :src="item.logo"
            class="un-modal-connect-wallet__logo"
          >
          <div>
            <h4 class="un-modal-connect-wallet__btn-title" :data-testid="item.label">
              {{ item.label }}
            </h4>
            <p class="un-modal-connect-wallet__btn-description">
              {{ item.description }}
            </p>
          </div>
        </a>
      </template>
    </div>

    <p class="un-modal-connect-wallet__info is-terms-info">
      By connecting, I accept
      <router-link
        :to="toTerms"
        target="_blank"
        class="un-modal-connect-wallet__terms-link"
        v-text="`unFederalReserve's Terms of Service`"
      />
    </p>

    <template #footer>
      <p
        v-if="isAnyConnected"
        class="un-modal-connect-wallet__footer-disconnect"
        @click="onDisconnect"
        v-text="'Disconnect Wallet'"
      />
      <p
        class="un-modal-connect-wallet__info"
        v-text="`Don't see your wallet provider? We are working on adding more`"
      />
    </template>
  </UnModalLayout>
</template>

<script lang="ts">
// eslint-disable-next-line object-curly-newline
import { PropType, defineComponent, computed, watch } from 'vue';
import { ROUTE_STATIC_TERMS } from '@/helpers/enums/routes';
import { Wallet } from '@/types/common.d';
import { useAccountModal } from './modals';

import UnModalLayout from './UnModalLayout.vue';
import UnModalConnectWalletBack from './components/UnModalConnectWalletBack.vue';


export default defineComponent({
  name: 'UnModalConnectWallet',
  components: {
    UnModalLayout,
    UnModalConnectWalletBack,
  },
  props: {
    wallet: {
      type: Object as PropType<Wallet>,
      required: true,
    },
  },
  emits: ['close'], // close modal
  setup(props, ctx) {
    const accountModal = useAccountModal();
    // eslint-disable-next-line vue/no-setup-props-destructure
    const { wallet } = props;
    const { isAnyConnected } = wallet;

    const title = isAnyConnected
      ? 'Switch Wallet'
      : 'Connect Wallet';

    const subtitle = isAnyConnected
      ? ' and continue using unFederalReserve'
      : ' to start using unFederalReserve';

    const toTerms = { name: ROUTE_STATIC_TERMS };

    const buttonList = computed(() => {
      const settings = props.wallet.supported_providers;
      const current = props.wallet.current_provider_settings?.name;
      const { isMetaMaskInjected, isMetaMaskUnlocked } = props.wallet;

      return [
        {
          id: 'MetaMask',
          label: 'MetaMask',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, global-require
          logo: settings.MetaMask?.logo || require('@/assets/images/icons/metamask.svg'),
          description: isMetaMaskInjected
            ? 'Connect to your MetaMask Wallet'
            : 'Please install wallet plugin first',
          disabled: !isMetaMaskInjected,
          active: current === 'MetaMask' && isMetaMaskUnlocked,
        },
        {
          id: 'WalletConnect',
          label: 'WalletConnect',
          logo: settings.WalletConnect?.logo,
          description: 'Scan with WalletConnect to connect',
          active: current === 'WalletConnect',
        },
        {
          id: 'Coinbase',
          label: 'Coinbase',
          logo: settings.Coinbase?.logo,
          description: 'Scan with Coinbase to connect',
          active: current === 'Coinbase',
        },
      ] as const;
    });

    const onConnect = (data: typeof buttonList.value[number]) => {
      void props.wallet.connectTo(data.id);
    };

    const onDisconnect = () => {
      const promise = props.wallet.disconnect();
      ctx.emit('close', promise);
    };

    const onBack = () => {
      const promise = accountModal.show(props);
      ctx.emit('close', promise);
    };

    watch(() => wallet.isLoadingConnect, (value) => {
      if (value) ctx.emit('close');
    });

    return {
      title,
      subtitle,
      isAnyConnected,
      toTerms,
      buttonList,

      onConnect,
      onDisconnect,
      onBack,
    };
  },
});
</script>

<style lang="scss">
.un-modal-connect-wallet {
  $root: &;

  line-height: 26px;

  &__logo {
    width: 45px;
    height: 45px;
    margin-right: 27px;

    @include media-lte(tablet) {
      width: 35px;
      height: 35px;
    }
  }

  &__btn {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 20px 30px 18px 30px;
    color: white;
    text-decoration: none;
    cursor: pointer;
    border: 2px solid #213983;
    border-radius: 12px;

    &:not(:last-child) {
      margin-bottom: 8px;
    }

    &.is-active {
      pointer-events: none;
      background: linear-gradient(90deg, #183386 2.84%, #142b71 100%);
    }

    &.is-disabled {
      color: $un-color-gray;
      pointer-events: none;
      background: linear-gradient(90deg, #183386 2.84%, #142b71 100%);
      filter: grayscale(20%);

      #{$root}__logo {
        filter: grayscale(100%);
      }
    }

    &:hover {
      background: linear-gradient(90deg, #183386 2.84%, #142b71 100%);
    }

    &-title {
      font-size: 18px;
      font-weight: 700;
    }

    &-description {
      margin-bottom: 0;
      font-size: 12px;
      font-weight: 400;
      line-height: 22px;
    }
  }

  &__info {
    margin-bottom: 0;
    font-size: 13px;
    font-weight: 500;
    color: #798dca;
    text-align: center;

    @include media-lte(tablet) {
      margin: 0 auto 20px;
      line-height: 19px;
    }

    &.is-terms-info {
      margin-top: 23px;
      font-size: 12px;
    }
  }

  &__terms-link {
    color: $un-color-normal;

    &:hover {
      opacity: 0.8;
    }

    @include media-lte(tablet) {
      display: block;
    }
  }

  &__footer-disconnect {
    margin-bottom: 13px;
    font-size: 16px;
    font-weight: 600;
    color: white;
    text-align: center;
    text-decoration: underline;
    cursor: pointer;
  }

  &__back {
    position: absolute;
    left: 30px;

    @include media-lte(tablet) {
      left: 15px;
    }
  }
}
</style>
