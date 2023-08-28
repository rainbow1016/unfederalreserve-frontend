<template>
  <div class="un-notification">
    <img
      :src="icon"
      class="un-notification__icon"
    >

    <div class="un-notification__info">
      <div
        class="un-notification__status"
        data-testid="notification-status"
        v-text="title"
      />
      <div
        v-if="data.description"
        class="un-notification__description"
        data-testid="notification-description"
        v-text="data.description"
      />
      <a
        v-if="txHref"
        :href="txHref"
        target="_blank"
        class="un-notification__link"
        data-testid="notification-etherscan-link"
        v-text="'View on Etherscan'"
      />
    </div>

    <div class="un-notification__progress-bar">
      <div
        v-if="duration > 0"
        :style="{ animationDuration: `${duration}ms` }"
        class="un-notification__progress-bar-inner"
      />
    </div>

    <span @click="$emit('close')">
      <img
        v-svg-inline
        src="@/assets/images/icons/close.svg"
        class="un-notification__close"
        data-testid="close-notification-button"
      >
    </span>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { Account, Market } from '@/types/common.d';
import {
  TRANSACTION_STATUSES,
  TRANSACTION_STATUS_LABELS,
} from '@/helpers/enums/params';


type INotificationData = {
  status: typeof TRANSACTION_STATUSES[keyof typeof TRANSACTION_STATUSES];
  txHash?: string;
  description?: string;
  market?: Market;
  account?: Account;
}

const ICON_MAP = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, global-require, @typescript-eslint/no-var-requires
  [TRANSACTION_STATUSES.CONFIRMED]: require('@/assets/images/icons/check-circle.svg') as unknown as string,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, global-require, @typescript-eslint/no-var-requires
  [TRANSACTION_STATUSES.FAILED]: require('@/assets/images/icons/failed-transaction.svg') as unknown as string,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, global-require, @typescript-eslint/no-var-requires
  DEFAULT: require('@/assets/images/icons/bell.svg') as unknown as string,
};

export default defineComponent({
  name: 'UnNotifications',
  inheritAttrs: false,
  props: {
    text: {
      type: String,
      required: true,
    },
    data: {
      type: Object as PropType<INotificationData>,
    },
    duration: {
      type: Number,
      default: 10000,
    },
  },
  emits: ['close'],
  setup: (props) => {
    // @ts-ignore TODO:
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const icon = (ICON_MAP[props.data?.status] || ICON_MAP.DEFAULT) as string;
    const account = props.data?.market?.account || props.data?.account;

    const statusLabel = props.data?.status ? TRANSACTION_STATUS_LABELS[props.data?.status] : '';
    const title = props.text ? props.text : statusLabel;

    // eslint-disable-next-line no-nested-ternary
    const description = props.data?.description
      ? props.data?.description
      : props.text ? statusLabel : '';

    const txSettings = [
      account?.env.TX_URL,
      props.data?.txHash,
    ].filter(Boolean);

    const txHref = txSettings.length === 2 ? txSettings.join('') : '';

    return {
      title,
      description,
      icon,
      txHref,
    };
  },
});
</script>

<style lang="scss">
.un-notification {
  position: relative;
  display: flex;
  align-items: center;
  width: 281px;
  height: auto;
  min-height: 66px;
  padding: 10px 14px;
  margin-bottom: 10px;
  overflow: hidden;
  background: $un-color-white;
  border-radius: 10px;
  box-shadow: 0 4px 12px -2px rgba(26, 48, 123, 0.15);

  @include media-lt(tablet) {
    width: 100%;
    height: auto;
    min-height: 60px;
    padding: 12px 35px 12px 14px;
    margin-bottom: 0;
  }

  &__info {
    padding-right: 30px;
  }

  &__icon {
    margin-right: 12px;
  }

  &__status {
    font-size: 14px;
    font-weight: 700;
    line-height: 21px;
    color: $un-color-text-black;
  }

  &__link {
    padding-bottom: 0;
    font-size: 12px;
    font-weight: 600;
    line-height: 21px;
    color: $un-color-normal;
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }

  &__description {
    padding-bottom: 0;
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    color: $un-color-text-black;
  }

  &__close {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 14px;
    height: 14px;
    color: $un-color-gray-3;
    cursor: pointer;

    @include media-lt(tablet) {
      top: 25px;
    }

    &:hover {
      opacity: 0.5;
    }
  }

  &__progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: $un-color-white;
    border-radius: 10px;

    @include media-lt(tablet) {
      background: $un-color-solitude;
    }
  }

  &__progress-bar-inner {
    width: 0;
    height: 2px;
    background: $un-color-normal;
    border-radius: 10px;
    animation: un-notification__progress 10000ms ease;
  }
}

@keyframes un-notification__progress {
  from { width: 100%; }
  to { width: 0; }
}

.vue-notification-wrapper {
  @include media-lt(tablet) {
    margin-top: 10px !important;
  }

  &:last-child {
    .un-notification {
      @include media-lt(tablet) {
        width: 100%;
        height: auto;
        min-height: 101px;
        padding: 12px 35px 47px 14px;
        margin-bottom: 0;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }
}

.vue-notification-group {
  @include media-lte(tablet) {
    top: auto !important;
    bottom: 0 !important;
    left: 0 !important;
    width: 100% !important;
  }

  @include media-gt(tablet) {
    top: 20px !important;
    right: 20px !important;
    width: fit-content !important;
  }
}
</style>
