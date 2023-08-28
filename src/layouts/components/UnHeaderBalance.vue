<template>
  <UnHeaderCard
    :loading="!account"
    :clickable="clickable"
    class="un-header-balance"
    data-testid="rewards-balance"
    @click="onClick"
  >
    <slot>
      <div class="un-header-balance__img-wrapper">
        <img
          :src="require('@/assets/images/icons/base.svg')"
          class="un-header-balance__icon"
        >
      </div>
      <transition name="transition--fade" mode="out-in">
        <UnLoaderCircle
          v-if="isLoadingConnect"
          small
          class="un-header-balance__loader"
        />
        <span
          v-else
          :key="balance"
          class="un-header-balance__value"
          data-testid="value"
          v-text="balance"
        />
      </transition>
    </slot>
  </UnHeaderCard>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { formatToNumber } from '@/helpers/formatters';
import { useModalClaim } from '@/components/modals/modals';
import { useCore } from '@/store';

import UnLoaderCircle from '@/components/ui/UnLoaderCircle.vue';
import UnHeaderCard from './UnHeaderCard.vue';


export default defineComponent({
  name: 'UnHeaderBalance',
  components: {
    UnLoaderCircle,
    UnHeaderCard,
  },
  props: {
    clickable: Boolean,
    wallet: {
      type: Object,
      required: true,
    },
    account: {
      type: Object,
    },
    withCurrency: Boolean,
  },
  setup(props) {
    const { isLoadingConnect, account, wallet } = useCore();
    const modalClaim = useModalClaim();

    const balance = computed(() => {
      const fBalance = (account.value && formatToNumber(account.value.balance, true, true)) || '0.00';
      return props.withCurrency ? `${fBalance} eRSDL` : fBalance;
    });

    const onClick = () => {
      if (!account.value || !wallet.value) return;
      void modalClaim.show({ account: account.value, wallet: wallet.value });
    };

    return {
      balance,
      isLoadingConnect,
      onClick,
    };
  },
});
</script>

<style lang="scss">
.un-header-balance {
  padding: 0 8px 0 9px;

  &__img-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 9px;
    box-shadow:
      0 0 10px rgba(17, 38, 112, 0.03),
      0 8px 24px rgba(17, 38, 112, 0.07),
      0 2px 6px rgba(17, 38, 112, 0.04),
      0 0 1px rgba(17, 38, 112, 0.04);
  }

  &__icon {
    width: 18px;
  }
}
</style>
