<template>
  <div class="un-modal-connect-wallet-back">
    <img
      :src="require('@/assets/images/icons/back-icon.svg')"
      class="un-modal-connect-wallet-back__icon"
    >
    <div class="un-modal-connect-wallet-back__text">
      Back
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';


export default defineComponent({
  name: 'UnModalConnectWalletBack',
});
</script>

<style lang="scss">
.un-modal-connect-wallet-back {
  display: flex;
  align-items: center;
  cursor: pointer;

  &__icon {
    width: 24px;
    height: 24px;
  }

  &__text {
    margin-left: 7px;
    font-size: 16px;
    font-weight: 500;
    line-height: 26px;
  }
}
</style>
