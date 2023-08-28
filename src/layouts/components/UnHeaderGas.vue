<template>
  <UnHeaderCard class="un-header-gas">
    <UnDropdown
      dark
      transparent
      dropdown-right
      :arrow-right="8"
      :disabled="!gasEstimate"
      :min-items-width="isDesktopMD ? 340 : 254"
      class="un-header-gas__dropdown"
    >
      <template #selected>
        <img
          v-svg-inline
          src="@/assets/images/icons/gas.svg"
          class="un-header-gas__icon"
        >

        <UnLoaderCircle
          v-if="!gasEstimate"
          small
          class="un-header-gas__value"
        />

        <span
          v-else
          class="un-header-gas__value"
          v-text="gasSelected.value"
        />
      </template>

      <template #listItem>
        <div
          class="un-header-gas__gas-setting"
          v-text="'Possible Gas Settings'"
        />
        <div v-if="gasOptions" class="un-header-gas__gas-wrap">
          <div
            v-for="item in gasOptions"
            :key="item"
            class="un-header-gas__gas-item"
          >
            <div
              class="un-header-gas__gas-title"
              v-text="item.title"
            />
            <div
              class="un-header-gas__gas-value"
              v-text="item.value_f"
            />
          </div>
        </div>
      </template>
    </UnDropdown>
  </UnHeaderCard>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { GAS_OPTIONS_LABELS, GAS_OPTIONS, GAS_OPTIONS_TYPE_NAMES } from '@/helpers/enums/gas';
import { useGasPrice } from '@/store';
import { useBreakpoints } from '@/composable';

import UnLoaderCircle from '@/components/ui/UnLoaderCircle.vue';
import UnDropdown from '@/components/ui/UnDropdown.vue';
import UnHeaderCard from './UnHeaderCard.vue';


export default defineComponent({
  name: 'UnHeaderGas',
  components: {
    UnLoaderCircle,
    UnDropdown,
    UnHeaderCard,
  },
  setup() {
    const selected = ref<keyof typeof GAS_OPTIONS_LABELS>(GAS_OPTIONS.STANDARD);
    const { data: gasEstimate } = useGasPrice();

    const { isDesktopMD } = useBreakpoints();

    const gasOptions = computed(() => (['STANDARD', 'FAST', 'INSTANT'] as const).map((key) => {
      const id = GAS_OPTIONS[key];
      const value = gasEstimate.value ? gasEstimate.value[GAS_OPTIONS_TYPE_NAMES[id]] / 10 : 0;

      return {
        id,
        title: GAS_OPTIONS_LABELS[id],
        value,
        value_f: `(${value} Gwei)`,
        active: selected.value === id,
      };
    }));

    const gasSelected = computed(() => (
      gasOptions.value.find((_) => _.active)
    ));

    return {
      gasEstimate,
      gasSelected,
      gasOptions,
      isDesktopMD,
    };
  },
});
</script>

<style lang="scss">
.un-header-gas {
  padding: 0 0 0 5px;
  padding: 0 10px;

  &__icon {
    width: 14px;
    margin-right: 7px;
  }

  &__value {
    margin-right: 20px;
  }

  &__dropdown {
    width: 100%;
  }

  &__gas {
    $gas: &;

    &-setting {
      margin: 2px 18px 12px;
    }

    &-setting,
    &-wrap {
      font-size: 13px;
      font-weight: 500;
      line-height: 100%;
    }

    &-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 10px;
    }

    &-item {
      flex: 1;
      width: calc(33% - 2px);
      min-height: 55px;
      padding: 10px 0;
      text-align: center;
      border: 1px solid #2845a0;
      border-radius: 8px;
      transition: all 0.3s;

      &.is-active {
        background: #37f;
        border: 1px solid #37f;
        border-radius: 8px;

        #{$gas}-value {
          color: #fff;
        }
      }
    }

    &-title {
      margin-bottom: 7px;
    }

    &-value {
      color: #739efa;
    }
  }
}
</style>
