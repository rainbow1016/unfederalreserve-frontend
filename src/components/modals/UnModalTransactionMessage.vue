<template>
  <UnModalLayout
    :title="title"
    :closable="false"
    class="un-modal-transaction-message"
  >
    <div class="un-modal-transaction-message__container">
      <UnLoaderCircle
        v-if="loading"
        large
        class="un-modal-transaction-message__loader"
      />
      <div class="un-modal-transaction-message__message">
        {{ message }}
      </div>
    </div>
  </UnModalLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import UnModalLayout from './UnModalLayout.vue';
import UnLoaderCircle from '@/components/ui/UnLoaderCircle.vue';


export default defineComponent({
  name: 'UnModalTransactionMessage',
  components: {
    UnModalLayout,
    UnLoaderCircle,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    loading: Boolean,
    message: String,
  },
  emits: ['close'], // close modal
});
</script>

<style lang="scss">
.un-modal-transaction-message {
  width: 372px;

  @include media-lte(tablet) {
    width: 100%;
  }

  &__container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__loader {
    height: auto;
    margin-top: 28px;
    margin-bottom: 20px;
  }

  &__message {
    margin-bottom: 32px;
    font-size: 14px;
    font-weight: 400;
  }
}
</style>
