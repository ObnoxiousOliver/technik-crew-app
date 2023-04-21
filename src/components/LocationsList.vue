<template>
  <div class="locations-list__search" v-if="search">
    <InputField
      v-model="searchInput"
      class="locations-list__search__input"
      placeholder="Suchen..."
    >
      <template #before>
        <i class="bi-search" />
      </template>
      <template #after>
        <Btn @click="searchInput = ''" aria-label="Suche leeren">
          <i class="bi-x-lg" />
        </Btn>
      </template>
    </InputField>
  </div>

  <ul class="locations-list">
    <li
      v-for="location in shownLocations"
      :key="location.id ?? 'no-location'"
      :class="['locations-list__item', {
        'locations-list__item--no-location': !location.id
      }]"
    >
      <Btn
        class="locations-list__item__btn"
        @click="click(location.id)"
      >
        <div class="locations-list__item__name">
          <template v-if="location.id">
            {{ location.name }}
          </template>
          <template v-else>
            <i class="bi-x-lg" />Kein Standort
          </template>
        </div>
        <div v-if="location.id" class="locations-list__item__desc">
          {{ location.description || 'Keine Beschreibung' }}
        </div>
        <!-- <i class="locations-list__item__dots bi-three-dots-vertical" /> -->
      </Btn>
    </li>
  </ul>

  <div v-if="shownLocations.length === 0 && locations.length > 0" class="text-secondary">
    Keine Standorte gefunden
  </div>
</template>

<script lang="ts" setup>
import { Location } from '@/model/location'
import { search } from '@/utilities/search'
import { computed, ref } from 'vue'

const emit = defineEmits(['click'])

const props = defineProps<{
  locations: Location[],
  search?: boolean,
  hasNoLocationOption?: boolean
}>()

const searchInput = ref('')
const shownLocations = computed(() => {
  const locs = [...props.locations]

  locs.sort((a, b) => {
    if (a.name < b.name) return -1
    if (a.name > b.name) return 1
    return 0
  })

  if (props.hasNoLocationOption) {
    locs.unshift({
      id: null
    })
  }

  if (searchInput.value === '') return locs
  return search(searchInput.value, props.locations, (x) => `${x.name} ${x.description} ${x.id}`)
})

function click (id: string) {
  emit('click', id ? props.locations.find((location) => location.id === id) : null)
}
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.locations-list {
  list-style: none;

  &__search {
    z-index: 1;
    background: r.$bg-primary;
    position: sticky;
    top: 0;
    padding-bottom: 1rem;
    margin-bottom: 1rem;

    &__input {
      width: stretch;
    }
  }

  &__item {
    position: relative;
    margin-bottom: 1rem;

    &--no-location {
      color: r.$text-secondary;
    }

    &__btn {
      display: block;
      width: stretch;
      text-align: left;
      font-weight: normal;
      padding: 1rem 2rem 1rem 1.5rem;

      i {
        display: inline-block;
        margin-right: 0.5rem;
      }
    }

    &__name {
      font-weight: 600;
      font-size: 1.5rem;

      .locations-list__item--no-location & {
        font-weight: normal;
        font-size: 1rem;
      }
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
