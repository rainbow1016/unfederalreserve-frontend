<template>
  <p class="pool-description">
    Tip: By adding liquidity you'll earn 0.25% of all trades on this pair proportional to your share of the pool.
    Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.
    <a
      v-if="false"
      href=""
      target="_blank"
      class="pool-description__more-link"
    >
      Learn More
      <img
        v-svg-inline
        src="@/assets/images/icons/arrow-right.svg"
        class="pool-description__more-arrow"
      >
    </a>
  </p>
</template>

<style lang="scss">
.pool-description {
  font-size: 14px;
  line-height: 144%;

  &__more-link {
    display: inline-flex;
    align-items: center;
    font-weight: 600;
    line-height: 100%;
    color: $un-color-caribbean-green;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }

  &__more-arrow {
    margin-left: 5px;
  }
}
</style>
