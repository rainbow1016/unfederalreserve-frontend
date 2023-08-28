<template>
  <div class="un-warning-message">
    <div class="un-warning-message__title">
      <slot name="title" />
    </div>

    <div class="un-warning-message__image">
      <slot name="image" />
    </div>

    <div class="un-warning-message__description">
      <slot name="description" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';


export default defineComponent({
  name: 'UnWarningMessage',
});
</script>

<style lang="scss">
.un-warning-message {
  position: relative;
  width: calc(100% - 32px);
  max-width: 540px;
  padding: 30px 18px;
  margin: 0 auto;
  color: #fff;
  text-align: center;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(56, 71, 109, 0.03);

  @include media-gt(tablet) {
    width: 540px;
    padding: 40px 30px;
  }

  &__title {
    font-size: 18px;
    font-weight: 500;
    line-height: 27px;

    @include media-gt(tablet) {
      font-size: 20px;
      line-height: 30px;
    }
  }

  &__description {
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;

    @include media-gt(tablet) {
      font-size: 20px;
      line-height: 30px;
    }
  }
}
</style>
