<template>
  <div class="un-modal-transaction-approve-title">
    <p class="un-modal-transaction-approve-title__text">
      To {{ label }} {{ symbol_f }} to ReserveLending,
      you need to approve it first.
    </p>
    <UnTooltip
      bordered
      solid-border
      :content-text="tooltipText"
      content-width="350px"
      class="un-modal-transaction-approve-title__tooltip"
      :activator-text="activatorText"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { formatSymbol } from '@/helpers/formatters/legacy';

import UnTooltip from '@/components/ui/UnTooltip.vue';
import { CURRENCIES } from '@/helpers/enums/currencies';


const TOOLTIP_TEXT = `
  Applications built on Ethereum require us to set a spending limit,
  or "give permission" to spend our tokens in order to deposit them.
  Since ETH is the native asset of Ethereum, we can thankfully
  send/deposit any amount of ETH into any DeFi application without
  this Approval step.
`;

const ACTIVATOR_TEXT = 'Why do we have to "Approve"?';

export default defineComponent({
  name: 'UnModalTransactionApproveTitle',
  components: {
    UnTooltip,
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    symbol: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const icon = CURRENCIES[props.symbol];
    const symbol_f = formatSymbol(props.symbol);

    return {
      icon,
      symbol_f,
      activatorText: ACTIVATOR_TEXT,
      tooltipText: TOOLTIP_TEXT,
    };
  },
});
</script>

<style lang="scss">
.un-modal-transaction-approve-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px 0;
  background: #1a327c;
  border-radius: 10px;

  &__text {
    max-width: 385px;
    margin-bottom: 6px;
    font-size: 15px;
    color: #739efa;
    text-align: center;
  }

  &__tooltip {
    font-size: 12px;
    font-weight: 500;
    color: white;
  }
}
</style>
