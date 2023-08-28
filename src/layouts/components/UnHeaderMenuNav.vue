<template>
  <ul class="un-header-menu-nav">
    <li
      v-for="(item, index) in menuList"
      :key="index"
      :class="item.class"
      class="un-header-menu-nav__item"
    >
      <component
        :is="item.to ? 'router-link' : 'a'"
        :to="item.to"
        :href="item.href"
        :target="item.href ? '_blank' : null"
        :data-testid="`${item.label.toLowerCase()}-link`"
        class="un-header-menu-nav__link un-link"
        @click="$emit('click')"
        v-text="item.label"
      />
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  ROUTE_DASHBOARD,
  ROUTE_MARKETS,
  ROUTE_POOL,
  ROUTE_LEND,
  ROUTE_LIQUIDATED,
} from '@/helpers/enums/routes';


const MENU_LIST = [
  {
    label: 'Dashboard',
    to: { name: ROUTE_DASHBOARD },
    class: 'is-hidden-on-desktop',
  },
  {
    label: 'Lending',
    to: { name: ROUTE_LEND },
  },
  /*
  {
    label: 'Farm',
    to: { name: ROUTE_POOL },
  },
  */
  {
    label: 'Pools',
    to: { name: ROUTE_POOL },
  },
  {
    label: 'Markets',
    to: { name: ROUTE_MARKETS },
  },
  {
    label: 'Liquidations',
    to: { name: ROUTE_LIQUIDATED },
  },
  {
    label: 'Education Center',
    href: process.env.VUE_APP_DOCS_LINK,
  },
];

export default defineComponent({
  name: 'UnHeaderMenuNav',
  emits: ['click'],
  setup() {
    return {
      menuList: MENU_LIST,
    };
  },
});
</script>

<style lang="scss">
.un-header-menu-nav {
  display: flex;
  align-items: flex-end;

  @include media-lte(desktop-md) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 0 0 0;
  }

  &__item {
    margin: 0 12px;

    &.is-hidden-on-desktop {
      @include media(desktop-md) {
        display: none;
      }
    }

    @include media-lte(desktop-lg) {
      margin: 0 4px;
    }

    @include media-lte(desktop-md) {
      width: 100%;
      height: 51px;
      margin: 0;
    }
  }

  &__link {
    position: relative;
    padding: 0 5px;
    font-size: 13px;
    font-weight: 500;
    color: $un-color-white;
    border-bottom: none;
    transition: color 0.3s;

    @include media-lte(desktop-md) {
      width: 100%;
      height: 100%;
      padding: 17px 0 17px 32px;
      font-size: 18px;
      font-weight: 500;
      color: #84adfe;
    }

    &::before {
      position: absolute;
      right: 0;
      bottom: -17px;
      left: 0;
      width: 100%;
      height: 3px;
      visibility: hidden;
      content: "";
      background-color: $un-color-white;
      border-radius: 10px;
      opacity: 0;
      transition: bottom 0.3s;

      @include media-lte(desktop-md) {
        top: 0;
        width: 5px;
        height: 100%;
        background-color: #4f76ff;
        border-radius: 0;
      }
    }

    &:hover {
      @include media(desktop-md) {
        color: $un-color-white;
        border-bottom: none;
        opacity: 1;
      }

      @include media-lte(desktop-md) {
        color: #8193a8;
      }

      &::before {
        @include media(desktop-md) {
          visibility: visible;
          opacity: 1;
        }
      }
    }

    &.router-link-active {
      opacity: 1;

      @include media-lte(desktop-md) {
        color: white;
        background: linear-gradient(90deg, rgba(79, 118, 255, 0.3) 9.36%, rgba(79, 118, 255, 0.08) 100%);
      }

      &::before {
        visibility: visible;
        opacity: 1;
      }
    }
  }
}
</style>
