<template>
  <div class="dashboard-section-header">
    <div
      class="dashboard-section-header__title"
      v-text="title"
    />

    <router-link
      v-if="routerLink"
      :to="routerLink"
      class="dashboard-section-header__link"
    >
      <div
        class="dashboard-section-header__link-text"
        v-text="'View All'"
      />
      <img
        v-svg-inline
        src="@/assets/images/icons/arrow-right.svg"
        class="dashboard-section-header__link-icon"
      >
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';


export default defineComponent({
  name: 'DashboardSectionHeader',
  components: {
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    routerLink: Object,
  },
});
</script>

<style lang="scss">
.dashboard-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 100%;

  &__title {
    font-size: 18px;
    font-weight: 500;
  }

  &__link {
    display: flex;
    align-items: center;
    color: #00ffc2;
    text-decoration: none;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  &__link-text {
    font-size: 16px;
    font-weight: 600;
  }

  &__link-icon {
    height: 14px;
    margin-left: 15px;
  }
}
</style>
