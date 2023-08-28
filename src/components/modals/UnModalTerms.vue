<template>
  <UnModalLayout
    class="un-modal-terms"
    :closable="false"
    content-no-padding
  >
    <template #header>
      <div class="un-modal-terms__header">
        <div
          v-for="item in stepSettings"
          :key="item.step"
          class="un-modal-terms__header-title"
          :class="{
            'is-active': current.step === item.step,
            'is-finished': current.step > item.step,
            'is-disabled': current.step < item.step,
          }"
        >
          <span
            class="un-modal-terms__header-number"
            v-text="item.step"
          />
          {{ item.title }}
        </div>
      </div>
    </template>

    <template #default>
      <div
        :key="current.step"
        class="un-modal-terms__text"
        @scroll.passive="onScroll"
      >
        <component
          :is="current.component"
        />
      </div>
    </template>

    <template #footer>
      <div class="un-modal-terms__btn-wrap">
        <UnBtn
          class="un-modal-terms__btn"
          text="accept & Continue"
          :disabled="btnDisabled"
          :loading="isLoading"
          @click="onBtnClick($emit)"
        />
      </div>
      <div class="un-modal-terms__footer-text-wrap">
        <span
          class="un-modal-terms__footer-text"
          v-text="'Have a question?'"
        />
        <a
          href="mailto:legal@unfederalreserve.com"
          class="un-modal-terms__footer-link"
          v-text="'Contact Support'"
        />
      </div>
    </template>
  </UnModalLayout>
</template>

<script lang="ts">
// eslint-disable-next-line object-curly-newline
import { PropType, defineComponent, ref, markRaw } from 'vue';
import { notify } from '@kyvg/vue3-notification';
import { useSetLegal } from '@/store';
import { LegalTypes } from '@/services/legal';
import { TRANSACTION_STATUSES } from '@/helpers/enums/params';

import UnModalLayout from './UnModalLayout.vue';
import UnBtn from '@/components/ui/UnBtn.vue';

import TermsContent from '@/views/Static/components/TermsContent.vue';
import LoanContent from '@/views/Static/components/LoanContent.vue';


type IStepSettings = typeof STEP_SETTINGS_MAP[keyof typeof STEP_SETTINGS_MAP];

const STEP_SETTINGS_MAP = {
  [LegalTypes.terms_of_service]: {
    step: 1,
    title: 'Terms And Conditions',
    component: markRaw(TermsContent),
    legal: LegalTypes.terms_of_service,
    version: 1,
  },
  [LegalTypes.loan_agreement]: {
    step: 2,
    title: 'Peer To Peer Loan Agreement',
    component: markRaw(LoanContent),
    legal: LegalTypes.loan_agreement,
    version: 1,
  },
};

const NOTIFY_OPTIONS = {
  text: 'Something went wrong',
  data: {
    description: 'Please try again',
    status: TRANSACTION_STATUSES.FAILED,
  },
  type: 'error',
  group: 'transaction',
};

export default defineComponent({
  name: 'UnModalTerms',
  components: {
    UnModalLayout,
    UnBtn,
  },
  props: {
    legals: {
      type: Array as PropType<LegalTypes[]>,
      required: true,
    },
    ethAccount: {
      type: String,
      required: true,
    },
  },
  emits: ['close'], // close modal
  setup(props, ctx) {
    const btnDisabled = ref(true);

    const stepSettings = Object.values(STEP_SETTINGS_MAP);

    const currentStepSettings = stepSettings.find((_) => (
      props.legals.includes(_.legal)
    )) || stepSettings[0];

    const current = ref(currentStepSettings);

    const { fetchData: fetchSetLegal, isLoading } = useSetLegal();

    const onFetchSetLegal = (settings: IStepSettings) => (
      fetchSetLegal(
        props.ethAccount,
        settings.legal,
        settings.version,
      ).catch((error) => {
        notify(NOTIFY_OPTIONS);
        return Promise.reject(error);
      })
    );

    const onScroll = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.scrollTop + target.clientHeight >= target.scrollHeight - 100) {
        btnDisabled.value = false;
      }
    };

    const onBtnClick = async () => {
      switch (current.value.legal) {
        case LegalTypes.terms_of_service:
          await onFetchSetLegal(current.value);
          current.value = STEP_SETTINGS_MAP[LegalTypes.loan_agreement];
          btnDisabled.value = true;
          break;

        case LegalTypes.loan_agreement:
          await onFetchSetLegal(current.value);
          ctx.emit('close', true);
          break;

        default:
      }
    };

    return {
      stepSettings,
      btnDisabled,
      isLoading,
      current,
      onScroll,
      onBtnClick,
    };
  },
});
</script>

