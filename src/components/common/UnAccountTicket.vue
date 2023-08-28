<template>
  <!-- eslint-disable vue/no-v-model-argument -->

  <div class="un-account-ticket">
    <div
      v-if="title || withTabs"
      class="un-account-ticket__header"
      :class="{'is-flex':(withTabs && tabsRight && !withAdvanced)}"
    >
      <h5
        v-if="title"
        class="un-account-ticket__header-title"
        v-text="title"
      />
      <div class="un-account-ticket__tabs-wrap">
        <UnTabs
          v-if="withTabs"
          :model-value="currentTab"
          :options="tabOptions"
          dense
          full-as-switch
          full
          class="un-account-ticket__tabs"
          @update:model-value="onChangeTab"
        />
        <UnSwitch
          v-if="withAdvanced"
          :model-value="advanceMode"
          label="Advance Mode"
          class="un-account-ticket__switch"
          data-testid="advanced-mode-switch"
          @update:model-value="$emit('update:advanceMode', $event)"
        />
      </div>
    </div>

    <div class="un-account-ticket__price-wrap">
      <UnAccountTicketPriceCard
        v-for="info in tokensDataInfo.info"
        :key="info.title"
        :value="info.value"
        :value_f="info.value_f"
        :percent="info.percent"
        :percent_f="info.percent_f"
        :token-data="info"
        :disabled="!advanceMode"
        :token-price="info.tokenPrice"
        :data-testid="`${info.title}-card`"
        class="un-account-ticket__price"
        @update:value="onUpdateInfo(info, $event)"
        @decrement="$emit(inverted ? 'increment' : 'decrement', info.type)"
        @increment="$emit(inverted ? 'decrement' : 'increment', info.type)"
      />
    </div>

    <template v-for="item in bottomInfo" :key="item.label">
      <div class="un-account-ticket__info">
        <div
          class="un-account-ticket__info-name"
          data-testid="info-name"
          v-text="item.label"
        />
        <div class="un-account-ticket__info-value-wrap">
          <div
            class="un-account-ticket__info-value"
            data-testid="info-value"
            v-text="item.value"
          />
          <div
            v-if="item.subvalue"
            class="un-account-ticket__info-subvalue"
            v-text="item.subvalue"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line object-curly-newline
import { defineComponent, ref, computed, PropType } from 'vue';
import { PoolToken } from '@/types/common.d';
import { createPoolTokensDataInfo } from '@/views/PoolAddLiquidity/utils';
import { POOL_SUPPORTED_FEES } from '@/helpers/enums/pools';
import { formatToCurrencyDisplay } from '@/helpers/formatters';

import UnTabs from '@/components/ui/UnTabs.vue';
import UnSwitch from '@/components/ui/UnSwitch.vue';
import UnAccountTicketPriceCard from './UnAccountTicketPriceCard.vue';


type IInfo = ReturnType<typeof createPoolTokensDataInfo>['info'][number];

export default defineComponent({
  name: 'UnAccountTicket',
  components: {
    UnTabs,
    UnSwitch,
    UnAccountTicketPriceCard,
  },
  props: {
    tokenA: {
      type: Object as PropType<PoolToken>,
      required: true,
    },
    tokenB: {
      type: Object as PropType<PoolToken>,
      required: true,
    },
    fee: {
      type: Number as PropType<typeof POOL_SUPPORTED_FEES[number]>,
      required: true,
      validator: (prop: typeof POOL_SUPPORTED_FEES[number]) => (
        POOL_SUPPORTED_FEES.includes(prop)
      ),
    },
    tokenPrice: {
      type: String as PropType<`${number}`>,
      required: true,
    },
    leftRange: {
      type: String as PropType<`${number}`>,
      required: true,
    },
    rightRange: {
      type: String as PropType<`${number}`>,
      required: true,
    },
    title: String,
    withTabs: Boolean,
    withAdvanced: Boolean,
    advanceMode: Boolean,
    tabsRight: Boolean,
    disabled: Boolean,
  },
  emits: [
    'update:leftRange',
    'update:rightRange',
    'update:advanceMode',
    'decrement',
    'increment',
  ],
  setup(props, ctx) {
    const inverted = ref(false);

    const tabOptions = computed(() => [
      props.tokenA.symbol,
      props.tokenB.symbol,
    ].map((value) => ({ label: value, value })));

    const currentTab = computed(() => {
      const options = tabOptions.value[inverted.value ? 1 : 0];
      return options;
    });

    const tokensDataInfo = computed(() => (
      createPoolTokensDataInfo(
        props.tokenA,
        props.tokenB,
        props.fee,
        props.tokenPrice,
        props.leftRange,
        props.rightRange,
        inverted.value,
      )));

    const bottomInfo = computed(() => [
      {
        label: 'Current Price:',
        value: tokensDataInfo.value.tokenPrice,
        subvalue: formatToCurrencyDisplay(tokensDataInfo.value.tokenPriceUsd),
      },
      {
        label: 'Commission:',
        value: tokensDataInfo.value.commission,
      },
    ]);

    const onChangeTab = () => {
      inverted.value = !inverted.value;
    };

    // we have update value even if we change percent
    // (it's recalculated in unAccountTicket)
    const onUpdateInfo = (info: IInfo, val: string) => {
      const value = inverted.value ? (1 / +val).toFixed(18) : val;
      ctx.emit(`update:${info.type}`, value);
    };

    return {
      inverted,
      tokensDataInfo,
      bottomInfo,

      tabOptions,
      currentTab,
      onChangeTab,
      onUpdateInfo,
    };
  },
});
</script>

<style lang="scss">
.un-account-ticket {
  $root: &;

  &__info {
    display: flex;
    justify-content: space-between;
    line-height: 100%;

    &:not(:last-child) {
      margin: 0 0 15px;
    }

    &.is-total {
      padding: 14px 0 0;
      border-top: 1px solid #244199;
    }

    &-name {
      font-size: 14px;
    }
  }

  &__info-value {
    font-size: 14px;
    font-weight: 600;

    @include media-gt(tablet) {
      font-size: 16px;
    }

    &-wrap {
      text-align: end;
    }
  }

  &__info-subvalue {
    margin: 10px 0 16px;
    font-size: 14px;
    line-height: 100%;
  }

  &__header-title {
    font-size: 18px;
    font-weight: 500;
    line-height: 144%;
  }

  &__header {
    margin-bottom: 16px;

    @include media-gt(tablet) {
      margin-bottom: 25px;
    }

    &.is-flex {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &:not(.is-flex) {
      #{$root}__header-title {
        margin-bottom: 14px;
      }
    }
  }

  &__tabs-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__tabs {
    font-size: 13px;
    font-weight: 500;
    line-height: 100%;
  }

  &__price-wrap {
    display: flex;
    justify-content: space-between;
    margin-bottom: 23px;

    @include media-gt(tablet) {
      margin-bottom: 30px;
    }
  }

  &__price {
    width: calc(50% - 5px);

    @include media-gt(tablet) {
      width: calc(50% - 11px);
    }
  }
}
</style>
