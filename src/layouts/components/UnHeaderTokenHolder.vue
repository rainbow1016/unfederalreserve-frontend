<template>
  <UnHeaderCard class="un-header-token-holder">
    <slot>
      <UnTooltip
        content-text="Thanks for being a valued eRSDL holder!"
        content-width="220px"
        class="un-header-token-holder__tooltip"
      >
        <template #activator>
          <img
            src="@/assets/images/icons/star.svg"
            class="un-header-token-holder__icon"
          >
        </template>
      </UnTooltip>
    </slot>
  </UnHeaderCard>
</template>

<script lang="ts">
// eslint-disable-next-line object-curly-newline
import { defineComponent } from 'vue';

import UnHeaderCard from './UnHeaderCard.vue';
import UnTooltip from '@/components/ui/UnTooltip.vue';

export default defineComponent({
  name: 'UnHeaderTokenHolder',
  components: {
    UnHeaderCard,
    UnTooltip,
  },
});
</script>

<style lang="scss">
.un-header-token-holder {
  &__tooltip {
    height: 100%;
  }

  &__icon {
    width: 33px;
    height: 100%;
    padding: 6px;
  }
}
</style>
