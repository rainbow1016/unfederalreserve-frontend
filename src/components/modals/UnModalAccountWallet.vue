<template>
  <UnModalLayout
    title="Account"
    title-left
    footer-up
    footer-lined
    class="un-modal-account-wallet"
    @close="$emit('close')"
  >
    <template #default>
      <UnModalAccountInfo
        :wallet="wallet"
        @switch="onSwitch"
      />

      <div class="un-modal-account__action-btns">
        <template v-for="item in actionList" :key="item.id">
          <component
            :is="item.href ? 'a' : 'div'"
            :href="item.href"
            target="__blank"
            :class="{ 'is-disabled': item.disabled }"
            class="un-modal-account__action-wrap"
          >
            <img
              v-svg-inline
              :src="item.icon"
              class="un-modal-account__action-icon"
            >
            <span
              class="un-modal-account__action-link"
              @click="onClickBtn(item)"
              v-text="item.label"
            />
          </component>
        </template>
      </div>
    </template>

    <template #footer>
      <UnModalAccountHistoryTransactions
        :wallet="wallet"
      />
    </template>
  </UnModalLayout>
</template>

<script lang="ts">
import { PropType, defineComponent, computed } from 'vue';
import { notify } from '@kyvg/vue3-notification';

import { Wallet } from '@/types/common.d';
import { shortenToken } from '@/helpers/shortenToken';
import { useModalConnectWallet } from '@/components/modals';

import UnModalLayout from './UnModalLayout.vue';
import UnModalAccountInfo from './components/UnModalAccountInfo.vue';
import UnModalAccountHistoryTransactions from './components/UnModalAccountHistoryTransactions.vue';


const NOTIFY_OPTIONS = {
  text: 'Address copied',
  duration: 3000,
  group: 'transaction',
  data: {
    duration: 3000,
  },
};

export default defineComponent({
  name: 'UnModalAccountWallet',
  components: {
    UnModalLayout,
    UnModalAccountInfo,
    UnModalAccountHistoryTransactions,
  },
  props: {
    wallet: {
      type: Object as PropType<Wallet>,
      required: true,
    },
  },
  emits: ['close'], // close modal
  setup(props, ctx) {
    const modalConnectWallet = useModalConnectWallet();

    const account = computed(() => (
      shortenToken(props.wallet.ethAccount)
    ));

    const actionList = computed(() => {
      const { env, ethAccount } = props.wallet;

      return [
        {
          id: 'copy',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, global-require
          icon: require('@/assets/images/icons/copy.svg'),
          label: 'Copy Address',
        },
        {
          id: 'link',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, global-require
          icon: require('@/assets/images/icons/external-link.svg'),
          label: 'View on Etherscan',
          href: [env?.ADDRESS_URL, ethAccount].filter(Boolean).join(''),
          disabled: !env?.ADDRESS_URL,
        },
      ] as const;
    });

    const onSwitch = () => {
      const promise = modalConnectWallet.show(props);
      ctx.emit('close', promise);
    };

    const onDisconnect = () => {
      const promise = props.wallet.disconnect();
      ctx.emit('close', promise);
    };

    const onClickBtn = async (data: (typeof actionList.value)[number]) => {
      const { ethAccount } = props.wallet;

      switch (data.id) {
        case 'copy': {
          await navigator.clipboard.writeText(ethAccount);
          notify(NOTIFY_OPTIONS);
          break;
        }

        default:
      }
    };

    return {
      account,
      actionList,
      onDisconnect,
      onSwitch,
      onClickBtn,
    };
  },
});
</script>

<style lang="scss">
.un-modal-account {
  &__action-btns {
    display: flex;
    margin: 32px 0 17px 0;

    @include media-lt(tablet) {
      justify-content: space-between;
      margin: 22px 0;
    }

    div:first-of-type {
      margin-right: 24px;

      @include media-lt(tablet) {
        margin-right: 5px;
      }
    }
  }

  &__action-wrap {
    display: flex;
    align-items: center;
    color: white;
    text-decoration: none;

    &.is-disabled {
      pointer-events: none;
      opacity: 0.75;
    }
  }

  &__action-icon {
    color: white;
  }

  &__action-link {
    padding: 0;
    margin-left: 7px;
    font-size: 14px;
    font-weight: 600;
    line-height: 21px;
    transition: all 0.2s ease;
    transition: all 0.2s ease-in-out;

    &:hover {
      text-decoration: underline;
      cursor: pointer;
    }

    @include media-lt(tablet) {
      margin-left: 10px;
      text-align: left;
    }
  }
}
</style>
