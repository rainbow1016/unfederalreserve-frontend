<template>
  <UnModalLayout
    title="Need some help?"
    class="un-modal-help"
    @close="$emit('close')"
  >
    <template #default>
      <a
        v-for="(item, index) in socialInviteList"
        :key="index"
        :href="item.href"
        class="un-modal-help__item"
        target="_blank"
      >
        <div class="un-modal-help__item-img">
          <img :src="item.icon">
        </div>
        <p class="un-modal-help__item-descr">
          {{ item.description }}
        </p>
      </a>
    </template>

    <template #footer>
      <div class="un-modal-help__social-wrap">
        <p class="un-modal-help__social-descr">
          And follow us on social media
        </p>
        <UnSocialLinks
          :social-list="socialList"
          class="un-modal-help__social"
        />
      </div>
    </template>
  </UnModalLayout>
</template>

<script lang="ts">
// eslint-disable-next-line object-curly-newline
import { defineComponent } from 'vue';
import {
  YOUTUBE_INVITE,
  DISCORD_INVITE,
  LINKEDIN,
  FACEBOOK,
  TELEGRAM,
  TWITTER,
  DEFI,
} from '@/helpers/enums/socials';

import UnModalLayout from './UnModalLayout.vue';
import UnSocialLinks from '@/components/common/UnSocialLinks.vue';


const SOCIAL_INVITE_LIST = [
  DISCORD_INVITE,
  YOUTUBE_INVITE,
];

const SOCIAL_LIST = [
  LINKEDIN,
  FACEBOOK,
  TELEGRAM,
  TWITTER,
  DEFI,
];

export default defineComponent({
  name: 'UnModalTransaction',
  components: {
    UnModalLayout,
    UnSocialLinks,
  },
  emits: ['close'], // close modal
  setup() {
    return {
      socialInviteList: SOCIAL_INVITE_LIST,
      socialList: SOCIAL_LIST,
    };
  },
});
</script>

<style lang="scss">
.un-modal-help {
  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 130px;
    padding: 20px;
    margin-bottom: 19px;
    color: white;
    text-align: center;
    text-decoration: none;
    border: 2px solid #213983;
    border-radius: 15px;
    transition: 0.3s;

    &:last-child {
      margin-bottom: 0;
    }

    &:hover {
      background: linear-gradient(90deg, #183386 2.84%, #142b71 100%);
    }
  }

  &__item-img {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
  }

  &__item-descr {
    margin-bottom: 0;
    font-size: 15px;
    font-weight: 600;
    line-height: 26px;
  }

  &__social-wrap {
    text-align: center;
  }

  &__social-descr {
    margin-bottom: 20px;
    font-size: 15px;
    font-weight: 600;
    line-height: 26px;
  }

  &__social {
    justify-content: center;
    padding-bottom: 10px;

    a {
      display: flex;
      align-items: center;
      transition: 0.3s;
    }

    svg {
      &:focus {
        outline: none;
      }

      path {
        fill: $un-color-soft-gray;
      }
    }
  }
}
</style>
