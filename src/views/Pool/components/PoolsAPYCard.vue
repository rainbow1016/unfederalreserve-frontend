<template>
  <UnCard
    transparent-dark
    no-padding
    class="pools-apy-card"
  >
    <div class="pools-apy-card__title-wrap">
      <UnSkeleton
        v-if="skeleton"
        height="20px"
        width="80%"
        style="margin-bottom: 12px;"
      />

      <UnToken
        v-else
        :symbols="symbols"
        :symbol="symbol"
        small
        class="pools-apy-card__token"
      />

      <a
        v-if="!skeleton"
        :href="infoLink"
        target="_blank"
        class="pools-apy-card__info-link"
      >
        Info
        <img
          v-svg-inline
          :src="require('@/assets/images/icons/external-link.svg')"
          class="pools-apy-card__info-icon"
        >
      </a>
    </div>

    <div class="un-row no-gap">
      <div class="un-col-2 pools-apy-card__apy">
        <UnSkeleton
          v-if="skeleton"
          height="16px"
          width="64px"
        />
        <span
          v-else
          v-text="'APY'"
        />
      </div>

      <div class="un-col-auto">
        <UnSkeleton
          v-if="skeleton"
          height="25px"
          width="90px"
        />
        <UnTooltip
          v-else
          :content-text="tooltipText"
          :disabled="!percent"
          content-width="196px"
          content-min-width="196px"
          bordered
        >
          <template #activator>
            <span
              :class="{ 'is-empty': !percent }"
              class="pools-apy-card__percent"
              v-text="percent || 'Not Enough Data'"
            />
          </template>
        </UnTooltip>
      </div>
    </div>
  </UnCard>
</template>

<script lang="ts">
import { PropType, computed, defineComponent } from 'vue';
import { formatPercentDisplay } from '@/helpers/formatters';
import { TPool } from '@/services/getErsdlPoolAPY';

import UnCard from '@/components/ui/UnCard.vue';
import UnToken from '@/components/common/UnToken.vue';
import UnTooltip from '@/components/ui/UnTooltip.vue';
import UnSkeleton from '@/components/ui/UnSkeleton.vue';

export default defineComponent({
  name: 'PoolsAPYCard',
  components: {
    UnCard,
    UnToken,
    UnTooltip,
    UnSkeleton,
  },
  props: {
    skeleton: Boolean,
    token0: {
      type: Object as PropType<TPool['token0']>,
      required: true,
    },
    token1: {
      type: Object as PropType<TPool['token1']>,
      required: true,
    },
    apy: {
      type: Number,
    },
    infoLink: {
      type: String,
    },
    days: {
      type: Number,
      required: true,
    },
  },
  setup: (props) => {
    const symbols = computed(() => [
      props.token0.symbol.replace('WETH', 'ETH'),
      props.token1.symbol.replace('WETH', 'ETH'),
    ]);

    const symbol = computed(() => (
      symbols.value.join('/')
    ));

    const percent = computed(() => (
      props.apy && formatPercentDisplay(100 * props.apy)
    ));

    const tooltipText = computed(() => (
      `APY is based on the data for the past ${props.days} days.`
    ));

    return {
      symbols,
      symbol,
      percent,
      tooltipText,
    };
  },
});
</script>

<style lang="scss">
.pools-apy-card {
  padding: 20px;

  &__apy {
    display: flex;
    align-items: center;
    font-size: 14px;
  }

  &__percent {
    display: flex;
    align-items: center;
    height: 32px;
    font-size: 25px;
    font-weight: 600;

    &.is-empty {
      font-size: 16px;
      color: #6a91e6;
    }
  }

  &__info {
    &-link {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #00d395;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.4s ease-in-out;

      &:hover {
        text-decoration: underline;
      }
    }

    &-icon {
      width: 13px;
      margin-left: 3px;
      color: #00d395;
    }
  }

  &__title-wrap {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }
}
</style>
