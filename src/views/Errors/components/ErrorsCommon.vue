<template v-once>
  <div class="errors-common">
    <div class="errors-common__content">
      <h1 class="errors-common__title">
        Error {{ error_code }}
      </h1>
      <p class="errors-common__description">
        <slot name="description" />
      </p>
      <UnBtn
        :text="text"
        class="errors-common__btn"
        @click="onClick"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { ROUTE_DASHBOARD } from '@/helpers/enums/routes';

import UnBtn from '@/components/ui/UnBtn.vue';


export default defineComponent({
  name: 'ErrorsCommon',
  components: {
    UnBtn,
  },
  props: {
    error_code: {
      type: Number,
      required: true,
    },
    fullPath: {
      type: String,
    },
  },
  setup(props) {
    const router = useRouter();
    const text = props.fullPath ? 'Retry' : 'Go Back';
    const routeLocation = props.fullPath || { name: ROUTE_DASHBOARD };

    if (props.fullPath) {
      window.history.replaceState({}, '', props.fullPath);
    }

    const onClick = () => {
      void router.replace(routeLocation);
    };

    return {
      text,
      onClick,
    };
  },
});
</script>

<style lang="scss">
.errors-common {
  width: 100%;
  margin-top: -100px;
  background: url(~@/assets/images/background/500.png) no-repeat;
  background-repeat: repeat-x;
  background-position: top center;

  @include media-lt(tablet) {
    min-height: calc(100vh - 160px);
    margin-top: -75px;
    background-size: cover;
  }

  &__content {
    position: absolute;
    top: 168px;
    width: 100%;
    margin: 0 auto;
    color: #042751;
    text-align: center;
    letter-spacing: 0.01em;

    @include media-lt(tablet) {
      top: 128px;
    }
  }

  &__title {
    margin-bottom: 17px;
    font-size: 42px;
    font-weight: bold;
    line-height: 46px;

    @include media-lt(tablet) {
      font-size: 38px;
    }
  }

  &__description {
    margin-bottom: 21px;
    font-size: 18px;
    font-weight: 400;
    line-height: 31px;

    @include media-lt(tablet) {
      font-size: 14px;
    }
  }

  &__btn {
    width: 190px;
    font-size: 16px;
    text-transform: none;
  }
}

</style>
