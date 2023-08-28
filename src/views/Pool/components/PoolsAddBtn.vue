<template>
  <UnBtn
    square
    :to="to"
    :pre-icon="require('@/assets/images/icons/plus.svg')"
    font-size="14px"
    text="New position"
    class="pool-header-bar"
    data-testid="add-new-position"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ROUTE_POOL_LIQUIDITY } from '@/helpers/enums/routes';

import UnBtn from '@/components/ui/UnBtn.vue';


export default defineComponent({
  name: 'PoolsAddBtn',
  components: {
    UnBtn,
  },
  setup: () => ({
    to: { name: ROUTE_POOL_LIQUIDITY },
  }),
});
</script>
