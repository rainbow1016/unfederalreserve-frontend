<template>
  <!-- eslint-disable vue/no-multiple-template-root -->

  <slot
    v-if="disabled"
    name="activator"
  >
    <span
      :style="$attrs.style"
      :class="$attrs.class"
      class="un-tooltip__activator"
      v-html="activatorText"
    />
  </slot>

  <div
    v-else
    :class="[$attrs.class, {
      'is-critical': critical,
      'is-block': block,
    }]"
    :style="$attrs.style"
    class="un-tooltip"
  >
    <div
      ref="activatorRef"
      :class="{
        'is-bordered': bordered,
        'is-blue': blue,
        'is-solid': solidBorder,
      }"
      class="un-tooltip__activator"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    >
      <slot name="activator">
        <span
          class="un-tooltip__activator"
          v-html="activatorText"
        />
      </slot>
    </div>

    <div
      ref="contentRef"
      :class="[{
        [side]: true,
        'is-active': isActive,
        'is-show': isShow,
        'is-critical': critical,
        'is-blue': blue,
        'is-block':block,
        'is-small-text': contentSmallText,
      }, contentClass]"
      :style="contentStyles"
      :data-testid="isActive ? 'tooltip-active' : 'tooltip'"
      class="un-tooltip__content"
    >
      <slot>
        <span
          data-testid="tooltip-content"
          v-html="contentText"
        />
      </slot>

      <slot name="content" />

      <div
        :style="arrowStyles"
        class="un-tooltip__arrow"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  PropType,
  CSSProperties,
  defineComponent,
  ref,
  computed,
  nextTick,
  onBeforeUnmount,
  watch,
} from 'vue';


const enum SideTypes {
  top = 'is-top',
  bottom = 'is-bottom',
}

const enum HandlerTypes {
  custom = 'custom',
  hover = 'hover',
}

const calculateSide = (activator: HTMLElement, content: HTMLElement, bottom: boolean) => {
  const activatorRect = activator.getBoundingClientRect();
  const contentRect = content.getBoundingClientRect();
  if (bottom) return SideTypes.bottom;
  return activatorRect.top < (contentRect.height + 80) ? SideTypes.bottom : SideTypes.top;
};

const calculateOffsetLeft = (activator: HTMLElement, content: HTMLElement) => {
  const activatorPos = activator.getBoundingClientRect();
  const contentPos = content.getBoundingClientRect();
  const viewportWidth = document.documentElement.clientWidth;
  const centerOfActivator = activatorPos.left + (activatorPos.width / 2);
  let offsetLeft = centerOfActivator - (contentPos.width / 2);

  if ((offsetLeft + contentPos.width) > (viewportWidth)) {
    offsetLeft = viewportWidth - contentPos.width - 15;
  } else if (offsetLeft < 0) {
    offsetLeft = 15;
  }

  return offsetLeft;
};

const calculateOffsetTop = (activator: HTMLElement, content: HTMLElement, side: SideTypes) => {
  const activatorPos = activator.getBoundingClientRect();
  const contentPos = content.getBoundingClientRect();

  if (side === SideTypes.top) {
    return activatorPos.top - (contentPos.height + 10);
  }

  return activatorPos.bottom + 10;
};

const calculateArrowOffsetLeft = (activator: HTMLElement) => {
  const activatorPos = activator.getBoundingClientRect();
  return activatorPos.left + (activatorPos.width / 2) - 5;
};

const calculateArrowOffsetTop = (activator: HTMLElement, side: SideTypes) => {
  const activatorPos = activator.getBoundingClientRect();

  if (side === SideTypes.bottom) {
    return activatorPos.bottom + 5;
  }

  return activatorPos.top - 10;
};

