<template v-once>
  <div class="errors-404">
    <div class="errors-404__content">
      <h1 class="errors-404__title">
        PAGE NOT FOUND
      </h1>
      <p class="errors-404__description">
        Sorry, we could not find this page
      </p>
      <UnBtn
        :text="text"
        outlined
        class="errors-404__btn"
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
  name: 'ErrorsNotFound404',
  components: {
    UnBtn,
  },
  props: {
    fullPath: {
      type: String,
    },
  },
  setup(props) {
    const router = useRouter();
    const text = props.fullPath ? 'Go Back' : 'Go Home';
    const routeLocation = props.fullPath || { name: ROUTE_DASHBOARD };

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
.errors-404 {
  width: 100%;
  margin-top: -100px;
  background-color: #213b8f;
  background-image: url(~@/assets/images/background/404.jpg);
  background-repeat: repeat-x;
  background-position: top center;

  @include media-lt(tablet) {
    min-height: calc(100vh - 160px);
    margin-top: -75px;
    background-size: cover;
  }

  &__content {
    position: absolute;
    top: 57%;
    width: 100%;
    margin: 0 auto;
    line-height: 26px;
    color: #fff;
    text-align: center;

    @include media-lt(tablet) {
      top: 43%;
    }
  }

  &__title {
    margin-bottom: 10px;
    font-size: 31px;
    font-weight: 700;

    @include media-lt(tablet) {
      font-size: 25px;
    }
  }

  &__description {
    margin-bottom: 21px;
    font-size: 15px;
    font-weight: 400;

    @include media-lt(tablet) {
      font-size: 12px;
    }
  }

  &__btn {
    width: 190px;
    font-size: 16px;
    color: #3357cf;
    text-transform: none;
  }
}

</style>
