<template>
  <!-- eslint-disable vue/no-multiple-template-root -->

  <div
    class="un-header-menu-bg"
    :class="{ 'is-active': modelValue }"
    @click="$emit('update:modelValue', false)"
  />

  <div
    class="un-header-burger"
    :class="{'is-close': modelValue}"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <span v-if="!modelValue">
      <img
        v-svg-inline
        :src="require('@/assets/images/icons/burger-icon.svg')"
        class="un-header-burger__icon is-burger"
      >
    </span>
    <span v-if="modelValue">
      <img
        v-svg-inline
        :src="require('@/assets/images/icons/close.svg')"
        class="un-header-burger__icon is-close"
      >
    </span>
  </div>

  <div
    class="un-mobile-menu"
    :class="{ 'is-active': modelValue }"
  >
    <div v-if="isAnyConnected" class="un-mobile-menu__header-wrapper">
      <div class="un-mobile-menu__wallet-info-wrapper">
        <UnHeaderTokenPrice
          :account="account"
          class="un-mobile-menu__token-price"
        />
        <UnHeaderGas
          :account="account"
          class="un-mobile-menu__gas"
        />
      </div>

      <div class="un-mobile-menu__account-wrapper" @click.stop="showAccountModal">
        <UnModalAccountInfo
          class="un-mobile-menu__account"
          :wallet="wallet"
          :clickable="false"
        />

        <img
          v-svg-inline
          :src="require('@/assets/images/icons/chevron-light.svg')"
          class="un-mobile-menu__arrow"
        >
      </div>

      <div class="un-mobile-menu__divider" />

      <div class="un-mobile-menu__balance-wrapper">
        <UnHeaderBalance
          :wallet="wallet"
          :account="account"
          with-currency
          :clickable="isAnyConnected"
          class="un-mobile-menu__balance"
        />

        <img
          v-svg-inline
          src="@/assets/images/icons/chevron-light.svg"
          class="un-mobile-menu__balance-arrow un-mobile-menu__arrow"
        >
      </div>

      <div v-if="withStar" class="un-mobile-menu__holder">
        <img
          src="@/assets/images/icons/star.svg"
          class="un-mobile-menu__holder-icon"
        >
        <span>Thanks for being a valued eRSDL holder!</span>
      </div>
    </div>

    <UnHeaderMenuNav
      @click="$emit('update:modelValue', false)"
    />

    <div
      class="un-mobile-menu__help"
      @click="showHelpModal"
    >
      Help
    </div>

    <div class="un-mobile-menu__social-links-wrapper">
      <div>Follow us on social media</div>
      <UnSocialLinks
        :social-list="socialList"
        class="un-mobile-menu__social-links"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  PropType,
  computed,
  defineComponent,
  watch,
  onMounted,
  onUnmounted,
  onBeforeUnmount,
} from 'vue';
import { useCore } from '@/store';
import { Wallet, Account } from '@/types/common.d';
import { blockedBody } from '@/helpers/blocked-body';
import { useBreakpoints } from '@/composable';
import {
  useModalHelp,
  useAccountModal,
} from '@/components/modals/modals';
import {
  YOUTUBE,
  DISCORD,
  LINKEDIN,
  FACEBOOK,
  TELEGRAM,
  TWITTER,
  DEFI,
} from '@/helpers/enums/socials';

import UnSocialLinks from '@/components/common/UnSocialLinks.vue';
import UnModalAccountInfo from '@/components/modals/components/UnModalAccountInfo.vue';
import UnHeaderMenuNav from './UnHeaderMenuNav.vue';
import UnHeaderTokenPrice from './UnHeaderTokenPrice.vue';
import UnHeaderBalance from './UnHeaderBalance.vue';
import UnHeaderGas from './UnHeaderGas.vue';


const SOCIAL_LIST = [
  YOUTUBE,
  DISCORD,
  LINKEDIN,
  FACEBOOK,
  TELEGRAM,
  TWITTER,
  DEFI,
];

const useVhHeight = () => {
  const setHeight = () => {
    const mobileMenuHeight = window.innerHeight * 0.01;
    document.documentElement.style.setProperty(
      '--vh',
      `${mobileMenuHeight}px`,
    );
  };

  onMounted(() => {
    setHeight();
    window.addEventListener('resize', setHeight);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', setHeight);
  });

  return setHeight;
};

const useBlockedBody = (
  props: { modelValue: boolean },
  close: () => void,
) => {
  const { isDesktopMD } = useBreakpoints();

  let unBlockedBody: (() => void) | null = null;

  watch([isDesktopMD], () => {
    close();
  });

  watch(() => props.modelValue, () => {
    unBlockedBody?.();
    unBlockedBody = null;

    if (props.modelValue) {
      unBlockedBody = blockedBody();
    }
  });

  onBeforeUnmount(() => {
    unBlockedBody?.();
    unBlockedBody = null;
  });
};

