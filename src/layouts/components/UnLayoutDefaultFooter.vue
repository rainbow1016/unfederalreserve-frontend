<template>
  <div class="un-layout-default-footer">
    <div class="un-layout-default-footer-wrap">
      <div class="un-layout-default-footer__top">
        <UnSocialLinks
          :social-list="socialList"
          class="un-layout-default-footer__socials"
        />
        <div class="un-layout-default-footer-reserved">
          All rights reserved &copy;{{ currentYear }}
        </div>
      </div>

      <div class="un-layout-default-footer__bottom">
        <div class="un-layout-default-footer__bottom-left">
          <div class="un-layout-default-footer-btm-info">
            ReserveLending&copy; by unFederalReserve <br>
            a Residual Token, Inc company
          </div>
        </div>

        <div class="un-layout-default-footer__bottom-right">
          <nav class="un-layout-default-footer-nav">
            <ul>
              <li v-for="(item, index) in linkList" :key="index">
                <router-link
                  v-if="item.to"
                  :to="item.to"
                  class="un-layout-default-footer-nav__link un-link"
                  v-text="item.label"
                />
                <a
                  v-else
                  :href="item.href"
                  class="un-layout-default-footer-nav__link un-link"
                  target="_blank"
                  v-text="item.label"
                />
              </li>
              <li>
                <UnHeaderHelp
                  clickable
                  class="un-header-wallet__help"
                />
              </li>
              <li>
                <a
                  href="https://stake-old.unfederalreserve.com"
                  target="_blank"
                  class="un-layout-default-footer-nav__link un-link"
                >
                  Stake
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  ROUTE_DASHBOARD,
  ROUTE_STATIC_TERMS,
  ROUTE_STATIC_LOANS,
  ROUTE_MARKETS,
  ROUTE_LEND,
  ROUTE_POOL,
  ROUTE_LIQUIDATED,
} from '@/helpers/enums/routes';
import {
  YOUTUBE,
  DISCORD,
  LINKEDIN,
  FACEBOOK,
  TELEGRAM,
  TWITTER,
  DEFI,
} from '@/helpers/enums/socials';

import UnSocialLinks from '@/components/common/UnSocialLinks.vue';
import UnHeaderHelp from '@/layouts/components/UnHeaderHelp.vue';


const SOCIAL_LIST = [
  YOUTUBE,
  DISCORD,
  LINKEDIN,
  FACEBOOK,
  TELEGRAM,
  TWITTER,
  DEFI,
];

const FOOTER_LINK_LIST = [
  {
    label: 'Dashboard',
    to: { name: ROUTE_DASHBOARD },
  },
  {
    label: 'Lending',
    to: { name: ROUTE_LEND },
  },
  {
    label: 'Pools',
    to: { name: ROUTE_POOL },
  },
  {
    label: 'Markets',
    to: { name: ROUTE_MARKETS },
  },
  {
    label: 'Education Center',
    href: process.env.VUE_APP_DOCS_LINK,
  },
  {
    label: 'Liquidations',
    to: { name: ROUTE_LIQUIDATED },
  },
  {
    label: 'Terms of service',
    to: { name: ROUTE_STATIC_TERMS },
  },
  {
    label: 'Loan Agreement',
    to: { name: ROUTE_STATIC_LOANS },
  },
];

export default defineComponent({
  name: 'UnLayoutDefaultFooter',
  components: {
    UnSocialLinks,
    UnHeaderHelp,
  },
  setup() {
    const currentYear = new Date().getFullYear();

    return {
      currentYear,
      linkList: FOOTER_LINK_LIST,
      socialList: SOCIAL_LIST,
    };
  },
});
</script>

<style lang="scss">
.un-layout-default-footer {
  width: 100%;
  background: #030b27;

  &-wrap {
    width: 100%;
    max-width: 1140px;
    padding: 0 15px;
    margin: 0 auto;
  }

  &__socials {
    color: white;
  }

  &__top {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 37px 0 21px;

    @include media(tablet) {
      flex-direction: row;
      padding: 37px 0 21px;
    }

    @include media-lte(tablet-xs) {
      padding: 36px 15px 23px;
    }
  }

  &__bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0 16px;
    border-top: 1px solid $un-color-gray-4;

    @include media-lte(tablet) {
      flex-direction: column;
      padding: 28px 0 8px;
    }
  }

  &__bottom-left {
    margin-bottom: 10px;

    @include media-lte(tablet) {
      margin-bottom: 26px;
    }
  }

  &__bottom-right {
    margin-bottom: 10px;

    @include media-lte(tablet) {
      margin-bottom: 0;
    }
  }

  &-reserved {
    width: 100%;
    margin-left: 40px;
    font-size: 18px;
    color: $un-color-white;
    text-align: right;
    letter-spacing: 0.01em;

    @include media-lte(desktop) {
      margin-left: 0;
    }

    @include media-lte(tablet) {
      margin-top: 10px;
      margin-left: 0;
      font-size: 17px;
      text-align: center;
    }

    @include media-lte(tablet-xs) {
      text-align: left;
    }
  }
}

.un-layout-default-footer-btm-info {
  margin-right: 10px;
  font-size: 12px;
  font-weight: 500;
  line-height: 170%;
  color: #7c8297;
  letter-spacing: 0.01em;

  @include media-lte(tablet) {
    margin-right: 0;
    text-align: center;
  }
}

.un-layout-default-footer-nav {
  ul {
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    @include media-lte(tablet) {
      max-width: 270px;
      margin: 0 auto 30px;
    }

    li {
      margin-right: 30px;

      &:last-child {
        margin-right: 0;
      }

      @include media-lte(tablet) {
        width: 50%;
        margin: 0 0 6px 0;

        &:nth-child(2n) {
          padding-left: 30px;
        }
      }
    }
  }

  &__link {
    padding-bottom: 0;
    font-size: 12px;
    line-height: 170%;
    color: #7c8297;
    letter-spacing: 0.01em;
    border: 0;
    opacity: 1;

    &.router-link-active {
      color: $un-color-white;

      &:hover {
        color: $un-color-white;
      }
    }

    &:hover {
      color: $un-color-white;
    }
  }
}
</style>
