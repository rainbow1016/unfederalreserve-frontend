<template>
  <div class="un-attention-card">
    <img
      v-svg-inline
      :src="require(`@/assets/images/icons/attention.svg`)"
      class="un-attention-card__icon"
    >
    <div
      class="un-attention-card__text"
    >
      <template v-if="text || $slots.text">
        <slot name="text">
          {{ text }}
        </slot>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UnAttentionCard',
  props: {
    text: String,
  },
});
</script>

<style lang="scss">
$padding-size: 25px;

.un-attention-card {
  display: flex;
  align-items: center;
  padding: 14px 18px;
  font-size: 14px;
  line-height: 122.5%;
  color: #e4761b;
  background: linear-gradient(180deg, rgba(228, 118, 27, 0.15) 0%, rgba(228, 118, 27, 0.08) 100%);
  border: 1px solid rgba(218, 145, 78, 0.33);
  border-radius: 11px;

  &__icon {
    width: 35px;
    min-width: 26px;
    height: 36px;
    min-height: 26px;
    margin-right: 16px;
  }
}
</style>
