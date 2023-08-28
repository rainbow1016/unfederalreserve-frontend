<template>
  <UnModalLayout
    title="Disconnect wallet"
    class="un-modal-disconnect-wallet"
    @close="$emit('close')"
  >
    <template #default>
      <span
        class="un-modal-disconnect-wallet__img"
        v-html="require('!raw-loader!@/assets/images/icons/disconnect.svg').default"
      />
      <p class="un-modal-disconnect-wallet__text" data-testid="disconnect-modal-text">
        Are you sure you want to disconnect your wallet?
      </p>
    </template>

    <template #footer>
      <div class="un-modal-disconnect-wallet__footer-btns">
        <UnBtn
          text="cancel"
          cancel
          data-testid="cancel-button"
          @click="$emit('close')"
        />
        <UnBtn
          text="disconnect"
          danger
          data-testid="disconnect-button"
          @click="onDisconnect"
        />
      </div>
    </template>
  </UnModalLayout>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { Wallet } from '@/types/common.d';

import UnModalLayout from './UnModalLayout.vue';
import UnBtn from '@/components/ui/UnBtn.vue';

export default defineComponent({
  name: 'UnModalDisconnectWallet',
  components: {
    UnModalLayout,
    UnBtn,
  },
  props: {
    wallet: {
      type: Object as PropType<Wallet>,
      required: true,
    },
  },
  emits: ['close'], // close modal
  setup(props, ctx) {
    const onDisconnect = () => {
      const promise = props.wallet.disconnect();
      ctx.emit('close', promise);
    };

    return {
      onDisconnect,
    };
  },
});
</script>

<style lang="scss">
.un-modal-disconnect-wallet {
  text-align: center;

  @include media-lt(tablet) {
    display: flex;
    flex-direction: column;
  }

  &__img {
    max-width: 190px;
    max-height: 190px;
    margin: 25px auto;

    @include media-lt(tablet) {
      margin-top: 30px;
    }
  }

  &__text {
    margin: 0 0 20px;
    font-size: 18px;
    font-weight: 500;
    word-spacing: 0;

    @include media-lt(tablet) {
      width: 100%;
      max-width: 365px;
      margin: 0 auto 20px;
      line-height: 26px;
    }
  }

  &__footer-btns {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    @include media-lt(tablet) {
      flex: 1;
      flex-direction: column-reverse;
      align-items: center;
      justify-content: flex-start;
    }

    button {
      width: 210px;

      @include media-lt(tablet) {
        width: 100%;
        max-width: 341px;
        margin-top: 15px;
      }
    }
  }
}

</style>
