<template>
  <div class="un-header">
    <div class="un-header__logo-menu-wrap">
      <UnLogo class="un-header-logo" />
      <UnHeaderMenuNav class="un-header-menu" />
    </div>

    <div class="un-header-wallet">
      <UnHeaderTokenPrice
        :account="account"
        class="un-header-wallet__token-price"
      />

      <UnHeaderGas
        class="un-header-wallet__gas"
      />

      <UnHeaderTokenHolder
        v-if="withStar"
        class="un-header-wallet__token-holder"
      />
      <UnHeaderUniswap
        v-else
        clickable
        class="un-header-wallet__uniswap"
      />

      <UnHeaderBalance
        :wallet="wallet"
        :account="account"
        :clickable="isAnyConnected"
        class="un-header-wallet__balance"
      />

      <UnHeaderAccount
        v-if="isAnyConnected"
        :connected="isAnyConnected"
        :wallet="wallet"
        :account="account"
        clickable
        class="un-header-wallet__account"
      />

      <UnBtn
        v-if="!isAnyConnected"
        class="un-header-btns__connect"
        data-testid="unlock-wallet"
        square
        font-size="13px"
        :uppercase="false"
        @click="onConnect"
        v-text="'Connect Wallet'"
      />
    </div>

    <UnMobileMenu
      v-model="isMobileMenuOpen"
      :connected="isAnyConnected"
      :account="account"
      :wallet="wallet"
    />
  </div>
</template>

<script lang="ts">
import {
  defineAsyncComponent,
  defineComponent,
  ref,
  watch,
  computed,
} from 'vue';
import { useRouter } from 'vue-router';
import { useCore } from '@/store';
import { useModalConnectWallet } from '@/components/modals';

import UnLogo from '@/components/common/UnLogo.vue';
import UnMobileMenu from './UnMobileMenu.vue';

import UnHeaderMenuNav from './UnHeaderMenuNav.vue';

import UnHeaderTokenHolder from './UnHeaderTokenHolder.vue';
import UnHeaderUniswap from './UnHeaderUniswap.vue';
import UnHeaderTokenPrice from './UnHeaderTokenPrice.vue';
import UnHeaderGas from './UnHeaderGas.vue';


// Because component in v-if block - make it async
const UnBtn = defineAsyncComponent(() => import(
  /* webpackChunkName: "UnBtn" */
  '@/components/ui/UnBtn.vue'
));

// Because component in v-if block - make it async
const UnHeaderBalance = defineAsyncComponent(() => import(
  /* webpackChunkName: "UnHeaderBalance" */
  './UnHeaderBalance.vue'
));

// Because component in v-if block - make it async
const UnHeaderAccount = defineAsyncComponent(() => import(
  /* webpackChunkName: "UnHeaderAccount" */
  './UnHeaderAccount.vue'
));

export default defineComponent({
  name: 'UnLayoutDefaultHeader',
  components: {
    UnBtn,
    UnLogo,
    UnHeaderMenuNav,
    UnHeaderBalance,
    UnHeaderAccount,
    UnMobileMenu,
    UnHeaderTokenHolder,
    UnHeaderUniswap,
    UnHeaderTokenPrice,
    UnHeaderGas,
  },
  setup() {
    const { currentRoute } = useRouter();
    // eslint-disable-next-line object-curly-newline
    const { isAnyConnected, isLoadingConnect, wallet, account } = useCore();
    const modalConnectWallet = useModalConnectWallet();

    const isMobileMenuOpen = ref(false);

    watch([currentRoute], () => {
      isMobileMenuOpen.value = false;
    });

    const withStar = computed(() => (
      account.value ? +account.value.balance > 0 : false
    ));

    const onConnect = () => {
      void modalConnectWallet.show({ wallet: wallet.value });
    };

    return {
      isMobileMenuOpen,
      isLoadingConnect,
      isAnyConnected,
      account,
      wallet,
      withStar,
      onConnect,
    };
  },
});
</script>

<style lang="scss">
.un-header {
  position: relative;
  z-index: 9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1256px;
  padding: 9px 9px 9px 0;
  margin: 0 auto;
}

.un-header-logo {
  display: flex;
  align-items: center;
  max-width: 211px;
  margin-right: 20px;

  @include media-lte(desktop-lg) {
    max-width: 220px;
  }
}

.un-header-menu {
  align-items: center;
  transition: all 0.3s;

  @include media-lte(desktop-md) {
    display: none;
  }
}

.un-header__logo-menu-wrap {
  display: flex;
  align-items: center;
}

.un-header-btns__connect {
  max-height: 33px;
  padding: 0 10px !important;

  @include media-lte(tablet) {
    width: 136px;
    height: 33px;
    font-size: 13px;
  }
}

.un-header-wallet {
  display: flex;
  align-items: center;

  @include media(tablet) {
    font-size: 16px;
  }

  @include media-lte(desktop-md) {
    flex-direction: row;
    align-items: center;
    margin-left: auto;
  }

  @include media-lte(tablet-xs) {
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
  }

  &__gas,
  &__token-price,
  &__balance,
  &__token-holder,
  &__uniswap {
    margin-right: 8px;

    @include media-lte(desktop-md) {
      display: none;
    }
  }
}
</style>
