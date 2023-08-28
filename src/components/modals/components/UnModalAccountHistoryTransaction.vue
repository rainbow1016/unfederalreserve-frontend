<template>
  <div
    :class="`is-status--${settings.status}`"
    class="un-modal-account-history-transaction"
  >
    <div class="un-modal-account-history-transaction__data">
      <UnLoaderCircle
        v-if="settings.loading"
        medium
        class="un-modal-account-history-transaction__icon is-loading"
      />

      <img
        v-else-if="settings.icon"
        v-svg-inline
        :src="settings.icon"
        class="un-modal-account-history-transaction__icon"
      >

      <div class="un-modal-account-history-transaction__name-wrap">
        <div
          class="un-modal-account-history-transaction__name"
          v-text="settings.name"
        />
        <div
          v-if="description"
          class="un-modal-account-history-transaction__supply"
          v-text="description"
        />
      </div>
    </div>

    <a
      v-if="href"
      :href="href"
      target="_blank"
      class="un-modal-account-history-transaction__link"
      v-text="'View on Etherscan'"
    />
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, computed } from 'vue';

import { TRANSACTION_STATUSES, TRANSACTION_STATUS_LABELS } from '@/helpers/enums/params';
import { Wallet, IHistoryTransaction } from '@/types/common.d';

import UnLoaderCircle from '@/components/ui/UnLoaderCircle.vue';


const SETTINGS = {
  [TRANSACTION_STATUSES.CONFIRMED]: {
    name: TRANSACTION_STATUS_LABELS[TRANSACTION_STATUSES.CONFIRMED],
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, global-require, @typescript-eslint/no-var-requires
    icon: require('@/assets/images/icons/check-circle.svg') as string,
    loading: false,
    status: 'confirmed',
  },

  [TRANSACTION_STATUSES.FAILED]: {
    name: TRANSACTION_STATUS_LABELS[TRANSACTION_STATUSES.FAILED],
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, global-require, @typescript-eslint/no-var-requires
    icon: require('@/assets/images/icons/failed-transaction.svg') as string,
    loading: false,
    status: 'failed',
  },

  [TRANSACTION_STATUSES.PENDING]: {
    name: TRANSACTION_STATUS_LABELS[TRANSACTION_STATUSES.PENDING],
    icon: '',
    loading: true,
    status: 'pending',
  },

  DEFAULT: {
    name: TRANSACTION_STATUS_LABELS.DEFAULT,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, global-require, @typescript-eslint/no-var-requires
    icon: require('@/assets/images/icons/bell.svg') as string,
    loading: false,
    status: 'unknown',
  },
};

export default defineComponent({
  name: 'UnModalAccountHistoryTransaction',
  components: {
    UnLoaderCircle,
  },
  props: {
    wallet: {
      type: Object as PropType<Wallet>,
      required: true,
    },
    tx: {
      type: Object as PropType<IHistoryTransaction>,
      required: true,
    },
    description: String,
  },
  setup(props) {
    // eslint-disable-next-line vue/no-setup-props-destructure
    const TX_URL = props.wallet?.env?.TX_URL;
    const href = TX_URL && [TX_URL, props.tx.hash].join('');

    const settings = computed(() => {
      const { status } = props.tx;
      return status && status in SETTINGS ? SETTINGS[status] : SETTINGS.DEFAULT;
    });

    return {
      settings,
      href,
    };
  },
});
</script>

<style lang="scss">
.un-modal-account-history-transaction {
  $root: &;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 0;
  margin-bottom: 10px;

  @include media-lt(tablet) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 20px;
  }

  &__data {
    display: flex;
    align-items: center;
  }

  &__icon {
    width: 28px;
    height: 28px;

    @include media-lt(tablet) {
      position: relative;
      top: 5px;
    }
  }

  &__name-wrap {
    margin-left: 20px;
    font-weight: 700;
    line-height: 21px;
  }

  &__name {
    font-size: 14px;

    &.failed {
      color: $un-color-critical;
    }
  }

  &__supply {
    font-size: 12px;
    color: $un-color-gray-3;
  }

  &__link {
    padding-bottom: 0;
    font-size: 12px;
    font-weight: 600;
    line-height: 21px;
    color: white;
    text-decoration: underline;

    @include media-lt(tablet) {
      padding-left: 47px;
      margin-top: 5px;
      text-decoration: underline;
    }

    &:hover {
      text-decoration: none;
      cursor: pointer;
    }
  }
}
</style>
