<template>
  <UnCard
    :to="to"
    :transparent-dark="!active || pending"
    :neon="active && !pending"
    no-padding
    :class="{
      'is-active': active,
      'is-pending': pending,
      'is-normal': normal,
    }"
    class="pool-position"
  >
    <div class="pool-position__row">
      <!-- Left -->

      <div class="pool-position__col">
        <UnSkeleton
          v-if="skeleton"
          :width="isDesktop ? '243px' : '100px'"
          class="pool-position__skeleton pool-position__token-details"
        />

        <div v-else class="pool-position__token-details">
          <UnToken
            :icons="[tokenA.icon, tokenB.icon]"
            :symbol="`${tokenA.symbol}/${tokenB.symbol}`"
            class="pool-position__token"
          />

          <div
            class="pool-position__fee"
            v-text="feeAmount"
          />
        </div>

        <div v-if="pending" class="pool-position__details">
          <span class="pool-position__details-title">Pending...</span>
        </div>

        <div v-else-if="!skeleton" class="pool-position__details">
          <span class="pool-position__details-title">Min: </span>
          <div class="pool-position__details-text-wrap">
            <span
              class="pool-position__details-text"
              v-text="minPrice"
            />
            <span
              class="pool-position__details-text"
              v-text="minMaxLabel"
            />
          </div>
          <img
            v-svg-inline
            src="@/assets/images/icons/arrows.svg"
            class="pool-position__details-arrows"
          >
          <span class="pool-position__details-title">Max: </span>
          <div class="pool-position__details-text-wrap">
            <span
              class="pool-position__details-text"
              v-text="maxPrice"
            />
            <span
              class="pool-position__details-text"
              v-text="minMaxLabel"
            />
          </div>
        </div>

        <div v-if="skeleton" class="pool-position__skeleton-wrap">
          <UnSkeleton
            width="138px"
            class="pool-position__skeleton"
          />

          <UnSkeleton
            width="138px"
            class="pool-position__skeleton"
          />
        </div>
      </div>

      <!-- Right: status -->

      <div class="pool-position__col is-status">
        <span
          v-if="!pending"
          class="pool-position__status-title"
          v-text="'Status'"
        />

        <UnLoaderCircle
          v-if="pending"
          medium
          class="pool-position__loading"
        />

        <UnSkeleton
          v-else-if="skeleton"
          :height="isDesktop ? '26px' : '15px'"
          :width="isDesktop ? '138px' : '100px'"
          class="pool-position__skeleton pool-position__status"
        />

        <UnBadge
          v-else
          :in-range="inRange"
          :out-of-range="!inRange"
          :is-closed="isClosed"
          class="pool-position__status"
        />
      </div>

      <!--  -->
    </div>
  </UnCard>
</template>

<script lang="ts">
import { PropType, computed, defineComponent } from 'vue';
import { useBreakpoints } from '@/composable';
import { ROUTE_POOL_POSITION } from '@/helpers/enums/routes';
import { formatPercentDisplay } from '@/helpers/formatters';
import { IPositionData } from '@/types/common.d';

import UnCard from '@/components/ui/UnCard.vue';
import UnToken from '@/components/common/UnToken.vue';
import UnBadge from '@/components/ui/UnBadge.vue';
import UnSkeleton from '@/components/ui/UnSkeleton.vue';
import UnLoaderCircle from '@/components/ui/UnLoaderCircle.vue';


