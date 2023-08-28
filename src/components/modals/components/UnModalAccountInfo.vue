<template>
  <div class="un-modal-account-info">
    <div class="un-modal-account-info__wrap">
      <img
        :v-if="isAnyConnected"
        :class="{ 'is-selected': isSelectedEthAccount }"
        class="un-modal-account-info__icon"
        :src="providerIcon"
      >
      <div class="un-modal-account-info__network-data">
        <div class="un-modal-account-info__network-name">
          <div
            class="un-modal-account-info__network-dot"
            :style="{ backgroundColor: networkColor }"
          />
          {{ networkName }}
        </div>
        <div
          class="un-modal-account-info__address"
          :class="{ 'is-clickable': isChangeAccountActive }"
          @click="isChangeAccountActive ? (isShowWalletAddresses = !isShowWalletAddresses) : null"
        >
          {{ accountAddress }}

          <div
            v-if="isChangeAccountActive"
            class="un-modal-account-info__arrow"
            :class="{ 'is-active': isShowWalletAddresses }"
          >
            <img
              v-svg-inline
              :src="require('@/assets/images/icons/arrow-down.svg')"
              class="un-modal-account-info__arrow-img"
            >
          </div>
        </div>
      </div>
    </div>
    <UnBtn
      class="un-modal-account-info__switch-wallet"
      :uppercase="false"
      outlined
      text="Switch Wallet Provider"
      @click="$emit('switch')"
    />

    <transition name="transition--fade" appear>
      <UnModalChangeAccount
        v-if="isShowWalletAddresses && isChangeAccountActive"
        v-model="isShowWalletAddresses"
        :wallet="wallet"
        class="un-modal-account-info__wallet-addresses"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import {
  PropType,
  defineComponent,
  computed,
  ref,
} from 'vue';
import { Wallet } from '@/types/common.d';
import { NETWORK_NAME_MAP as NETWORKS_MAP } from '@/helpers/enums/params';
import { shortenToken } from '@/helpers/shortenToken';

import UnBtn from '@/components/ui/UnBtn.vue';
import UnModalChangeAccount from '@/components/modals/components/UnModalChangeAccount.vue';

export default defineComponent({
  name: 'UnModalAccountInfo',
  components: {
    UnBtn,
    UnModalChangeAccount,
  },
  props: {
    wallet: {
      type: Object as PropType<Wallet>,
      required: true,
    },
    clickable: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['switch'],
  setup(props) {
    // eslint-disable-next-line vue/no-setup-props-destructure
    const { wallet } = props;
    const { isAnyConnected } = wallet;
    const networkColor = wallet.env?.NETWORK_COLOR;
    const networkName = NETWORKS_MAP[wallet.chainId as keyof typeof NETWORKS_MAP];

    const settings = wallet.current_provider_settings;
    const providerIcon = settings ? settings.logo : '';
    const isShowWalletAddresses = ref(false);

    const isChangeAccountActive = computed(() => (
      props.wallet.ethAccounts.length > 1 && props.clickable
    ));

    const accountAddress = computed(() => (
      shortenToken(props.wallet.ethAccount)
    ));

    const isSelectedEthAccount = computed(() => (
      props.wallet.isSelectedEthAccount
    ));

    return {
      isSelectedEthAccount,
      accountAddress,
      providerIcon,
      isAnyConnected,
      isShowWalletAddresses,
      networkName,
      networkColor,
      isChangeAccountActive,
    };
  },
});
</script>

<style lang="scss">
.un-modal-account-info {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @include media-lt(tablet) {
    flex-wrap: wrap;
    margin-bottom: 10px;
  }

  &__icon {
    width: 35px;
    height: 35px;
    margin-right: 15px;

    &:not(.is-selected) {
      filter: grayscale(100%);
    }
  }

  &__wrap {
    display: flex;
    align-items: center;
  }

  &__network-name {
    display: flex;
    align-items: center;
    font-size: 12px;
    line-height: 18px;
  }

  &__network-dot {
    width: 8px;
    height: 8px;
    margin-right: 6px;
    border-radius: 50%;
  }

  &__address {
    display: flex;
    font-size: 22px;
    font-weight: 600;
    line-height: 26px;

    &.is-clickable:hover {
      cursor: pointer;
    }
  }

  &__switch-wallet {
    width: 193px;
    height: 40px;
    padding: 0 15px;
    font-size: 14px;
    font-weight: 600;
    line-height: 21px;
    text-transform: none;

    @include media-lt(tablet) {
      width: 100%;
      margin-top: 22px;
      margin-bottom: 10px;
    }
  }

  &__arrow {
    display: flex;
    align-items: center;
    padding-left: 8px;

    &-img {
      width: 12px;
      color: white;
      transition: all 0.3s;
      transform-origin: center;
    }

    &.is-active &-img {
      transform: rotate(180deg);
    }
  }

  &__wallet-addresses {
    position: absolute;
    top: 115%;
    right: 0;
    left: 0;
    z-index: 4;
    width: 350px;
    margin: 0 auto;
    transition: all 0.3s;
  }
}
</style>
