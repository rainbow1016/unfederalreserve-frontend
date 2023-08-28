<template>
  <div
    class="un-cloud"
    :class="left ? 'is-left' : 'is-right'"
  >
    <UnTooltip
      :content-text="tooltipText"
      class="un-cloud__title"
      bordered
    >
      <template #activator>
        <h5>
          {{ title }}
        </h5>
      </template>
    </UnTooltip>
    <div class="un-cloud__value" data-testid="balance">
      {{ usd_f }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { formatToCurrency } from '@/helpers/formatters';

import UnTooltip from '@/components/ui/UnTooltip.vue';


export default defineComponent({
  name: 'UnCloud',
  components: {
    UnTooltip,
  },
  props: {
    value: {
      type: Number,
      default: 0.00,
    },
    title: String,
    tooltipText: String,
    left: Boolean,
  },
  setup(props) {
    const usd_f = computed(() => (
      formatToCurrency(props.value, void 0, true)
    ));

    return {
      usd_f,
    };
  },
});
</script>

<style lang="scss">
.un-cloud {
  font-weight: 600;
  color: $un-color-primary;
  background-image: none;
  background-position: center;
  background-size: 125%;

  @include media-gte(tablet) {
    width: 299px;
    height: 115px;
    padding-top: 14px;
    text-align: center;
  }

  &__value {
    margin-left: 5px;
    font-size: 20px;
    line-height: 37px;
  }

  &__title {
    margin-top: 32px;
    font-size: 14px;
    line-height: 17px;
    color: $un-color-normal;

    @include media-lte(tablet) {
      margin-top: 20px;
    }
  }

  &.is-left {
    @include media-gte(tablet) {
      background-image: url(~@/assets/images/background/cloud-left.svg);
    }
  }

  &.is-right {
    @include media-gte(tablet) {
      background-image: url(~@/assets/images/background/cloud-right.svg);
    }
  }
}
</style>
