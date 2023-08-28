<template>
  <div
    :key="statusClass"
    class="un-badge"
    :class="[statusClass, {
      'is-in-range-with-bg': inRangeWithBg,
    }]"
  >
    <img
      v-if="outOfRange && !isClosed"
      v-svg-inline
      :src="require(`@/assets/images/icons/attention.svg`)"
      class="un-badge__status-icon"
    >
    <span v-if="inRange || isClosed" class="un-badge__status-icon" />
    <div class="un-badge__status-text" v-text="badgeText" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';


const POOL_STATUS = {
  IN_RANGE: 1,
  OUT_OF_RANGE: 2,
  CLOSED: 3,
} as const;

const POOL_STATUS_LABELS = {
  [POOL_STATUS.IN_RANGE]: 'In Range',
  [POOL_STATUS.OUT_OF_RANGE]: 'Out Of Range',
  [POOL_STATUS.CLOSED]: 'Closed',
  DEFAULT: 'Status',
} as const;

const POOL_STATUS_CLASSES = {
  [POOL_STATUS.IN_RANGE]: 'is-in-range is-status',
  [POOL_STATUS.OUT_OF_RANGE]: 'is-out-of-range is-status',
  [POOL_STATUS.CLOSED]: 'is-closed is-status',
  DEFAULT: '',
} as const;

export default defineComponent({
  name: 'UnBadge',
  props: {
    text: String,
    inRange: Boolean,
    inRangeWithBg: Boolean,
    outOfRange: Boolean,
    isClosed: Boolean,
  },
  setup(props) {
    const statusClass = computed(() => {
      if (props.isClosed) return POOL_STATUS_CLASSES[POOL_STATUS.CLOSED];
      if (props.inRange) return POOL_STATUS_CLASSES[POOL_STATUS.IN_RANGE];
      if (props.outOfRange) return POOL_STATUS_CLASSES[POOL_STATUS.OUT_OF_RANGE];
      return '';
    });

    const badgeText = computed(() => {
      if (props.isClosed && !props.text) return POOL_STATUS_LABELS[POOL_STATUS.CLOSED];
      if (props.inRange && !props.text) return POOL_STATUS_LABELS[POOL_STATUS.IN_RANGE];
      if (props.outOfRange && !props.text) return POOL_STATUS_LABELS[POOL_STATUS.OUT_OF_RANGE];
      return props.text;
    });

    return {
      statusClass,
      badgeText,
    };
  },
});
</script>

<style lang="scss">

.un-badge {
  $parent: &;

  &:not(.is-status) {
    padding: 2px 10px;
    font-size: 13px;
    font-weight: 600;
    color: $un-color-orange-1;
    border: 1px solid $un-color-orange-1;
    border-radius: 5px;
  }

  &__status-icon {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: 4px;
  }

  &.is-status {
    display: flex;
    align-items: center;
    font-size: 12px;
    line-height: 16px;

    @include media-gt(tablet) {
      font-size: 15px;
      line-height: 26px;
    }
  }

  &.is-in-range {
    font-weight: 600;

    &.is-in-range-with-bg {
      padding: 3px 6px;
      background: rgba(0, 211, 149, 0.1);
      border-radius: 25px;
    }

    #{$parent}__status-icon {
      width: 26px;
      height: 26px;
      background:
        radial-gradient(
          50% 50% at 50% 50%,
          rgba(1, 166, 117, 0.3) 0%,
          rgba(1, 166, 117, 0) 100%
        );
      border-radius: 100px;

      // stylelint-disable-next-line max-nesting-depth
      &::after {
        position: absolute;
        width: 6px;
        height: 6px;
        content: "";
        background:
          radial-gradient(
            50% 50% at 50% 50%,
            #fff 0%,
            #a9ffe6 100%
          );
        border-radius: 100%;
      }
    }
  }

  &.is-closed {
    #{$parent}__status-icon {
      width: 6px;
      height: 6px;
      margin-right: 13px;
      background: $un-color-soft-gray;
      border-radius: 100%;
    }
  }

  &.is-out-of-range {
    justify-content: center;
    padding: 7px 9px;
    margin: 0 0 3px;
    color: $un-color-tahiti-gold;
    background: rgba(228, 118, 27, 0.15);
    border-radius: 40px;

    @include media-gt(tablet) {
      padding: 3px 7px;
    }
  }

  &__status-text {
    width: 100%;
  }
}
</style>
