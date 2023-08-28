<template>
  <div
    class="un-input"
    :class="{
      'is-light': light,
      'is-dark': dark,
      'is-small': small,
      'is-input-text-right': inputTextRight,
      'is-input-text-left': inputTextLeft,
      'is-label-dark': labelDark,
    }"
  >
    <label
      v-if="label"
      class="un-input__label"
      v-text="label"
    />

    <input
      ref="inputRef"
      :type="type"
      :name="name"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :value="modelValue"
      :style="{ fontSize }"
      :autofocus="disabled ? null : autofocus"
      :disabled="disabled"
      class="un-input__input"
      data-testid="value-input"
      @input="onInput"
      @change="onChange"
      @cut="onInput()"
      @keypress="onCheckRule"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
    >
  </div>
</template>

<script lang="ts">
/* eslint no-nested-ternary: 0 */

// eslint-disable-next-line object-curly-newline
import { computed, defineComponent, ref, onMounted, watch } from 'vue';
import { useBreakpoints } from '@/composable';


const createValueRule = (length: number) => new RegExp(
  [
    '^\\.$',
    `^\\d+(\\.\\d{0,${length}})?$`,
  ].join('|'),
  'gm',
);

const createValuePercentRule = (length: number) => new RegExp(
  [
    '^\\.$',
    '^\\-$',
    `^\\-?\\d+(\\.\\d{0,${length}})?%?$`,
  ].join('|'),
  'gm',
);

const SMALL_INPUT_FONT_SIZE = 28;

export default defineComponent({
  name: 'UnInput',
  props: {
    label: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    fontChange: {
      type: Boolean,
      default: true,
    },
    decimals: {
      type: Number,
      required: true,
    },
    autofocus: Boolean,
    disabled: Boolean,
    placeholder: String,
    percentage: Boolean,
    inputTextRight: Boolean,
    inputTextLeft: Boolean,
    labelDark: Boolean,
    name: String,
    light: Boolean,
    small: Boolean,
    dark: Boolean,
    modelValue: [String, Number],
  },
  emits: [
    'update:modelValue',
    'change',
    'focus',
    'blur',
    'update:target',
  ],
  setup: (props, ctx) => {
    const inputRef = ref<HTMLInputElement>();
    const { isTablet } = useBreakpoints();

    const fontSize = computed(() => {
      const length = props.modelValue?.toString().length || 0;

      const font = props.small ? 24 : 50;
      let result = font;
      if (props.fontChange) {
        result = (
          length < 12 ? font
            : length < 15 ? (font * 0.9)
              : length < 18 ? (font * 0.8)
                : length < 24 ? (font * 0.7)
                  : length < 28 ? (font * 0.6)
                    : length < 30 ? (font * 0.5)
                      : (font * 0.4)
        );
      }

      if (props.label) {
        result *= 0.9;
      }

      if (isTablet.value) {
        result *= 0.75;
      }

      if (props.small) {
        result = result > SMALL_INPUT_FONT_SIZE ? SMALL_INPUT_FONT_SIZE
          : (result > 18 && result <= 24) ? 20
            : (result < 13) ? 13
              : result;
      }

      return `${result}px`;
    });

    const onCheck = (value: string) => {
      const regexp = props.percentage
        ? createValuePercentRule(props.decimals)
        : createValueRule(props.decimals);
      return regexp.test(value);
    };

    const onCheckRule = (event: KeyboardEvent) => {
      const isValid = onCheck(event.key);

      if (isValid) return true;
      return event.preventDefault();
    };

    type IInputEvent = { target: HTMLInputElement };

    const getValueFromInputEvent = (event?: IInputEvent) => {
      const value = event?.target.value || '';
      const isValid = onCheck(value);

      if (!isValid && event && value) {
        // eslint-disable-next-line no-param-reassign
        event.target.value = props.modelValue?.toString() || '';
        return null;
      }

      let valueValid = value;

      if (value === '.') {
        valueValid = '0.';
      } else if (props.modelValue !== '0.' && /^0+$/.test(value)) {
        valueValid = '0.';
      }

      if (event) {
        // eslint-disable-next-line no-param-reassign
        event.target.value = valueValid;
      }

      return valueValid;
    };

    const onInput = (event?: IInputEvent) => {
      const valueValid = getValueFromInputEvent(event);
      ctx.emit('update:target', event?.target);
      if (valueValid === null) return;
      ctx.emit('update:modelValue', valueValid);
    };

    const onChange = (event?: IInputEvent) => {
      ctx.emit('update:target', event?.target);
      const valueValid = getValueFromInputEvent(event) ?? props.modelValue;
      ctx.emit('change', valueValid);
    };

    onMounted(() => {
      if (props.autofocus) {
        inputRef.value?.focus();
      }
    });

    watch(() => props.modelValue, () => {
      ctx.emit('update:target', inputRef.value);
    });

    return {
      inputRef,
      fontSize,
      maxlength: 18 + 1 + props.decimals,

      onCheckRule,
      onInput,
      onChange,
    };
  },
});
</script>

<style lang="scss">
.un-input {
  $root: &;

  display: flex;
  align-items: center;
  width: 100%;

  &__input {
    width: 100%;
    font-family: inherit;
    font-weight: 600;
    text-align: center;
    background-color: transparent;
    border: none;
    border-width: 0;
    outline: none;

    &:focus {
      outline: none;
    }

    #{$root}.is-light & {
      color: $un-color-normal;

      &::placeholder {
        color: $un-color-solitude;
      }
    }

    #{$root}.is-small & {
      color: #fff;

      &::placeholder {
        color: #739efa;
      }
    }

    #{$root}.is-dark & {
      color: $un-color-dark-turquoise;

      &::placeholder {
        color: $un-color-blue-6;
      }
    }

    #{$root}.is-input-text-right & {
      text-align: end;
    }

    #{$root}.is-input-text-left & {
      text-align: start;
    }
  }

  &__label {
    font-size: 16px;
    font-weight: 300;
    line-height: 26px;
    color: $un-color-soft-gray;
    text-align: left;

    @include media-lt(tablet-xs) {
      font-size: 14px;
    }

    #{$root}.is-label-dark & {
      font-size: 12px;
      font-weight: 500;
      line-height: 100%;
    }
  }
}
</style>
