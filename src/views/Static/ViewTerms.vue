<template>
  <UnLayoutDefault
    title="Terms of Service"
    details="Last Modified: December 1, 2021"
    with-home-grass
    with-scroll-up
    class="view-terms"
  >
    <UnCard v-once class="terms-content">
      <TermsContent v-once />
    </UnCard>
  </UnLayoutDefault>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useGlobalLoader } from '@/store';

import UnLayoutDefault from '@/components/layouts/UnLayoutDefault.vue';
import TermsContent from '@/views/Static/components/TermsContent.vue';
import UnCard from '@/components/ui/UnCard.vue';


export default defineComponent({
  name: 'ViewTerms',
  components: {
    UnLayoutDefault,
    TermsContent,
    UnCard,
  },
  setup: () => {
    useGlobalLoader().hide();
  },
});
</script>
