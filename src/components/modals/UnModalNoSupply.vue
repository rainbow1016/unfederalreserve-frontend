<template>
  <UnModalLayout
    class="un-modal-no-supply"
    @close="$emit('close')"
  >
    <template #default>
      <div
        class="un-modal-no-supply__icon"
        v-html="require('!raw-loader!@/assets/images/icons/no-supply.svg').default"
      />
      <h3 class="un-modal-no-supply__title">
        Enable borrow by supplying an asset
      </h3>
      <p class="un-modal-no-supply__description">
        Supply at least one asset as collateral to enable borrowing
      </p>
    </template>

    <template #footer>
      <p class="un-modal-no-supply__footer">
        It’s easy! Learn
        <a :href="linkToDocs" target="_blank">How to supply asset</a>
      </p>
    </template>
  </UnModalLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import UnModalLayout from './UnModalLayout.vue';


export default defineComponent({
  name: 'UnModalNoSupply',
  components: {
    UnModalLayout,
  },
  emits: ['close'], // close modal
  setup() {
    const linkToDocs = `${process.env.VUE_APP_DOCS_LINK}/docs/instructions/supply/`;

    return {
      linkToDocs,
    };
  },
});
</script>

<style lang="scss">
.un-modal-no-supply {
  font-size: 14px;
  text-align: center;

  &__icon {
    margin-bottom: 26px;

    @include media-lt(tablet) {
      padding-top: 70px;
    }
  }

  &__title {
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: 600;
    line-height: 26px;
    color: white;

    @include media-lt(tablet) {
      width: 100%;
      max-width: 290px;
      margin: 0 auto 15px;
    }
  }

  &__description {
    width: 100%;
    max-width: 300px;
    margin: 0 auto 5px;
    line-height: 21px;
    color: white;
  }

  &__footer {
    font-weight: 500;
    line-height: 26px;
    color: white;

    a {
      color: $un-color-normal;
      text-decoration: underline;
      transition: opacity 0.25s;

      &:hover {
        opacity: 0.8;
      }
    }
  }
}

</style>