export default defineComponent({
  name: 'UnTooltip',
  inheritAttrs: false,
  props: {
    critical: Boolean,
    blue: {
      type: Boolean,
      default: true,
    },
    modelValue: Boolean,
    disabled: Boolean,
    bordered: Boolean,
    solidBorder: Boolean,
    block: Boolean,
    activatorText: String,
    contentText: String,
    contentClass: [Object, String, Array],
    contentSmallText: Boolean,
    bottom: Boolean,
    contentWidth: {
      type: String,
    },
    handler: {
      type: String as PropType<HandlerTypes>,
      default: HandlerTypes.hover,
    },
    contentMinWidth: {
      type: String,
      default: '240px',
    },
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const activatorRef = ref<HTMLElement>();
    const contentRef = ref<HTMLElement>();
    const isActive = ref(false);
    const isShow = ref(false);
    const contentOffsetLeft = ref(0);
    const contentOffsetTop = ref(0);
    const arrowOffsetLeft = ref(0);
    const arrowOffsetTop = ref(0);
    const side = ref<SideTypes>(SideTypes.top);

    const contentStyles = computed(() => {
      const left = contentOffsetLeft.value && `${contentOffsetLeft.value}px`;
      const top = contentOffsetTop.value && `${contentOffsetTop.value}px`;

      const styles: CSSProperties = {
        width: props.contentWidth,
        minWidth: props.contentMinWidth,
        left,
        top,
      };
      return styles;
    });

    const arrowStyles = computed(() => {
      const left = arrowOffsetLeft.value && `${arrowOffsetLeft.value}px`;
      const top = arrowOffsetTop.value && `${arrowOffsetTop.value}px`;

      const styles: CSSProperties = {
        left,
        top,
      };
      return styles;
    });

    const open = async () => {
      isActive.value = true;
      await nextTick();
      if (!activatorRef.value || !contentRef.value) return;

      document.body.appendChild(contentRef.value);
      side.value = calculateSide(activatorRef.value, contentRef.value, props.bottom);
      contentOffsetLeft.value = calculateOffsetLeft(activatorRef.value, contentRef.value);
      contentOffsetTop.value = calculateOffsetTop(activatorRef.value, contentRef.value, side.value);
      arrowOffsetLeft.value = calculateArrowOffsetLeft(activatorRef.value);
      arrowOffsetTop.value = calculateArrowOffsetTop(activatorRef.value, side.value);
      isShow.value = true;
      ctx.emit('update:modelValue', true);
    };

    const close = () => {
      if (contentRef.value && isShow.value) {
        document.body.removeChild(contentRef.value);
      }

      isShow.value = false;
      ctx.emit('update:modelValue', false);
      isActive.value = isShow.value;
    };

    const onMouseEnter = () => {
      if (props.handler === HandlerTypes.custom) return;
      void open();
    };

    const onMouseLeave = () => {
      if (props.handler === HandlerTypes.custom) return;
      void close();
    };

    const onScroll = () => {
      if (!isActive.value) return;
      void open();
    };

    watch(() => props.modelValue, (value) => {
      if (props.handler !== HandlerTypes.custom) return;

      if (value) {
        void open();
      } else {
        void close();
      }
    }, { immediate: true });

    watch(() => props.handler, (value) => {
      if (value !== HandlerTypes.custom) return;
      void close();
    }, { immediate: true });

    watch(() => props.disabled, (value) => {
      if (!value) return;
      void close();
    });

    window.addEventListener('scroll', onScroll, { passive: true });

    window.addEventListener('orientationchange', close);

    window.addEventListener('touchstart', close);

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', onScroll);

      window.removeEventListener('orientationchange', close);

      window.removeEventListener('touchstart', close);

      if (contentRef.value && isShow.value) {
        document.body.removeChild(contentRef.value);
      }
    });

    return {
      isActive,
      isShow,
      activatorRef,
      contentRef,
      contentStyles,
      arrowStyles,
      side,
      onMouseEnter,
      onMouseLeave,
    };
  },
});
</script>

<style lang="scss">
.un-tooltip {
  $root: &;

  display: inline-flex;

  &.is-block {
    display: block;
  }

  &__activator {
    display: flex;
    cursor: default;

    &.is-bordered {
      border-bottom: 1px dashed #739efa;
    }

    &.is-solid.is-bordered {
      border-bottom: 1px solid white;
    }
  }

  &__arrow {
    position: fixed;
    z-index: 1;
    width: 0;
    height: 0;
    border-color: $un-color-white;
    border-style: solid;
    border-right-color: transparent;
    border-left-color: transparent;
  }

  &__content {
    position: fixed;
    z-index: $un-z-index-tooltip;
    display: none;
    padding: 14px;
    font-size: 14px;
    font-weight: 400;
    line-height: 21px;
    color: $un-color-text-black;
    text-align: left;
    background-color: $un-color-white;
    border-radius: 8px;
    box-shadow: 0 4px 30px rgba(76, 92, 109, 0.15);
    opacity: 0;
    transition: opacity 0.3s;

    &.is-top {
      #{$root}__arrow {
        border-width: 5px 5px 0 5px;
        border-bottom-color: transparent;
      }
    }

    &.is-bottom {
      #{$root}__arrow {
        border-width: 0 5px 5px 5px;
        border-top-color: transparent;
      }
    }

    &.is-active {
      display: block;
    }

    &.is-show {
      opacity: 1;
    }

    &.is-critical {
      color: $un-color-white;
      background-color: $un-color-critical;

      #{$root}__arrow {
        border-color: $un-color-critical;
        border-right-color: transparent;
        border-left-color: transparent;
      }
    }

    &.is-blue {
      font-size: 13px;
      color: $un-color-white;
      background-color: #091844;

      #{$root}__arrow {
        border-color: #091844;
        border-right-color: transparent;
        border-left-color: transparent;
      }
    }

    &.is-small-text {
      font-size: 13px;
      line-height: 19px;
    }
  }
}
</style>
