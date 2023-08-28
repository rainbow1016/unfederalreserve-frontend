<template>
  <UnCard
    transparent-dark
    class="dashboard-voting-proposals"
  >
    <DashboardSectionHeader
      title="Voting Proposals"
      class="dashboard-voting-proposals__header"
    />

    <div
      v-for="(item, index) in list"
      :key="item?.title || index"
      class="dashboard-voting-proposals__item"
      :class="{ 'is-active': item.active }"
    >
      <div class="dashboard-voting-proposals__title-wrap">
        <UnSkeleton
          v-if="skeleton"
          height="19px"
          width="100px"
          class="dashboard-voting-proposals__skeleton"
        />
        <div
          v-else
          class="dashboard-voting-proposals__title"
          v-text="item.title"
        />

        <UnSkeleton
          v-if="skeleton"
          height="19px"
          width="70px"
          class="dashboard-voting-proposals__skeleton"
        />
        <div
          v-else
          class="dashboard-voting-proposals__state"
          v-text="item.state"
        />
      </div>

      <UnSkeleton
        v-if="skeleton"
        height="19px"
        width="100px"
        class="dashboard-voting-proposals__skeleton"
      />

      <div
        v-else
        class="dashboard-voting-proposals__choice"
        v-text="item.active ? item.end : item.choice"
      />
    </div>

    <a
      href="https://snapshot.org/#/unersdl.eth"
      target="_blank"
      class="dashboard-voting-proposals__link"
    >
      Show more on snapshot
      <img
        v-svg-inline
        :src="require('@/assets/images/icons/external-link.svg')"
        class="dashboard-voting-proposals__link-icon"
      >
    </a>
  </UnCard>
</template>

<script lang="ts">
import maxBy from 'lodash/maxBy';
import { PropType, defineComponent, computed } from 'vue';
import { TProposal } from '@/services/getSnapshot';

import DashboardSectionHeader from './DashboardSectionHeader.vue';
import UnSkeleton from '@/components/ui/UnSkeleton.vue';
import UnCard from '@/components/ui/UnCard.vue';


const formatProposal = (data: TProposal) => {
  const maxVote = maxBy(data.scores) || 0;
  const maxVoteIndex = data.scores.indexOf(maxVote);

  const endDane = new Date(data.end * 1000); // * 1000 to get milliseconds
  const nowDate = new Date();
  const difference = endDane.getTime() - nowDate.getTime(); // difference in milliseconds
  const days = Math.ceil(difference / (1000 * 3600 * 24)) - 1;

  return {
    active: data.state.includes('active'),
    title: data.title,
    choice: data.choices[maxVoteIndex],
    state: data.state.charAt(0).toUpperCase() + data.state.slice(1),
    end: `ends in ${days} days`,
  };
};

export default defineComponent({
  name: 'DashboardSnapshot',
  components: {
    DashboardSectionHeader,
    UnSkeleton,
    UnCard,
  },
  props: {
    proposals: {
      type: Array as PropType<TProposal[]>,
    },
    skeleton: Boolean,
    loading: Boolean,
  },
  setup(props) {
    const list = computed(() => (
      props.proposals?.map(formatProposal)
      || (props.skeleton ? 3 : [])
    ));

    return {
      list,
    };
  },
});
</script>

<style lang="scss">
.dashboard-voting-proposals {
  $root: &;

  @include media-lt(desktop) {
    padding: 25px 16px !important;
  }

  &__header {
    margin-bottom: 17px;
  }

  &__item {
    padding: 13px 16px;
    background: rgba(41, 73, 171, 0.44);
    border-radius: 15px;

    & + & {
      margin-top: 10px;
    }

    &.is-active {
      #{$root}__state {
        background: #00d395;
      }

      #{$root}__choice {
        color: #739efa;
      }
    }
  }

  &__title-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title-wrap + #{$root}__skeleton {
    margin-top: 15px;
  }

  &__title {
    font-size: 14px;
    line-height: 21px;
  }

  &__state {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 21px;
    margin-left: 9px;
    font-size: 12px;
    font-weight: 600;
    line-height: 18px;
    background: #7433ff;
    border-radius: 23px;
  }

  &__choice {
    font-size: 12px;
    line-height: 18px;
    color: #00d395;
  }

  &__link {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 15px;
    font-size: 14px;
    font-weight: 500;
    line-height: 100%;
    color: #fff;
    text-decoration: none;
    transition: all 0.3s ease-out;

    &:hover {
      color: #00d395;
    }
  }

  &__link-icon {
    width: 17px;
    margin-left: 6px;
  }
}
</style>