export default defineComponent({
  name: 'PoolPosition',
  components: {
    UnCard,
    UnToken,
    UnBadge,
    UnSkeleton,
    UnLoaderCircle,
  },
  props: {
    active: Boolean,
    normal: Boolean,
    skeleton: Boolean,
    pending: Boolean,
    tokenA: {
      type: Object as PropType<IPositionData['tokenA']>,
      required: true,
      validator: (prop: IPositionData) => (
        prop
        && 'icon' in prop
        && 'symbol' in prop
      ),
    },
    tokenB: {
      type: Object as PropType<IPositionData['tokenB']>,
      required: true,
      validator: (prop: IPositionData) => (
        prop
        && 'icon' in prop
        && 'symbol' in prop
      ),
    },
    tokenId: {
      type: String,
    },
    fee: {
      type: Number,
    },
    minPrice: {
      type: String,
      required: true,
    },
    maxPrice: {
      type: String,
      required: true,
    },
    inRange: {
      type: Boolean,
      required: true,
    },
    isClosed: {
      type: Boolean,
      required: true,
    },
  },
  setup: (props) => {
    const { isDesktop } = useBreakpoints();

    const minMaxLabel = computed(() => [
      props.tokenA.symbol,
      props.tokenB.symbol,
    ].join(' per '));

    const feeAmount = computed(() => (
      props.fee ? formatPercentDisplay(props.fee / 10_000) : '-'
    ));

    return {
      isDesktop,
      minMaxLabel,
      feeAmount,
      to: props.tokenId && {
        name: ROUTE_POOL_POSITION,
        params: {
          tokenId: props.tokenId,
        },
      },
    };
  },
});
</script>

<style lang="scss">
.pool-position {
  $root: &;

  position: relative;
  display: block;
  color: $un-color-soft-gray;
  text-decoration: none;

  &.is-normal {
    color: white;
  }

  &.is-active {
    color: $un-color-blue-4;
  }

  &__row {
    padding: 19px 15px 18px;

    @include media-gt(tablet) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 19px 29px 16px;
    }
  }

  &__col {
    display: flex;
    flex-direction: column;

    @include media-lt(tablet) {
      width: 100%;
    }

    &.is-status {
      @include media-gt(tablet) {
        min-width: 135px;
      }
    }
  }

  &__token-details {
    display: flex;
    align-items: center;
    margin-bottom: 24px;

    @include media-gt(tablet) {
      margin-bottom: 10px;
    }
  }

  &__token {
    margin-right: 7px;

    #{$root}.is-active & {
      color: $un-color-white;
    }

    @include media-lt(tablet) {
      .un-token__icon {
        max-width: 17px;
        max-height: 17px;
      }
    }
  }

  &__fee {
    display: none;
    align-items: center;
    padding: 4px 12px;
    font-size: 14px;
    color: white;
    background-color: rgba(100, 136, 255, 0.11);
    border-radius: 25px;

    @include media-gt(tablet) {
      display: inline-flex;
    }
  }

  &__details {
    display: flex;
    align-items: center;
    font-size: 13px;
    font-weight: 500;
    line-height: 19px;

    @include media-lt(tablet) {
      margin: 0 auto;
    }
  }

  &__details-text {
    & + & {
      @include media-gt(tablet) {
        margin-left: 5px;
      }
    }

    @include media-lt(tablet) {
      font-size: 16px;
      line-height: 100%;
    }

    #{$root}.is-active & {
      color: $un-color-white;
    }
  }

  &__details-text-wrap {
    display: flex;
    flex-wrap: wrap;

    @include media-lt(tablet) {
      display: flex;
      flex-direction: column;
      text-align: center;
    }
  }

  &__details-title {
    margin-right: 5px;

    #{$root}.is-active & {
      color: #739efa;
    }

    @include media-lt(tablet) {
      display: none;
    }
  }

  &__details-arrows {
    width: 35px;
    height: 14px;
    margin: 0 7px 0 8px;

    @include media-gt(tablet) {
      width: 20px;
      height: 8px;
    }
  }

  &__status-title {
    display: none;
    font-size: 12px;
    line-height: 26px;

    @include media-gt(tablet) {
      display: block;
    }
  }

  &__status {
    @include media-lt(tablet) {
      position: absolute;
      top: 12px;
      right: 15px;
    }

    @include media-gt(tablet) {
      margin: 3px 0 6px;
    }

    @include media-lte(desktop) {
      &#{$root}__skeleton {
        margin: 9px 0 11px;
      }
    }
  }

  &__loading {
    margin: auto 0 auto auto;
  }

  &__skeleton-wrap {
    display: flex;
    align-items: center;
    justify-content: center;

    #{$root}__skeleton + #{$root}__skeleton {
      margin-left: 15px;
    }

    @include media-lte(tablet) {
      margin: 9px 0 10px;
    }
  }
}
</style>
