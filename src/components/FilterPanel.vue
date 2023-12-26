<template>
  <Transition
    name="filter-panel__filters"
    @enter="enter"
  >
    <div v-if="showFilters" class="filter-panel__filters">
      <slot />
    </div>
  </Transition>
  <TransitionGroup
    tag="div"
    class="filter-panel"
    name="filter-panel__filter"
    ref="filterPanel"
  >
    <Btn
      small
      @click="showFilters = !showFilters"
      key="add-filter"
    >
      <i class="btn__icon bi-funnel" /> Filter
    </Btn>
    <Btn
      chip
      chipX
      v-for="(filter, i) in filters"
      :key="filter.value"
      class="filter-panel__filter"
      :data-value="filter.value"
      @click="filters.splice(i, 1)"
      :style="{
        '--width': filterPanel.$el.querySelector(`[data-value='${filter.value}']`)?.offsetWidth + 'px'
      }"
    >
      {{ filter.name }}
    </Btn>
  </TransitionGroup>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

defineProps<{
  filters: {
    name: string
    value: string
  }[],
  active: {
    name: string
    value: string
  }[]
}>()

const filterPanel = ref<HTMLElement>()
const filters = ref<{
  name: string
  value: string
}>([])

const showFilters = ref(false)
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.filter-panel {
  margin: 1rem 0;
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;

  &__filter {
    margin: 0;

    &-enter-active,
    &-leave-active {
      transition: .2s;
    }

    &-enter-from,
    &-leave-to {
      opacity: 0;
      transform: scale(.8);
      margin-right: calc(var(--width) * -1 - .5rem);
    }
  }

  &__filters {
    &-enter-active,
    &-leave-active {
      transition: .2s;
      height: var(--height);
    }

    &-enter-from,
    &-leave-to {
      height: 0;
    }
  }
}
</style>
