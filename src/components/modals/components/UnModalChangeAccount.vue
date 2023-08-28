<template>
  <UnCard
    no-padding
    class="un-modal-change-account"
  >
    <div
      v-for="account in accountList"
      :key="account.id"
      class="un-modal-change-account__item"
      :class="{
        'is-active': account.active,
        'is-selected': account.selected,
      }"
      @click="onSetAccount(account)"
    >
      <div class="un-modal-change-account__wrap">
        <span
          class="un-modal-change-account__icon"
          v-html="account.avatar"
        />
        <div class="un-modal-change-account__network-data">
          <div
            class="un-modal-change-account__address is-clickable"
            v-text="account.ethAccount"
          />
          <div
            class="un-modal-change-account__network-name"
            v-text="account.network"
          />
        </div>
      </div>

      <div class="un-modal-change-account__action-btns">
        <template v-for="action in account.actions" :key="action.id">
          <component
            :is="action.href ? 'a' : 'div'"
            :href="action.href"
            target="__blank"
            :class="{ 'is-disabled': action.disabled }"
            class="un-modal-change-account__action-wrap"
            @click.stop="onAction(action, account)"
          >
            <img
              v-svg-inline
              :src="action.icon"
              class="un-modal-change-account__action-icon"
            >
          </component>
        </template>
      </div>
    </div>
  </UnCard>
</template>

<script lang="ts">
import Avatars from '@dicebear/avatars';
import SpriteCollection from '@dicebear/avatars-identicon-sprites';
import { notify } from '@kyvg/vue3-notification';
import { PropType, defineComponent, computed } from 'vue';

import { Wallet } from '@/types/common.d';
import { NETWORK_SHORT_NAME_MAP as NETWORKS_MAP } from '@/helpers/enums/params';
import { shortenToken } from '@/helpers/shortenToken';
import { IEnv, env as ENVs } from '@/global/env';

import UnCard from '@/components/ui/UnCard.vue';


const enum ActionTypes {
  copy = 'copy',
  link = 'link',
  remove = 'remove',
}

const ACTIONS_MAP = {
  [ActionTypes.copy]: {
    id: ActionTypes.copy,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, global-require
    icon: require('@/assets/images/icons/copy.svg'),
  },
  [ActionTypes.link]: {
    id: ActionTypes.link,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, global-require
    icon: require('@/assets/images/icons/external-link.svg'),
  },
  [ActionTypes.remove]: {
    id: ActionTypes.remove,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, global-require
    icon: require('@/assets/images/icons/trash.svg'),
  },
};

export default defineComponent({
  name: 'UnModalChangeAccount',
  components: {
    UnCard,
  },
  props: {
    wallet: {
      type: Object as PropType<Wallet>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const avatars = new Avatars(SpriteCollection);

    const accountList = computed(() => {
      const { wallet } = props;
      const ethAccountSelected = wallet.ethAccountSelected.toLowerCase();

      return wallet.ethAccounts.map((_) => {
        const chainId = _.chainId as unknown as Exclude<keyof typeof ENVs, string>;
        const addressUrl = (ENVs[chainId] as IEnv)?.ADDRESS_URL as string;
        const network = NETWORKS_MAP[chainId as keyof typeof NETWORKS_MAP];
        const ethAccount = _.ethAccount.toLowerCase();

        const selected = ethAccount === ethAccountSelected;
        const active = ethAccount === wallet.ethAccount.toLowerCase();
        const avatar = avatars.create(ethAccount);

        const actions = [
          ACTIONS_MAP[ActionTypes.copy],
          {
            ...ACTIONS_MAP[ActionTypes.link],
            href: [addressUrl, _.ethAccount].filter(Boolean).join(''),
            disabled: !addressUrl,
          },
          {
            ...ACTIONS_MAP[ActionTypes.remove],
            disabled: selected || active,
          },
        ];

        return {
          data: _,
          avatar,
          ethAccount: shortenToken(ethAccount),
          active,
          selected,
          network: [network, _.provider].join(' | '),
          actions,
        };
      });
    });

    const onAction = async (
      action: typeof accountList['value'][0]['actions'][0],
      account: typeof accountList['value'][0],
    ) => {
      switch (action.id) {
        case ActionTypes.copy: {
          await navigator.clipboard.writeText(account.data.ethAccount);
          notify({
            text: 'Address copied',
            duration: 3000,
            group: 'transaction',
            data: {
              duration: 3000,
            },
          });
          break;
        }

        case ActionTypes.remove: {
          if (account.active) return;
          void props.wallet.removeAccount(account.data);
          break;
        }

        default:
      }
    };

    const onSetAccount = (account: typeof accountList['value'][0]) => {
      if (account.active) return;
      void props.wallet.setAccount(account.data);
      ctx.emit('update:modelValue', false);
    };

    return {
      accountList,
      onAction,
      onSetAccount,
    };
  },
});
</script>

<style lang="scss">
.un-modal-change-account {
  $root: &;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  max-width: 417px;
  background: #1a327e;
  border-radius: 10px;
  box-shadow: 0 1px 8px rgb(23 25 27 / 22%);

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 12px 18px;
    transition: all 0.3s;

    &.is-active {
      #{$root}__address {
        color: #00d395;
      }
    }

    &:not(.is-active):hover {
      cursor: pointer;
      background-color: #2b428f;
    }
  }

  &__wrap {
    display: flex;
    align-items: center;
  }

  &__icon {
    width: 29px;
    height: 29px;
    margin-right: 10px;

    .is-selected & {
      background-color: $un-color-blue-9;
    }
  }

  &__address {
    display: flex;
    font-size: 14px;
    font-weight: 600;
    line-height: 19px;
    color: #84adfe;
  }

  &__network-name {
    display: flex;
    align-items: center;
    font-size: 12px;
    line-height: 18px;
    color: #798dca;
  }

  &__action-btns {
    display: flex;
  }

  &__action-wrap {
    display: flex;
    align-items: center;
    margin-left: 8px;
    color: #798dca;
    text-decoration: none;
    border: none;
    transition: all 0.2s ease;

    &.is-disabled {
      pointer-events: none;
      opacity: 0.35;
    }

    &:hover {
      color: $un-color-normal;
    }
  }

  &__action-icon {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
}
</style>
