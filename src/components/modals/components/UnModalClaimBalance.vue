<template>
  <div class="un-modal-claim-balance">
    <div class="un-modal-claim-balance__icon">
      <img
        v-svg-inline
        :src="require('@/assets/images/icons/base.svg')"
        alt="un icon"
      >
    </div>
    <div class="un-modal-claim-balance__data" data-testid="balance">
      <transition name="transition--fade" mode="out-in">
        <div :key="balance" class="un-modal-claim-balance__tokens" data-testid="tokens">
          {{ balance }} eRSDL
        </div>
      </transition>

      <transition name="transition--fade" mode="out-in">
        <div :key="balance_usd_f" class="un-modal-claim-balance__usd" data-testid="usd">
          {{ balance_usd_f }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { formatToCurrency } from '@/helpers/formatters';


export default defineComponent({
  name: 'UnModalClaimBalance',
  props: {
    balance: {
      type: String,
      default: '0',
    },
    balanceUsd: {
      type: Number,
      default: 0.00,
    },
  },
  setup(props) {
    const balance_usd_f = computed(() => (
      formatToCurrency(props.balanceUsd)
    ));

    return {
      balance_usd_f,
    };
  },
});
</script>

<style lang="scss">
.un-modal-claim-balance {
  display: flex;

  &__icon {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100px;
    min-width: 100px;
    height: 100px;
    color: $un-color-sapphire;
    background: $un-color-white;
    border-radius: 100%;
    box-shadow: 0 2px 38px rgba(54, 70, 126, 0.11);

    @include media-lt(tablet) {
      width: 90px;
      min-width: 90px;
      height: 90px;
    }
  }

  &__data {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    margin-left: 25px;
  }

  &__tokens {
    margin-bottom: 6px;
    font-size: 24px;
    font-weight: 600;
    line-height: 26px;
    text-align: left;
  }

  &__usd {
    font-size: 18px;
    font-weight: 600;
    line-height: 26px;
    color: #798dca;
  }
}
</style>
