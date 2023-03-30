<template>
  <ul class="locations-list">
    <li
      class="locations-list__item"
      v-for="location in locations"
      :key="location.id"
    >
      <Btn
        class="locations-list__item__btn"
        @click="click(location.id)"
      >
        <div class="locations-list__item__name">
          {{ location.name }}
        </div>
        <div class="locations-list__item__desc">
          {{ location.description || 'Keine Beschreibung' }}
        </div>
        <i class="locations-list__item__dots bi-three-dots-vertical" />
      </Btn>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { Location } from '@/model/location'

const emit = defineEmits(['click'])

const props = defineProps<{
  locations: Location[]
}>()

function click (id: string) {
  emit('click', props.locations.find((location) => location.id === id))
}
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.locations-list {
  list-style: none;

  &__item {
    position: relative;
    margin-bottom: 1rem;

    &__btn {
      display: block;
      width: stretch;
      text-align: left;
      font-weight: normal;
      padding: 1rem 2rem 1rem 1.5rem;
    }

    &__name {
      font-weight: 600;
      font-size: 1.5rem;
    }

    &__desc {
      color: r.$text-secondary;
      white-space: pre-wrap;
      overflow: hidden;

      // polyfill
      max-height: 3 * 1.2rem;
      line-height: 1.2rem;

      // max-lines 3
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }

    &__dots {
      position: absolute;
      top: 50%;
      right: 1rem;
      transform: translate(0, -50%);
    }
  }
}
</style>
