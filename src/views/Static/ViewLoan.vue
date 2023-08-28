<template>
  <UnLayoutDefault
    title="Loan Agreement"
    with-home-grass
    with-scroll-up
    class="view-terms"
  >
    <UnCard v-once class="terms-content">
      <LoanContent v-once />
    </UnCard>
  </UnLayoutDefault>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useGlobalLoader } from '@/store';

import UnLayoutDefault from '@/components/layouts/UnLayoutDefault.vue';
import LoanContent from '@/views/Static/components/LoanContent.vue';
import UnCard from '@/components/ui/UnCard.vue';


export default defineComponent({
  name: 'ViewTerms',
  components: {
    UnLayoutDefault,
    LoanContent,
    UnCard,
  },
  setup: () => {
    useGlobalLoader().hide();
  },
});
</script>