<style lang="scss">
.un-modal-terms {
  $root: &;

  @include media-gt(tablet) {
    width: 700px;
  }

  &__header {
    display: flex;
    width: 100%;

    &-title {
      display: flex;
      align-items: center;
      width: 50%;
      font-size: 16px;
      font-weight: 600;
      line-height: 20px;

      @include media-lte(tablet) {
        width: auto;
        text-align: left;
      }

      &.is-active {
        color: #fff;

        #{$root}__header-number {
          color: #fff;
          background: #3457c3;
        }
      }

      &.is-finished {
        color: #00d395;

        #{$root}__header-number {
          position: relative;
        }

        #{$root}__header-number::before {
          position: absolute;
          width: 30px;
          height: 30px;
          content: "";
          background: url(~@/assets/images/icons/check-circle.svg) no-repeat;
          background-color: #13296d;
          background-size: cover;
        }
      }

      &.is-disabled {
        color: #6882d4;

        #{$root}__header-number {
          color: #6882d4;
          background: #102461;
        }
      }
    }

    &-number {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      margin-right: 8px;
      font-size: 14px;
      font-weight: 600;
      line-height: 21px;
      border-radius: 50%;
    }
  }

  &__text {
    max-height: 330px;
    padding: 15px 30px;
    overflow-y: auto;
    background-color: $un-color-blue-11;
    border-bottom: 1px solid $un-color-blue-12;

    @include media-lte(tablet) {
      max-height: calc(100vh - 215px);
    }

    &::-webkit-scrollbar {
      width: 10px;
    }

    &::-webkit-scrollbar-track {
      background-color: $un-color-blue-11;
    }

    &::-webkit-scrollbar-thumb {
      height: 40px;
      background-color: $un-color-blue-13;
      border-radius: 12px;
    }

    p {
      margin-bottom: 20px;
      font-size: 12px;
      line-height: 18px;
      color: $un-color-gray-1;

      span {
        text-transform: uppercase;
      }
    }

    ul {
      padding-left: 20px;
      list-style-type: upper-roman;

      li {
        margin-bottom: 20px;
        font-size: 12px;
        line-height: 18px;
        color: $un-color-gray-1;
      }
    }

    ul.is-no-padding {
      padding-left: 0;
    }

    ul.is-decimal {
      list-style-type: decimal;
      counter-reset: item;

      > li {
        display: block;
      }

      > li::before {
        font-size: 14px;
        font-weight: 600;
        line-height: 21px;
        color: $un-color-gray-1;
        content: counters(item, ".") " ";
        counter-increment: item;
      }

      #{$root}__title {
        display: inline-block;
      }
    }

    ul.is-lower-alpha {
      list-style-type: lower-alpha;
    }

    a {
      color: $un-color-gray-1;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    h4 {
      margin-bottom: 7px;
      font-size: 14px;
      font-weight: 600;
      line-height: 21px;
      color: $un-color-gray-1;
      text-transform: uppercase;
    }
  }

  &__btn-wrap {
    text-align: center;

    @include media-gt(tablet) {
      padding-top: 15px;
    }
  }

  &__btn {
    max-width: 255px;
  }

  &__footer {
    &-text-wrap {
      margin-top: 12px;
      font-size: 12px;
      font-weight: 500;
      // line-height: 26px;
      text-align: center;
    }

    &-text {
      margin-right: 8px;
      color: #739efa;
    }

    &-link {
      color: #fff;
      text-decoration: none;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
