<template>
  <div
    v-if="isActive"
    class="un-scroll-up-btn"
    @click="onClick"
  >
    <img
      class="un-scroll-up-btn__image"
      :src="require('@/assets/images/icons/arrow-long-top.svg')"
      alt="scroll arrow up"
    >
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line object-curly-newline
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';


const MIN_ACTIVE_VALUE = 300; // px

export default defineComponent({
  name: 'UnScrollUpBtn',
  setup() {
    const isActive = ref(false);

    const onClick = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };

    let timerId: ReturnType<typeof setTimeout> | null;

    const onScroll = () => {
      if (timerId) return;
      timerId = setTimeout(() => {
        isActive.value = window.scrollY > MIN_ACTIVE_VALUE;
        if (timerId) clearTimeout(timerId);
        timerId = null;
      }, 100);
    };

    onMounted(() => {
      window.addEventListener('scroll', onScroll);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', onScroll);
    });

    return {
      isActive,
      onClick,
    };
  },
});
</script>

<style lang="scss">
.un-scroll-up-btn {
  position: fixed;
  right: 30px;
  bottom: 30px;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 100%;
  transition: 0.3s;
  backdrop-filter: blur(4px);

  @include media-lte(tablet) {
    right: 15px;
    width: 40px;
    height: 40px;
  }

  &:hover {
    background-color: #fff;
  }
}
</style>