export default defineComponent({
  name: 'UnMobileMenu',
  components: {
    UnSocialLinks,
    UnHeaderMenuNav,
    UnModalAccountInfo,
    UnHeaderTokenPrice,
    UnHeaderBalance,
    UnHeaderGas,
  },
  props: {
    modelValue: Boolean,
    connected: Boolean,
    account: {
      type: Object as PropType<Account>,
    },
    wallet: {
      type: Object as PropType<Wallet>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const { isAnyConnected, account: acc } = useCore();
    const modalHelp = useModalHelp();
    const accountModal = useAccountModal();
    const close = () => ctx.emit('update:modelValue', false);

    const showHelpModal = () => {
      void modalHelp.show(props);
    };
    const showAccountModal = () => {
      void accountModal.show(props);
    };

    void useBlockedBody(props, close);
    void useVhHeight();

    const withStar = computed(() => (
      acc.value ? +acc.value.balance > 0 : false
    ));

    return {
      socialList: SOCIAL_LIST,
      isAnyConnected,
      withStar,

      showHelpModal,
      showAccountModal,
    };
  },
});
</script>

<style lang="scss">
$z-index-menu-bg: 99;
$z-index-menu: 999;
$z-index-menu-burger: $z-index-menu + 1;

.un-header-menu-bg,
.un-header-burger,
.un-mobile-menu {
  @include media-gt(desktop-md) {
    display: none !important;
  }
}

.un-header-menu-bg {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: $z-index-menu-bg;
  width: 100%;
  height: 100%;
  visibility: hidden;
  background: rgba(0, 0, 0, 0.33);
  opacity: 0;
  transition: 0.3s;

  &.is-active {
    visibility: visible;
    opacity: 1;
  }
}

.un-header-burger {
  z-index: $z-index-menu-burger;
  margin-left: 19px;
  color: $un-color-white;
  cursor: pointer;
  transition: color 0.3s;

  @include media-lt(tablet) {
    margin: 0 0 0 23px;
  }

  &.is-close {
    position: fixed;
    top: 16px;
    right: 8px;
    margin: 0;
    color: #8193a8;
  }

  &__icon {
    width: 26px;
    height: 16px;
  }
}

.un-mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  z-index: $z-index-menu;
  display: flex;
  flex-direction: column;
  width: 305px;
  height: 100vh;
  margin-right: 0;
  overflow-y: auto;
  background: linear-gradient(180deg, #13296d 0%, rgba(19, 41, 109, 0.85) 100%);
  opacity: 0;
  transition: opacity 0.3s, transform 0.3s;
  transform: translateX(110%);

  &.is-active {
    opacity: 1;
    transform: translateX(0);
  }

  &__token-price,
  &__gas {
    justify-content: space-between;
    width: 100%;
    background: #1f3887;
  }

  &__token-price {
    margin-right: 11px;
  }

  &__help {
    width: 100%;
    height: 51px;
    padding: 17px 0 17px 32px;
    font-size: 18px;
    font-weight: 500;
    color: #84adfe;
    cursor: pointer;
  }

  &__wallet-info-wrapper,
  &__account-wrapper,
  &__balance-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 15px;
  }

  &__header-wrapper {
    padding-right: 21px;
    background: #152c76;
  }

  &__wallet-info-wrapper {
    margin-top: 70px;
  }

  &__balance-wrapper {
    margin-top: 10px;
  }

  &__account-wrapper {
    margin-top: 30px;
    margin-bottom: 15px;
    cursor: pointer;
  }

  &__balance {
    justify-content: start;
    width: 100%;
    padding: 0;
    font-size: 15px;
    background: transparent;

    &:hover.is-clickable {
      background: transparent;
    }

    .un-header-balance__icon {
      width: 22px;
    }

    &-arrow {
      position: absolute;
      right: 0;
    }
  }

  &__account {
    color: white;

    .un-modal-account-info__switch-wallet,
    .un-modal-account-info__arrow {
      display: none;
    }

    .un-modal-account-info__icon {
      width: 25px;
      height: 25px;
    }

    .un-modal-account-info__network-name {
      font-size: 10px;
    }
  }

  &__divider {
    width: 100%;
    margin-right: 15px;
    border-top: 2px solid #2244a8;
  }

  &__help-wrapper {
    padding: 20px 27px;
  }

  &__holder {
    display: flex;
    align-items: center;
    height: 36px;
    margin: 15px 0 15px 15px;
    font-size: 11px;
    color: #ffdc64;
    background: rgba(255, 200, 0, 0.12);
    border-radius: 8px;
    box-shadow: 13px 2px 6px rgba(31, 63, 174, 0.02), 7px 0 50px rgba(31, 63, 174, 0.02);
  }

  &__holder-icon {
    width: 17px;
    margin: 0 5px 0 12px;
  }

  &__social-links-wrapper {
    padding: 5px 27px 15px 27px;
    margin-top: auto;
    font-size: 12px;
    font-weight: 600;
    color: white;
    text-transform: uppercase;
  }

  &__btn {
    & + & {
      margin-top: 18px;
    }
  }

  &__social-links {
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-top: 20px;
    color: $un-color-switch-bg;

    a {
      margin-right: 18px;
      margin-bottom: 5px;
    }
  }

  .un-header-gas {
    .un-pool-dropdown__items {
      right: -10px;
    }

    .un-pool-dropdown__selected-arrow {
      width: 15px;
      color: #fff;
    }
  }

  &__arrow {
    height: 15px;
  }
}
</style>
