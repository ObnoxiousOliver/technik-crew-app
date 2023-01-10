<template>
  <ul class="equipment-list">
    <li class="equipment-list__item equipment-list__item--header">
      <Btn class="equipment-list__item--header__sort-btn equipment-list__item--header__sort-btn--type" @click="sortByClick('type')">
        <i v-if="sortBy === 'type'" :class="reverse ? 'bi-chevron-up' : 'bi-chevron-down'"/>
        Typ
      </Btn>
      <Btn class="equipment-list__item--header__sort-btn equipment-list__item--header__sort-btn--name" @click="sortByClick('name')">
        <i v-if="sortBy === 'name'" :class="reverse ? 'bi-chevron-up' : 'bi-chevron-down'"/>
        Name
      </Btn>
      <Btn class="equipment-list__item--header__sort-btn equipment-list__item--header__sort-btn--location" @click="sortByClick('location')">
        <i v-if="sortBy === 'location'" :class="reverse ? 'bi-chevron-up' : 'bi-chevron-down'"/>
        Ort
      </Btn>
    </li>
    <li
      v-for="item in listedEquipment"
      :key="item.type === 'group' ? item.name : item.equipment.id"
      class="equipment-list__item"
    >
      <EquipmentListButton
        @eqClick="itemClick(item)"
        :equipment="item.type === 'equipment' ? item.equipment : item.equipment[0]"
        :group="item.name"
        :open="expandedGroups.includes(item.name)"
      />
      <Transition name="equipment-list__sub-list">
        <ul
          v-if="item.type === 'group' && expandedGroups.includes(item.name)"
          class="equipment-list__sub-list"
          :style="{
            '--count': item.equipment.length
          }"
        >
          <li
            v-for="eq in item.equipment"
            :key="eq.id"
            class="equipment-list__sub-list__item"
          >
            <EquipmentListButton inGroup :equipment="eq" />
          </li>
        </ul>
      </Transition>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import EquipmentListButton from '@/components/EquipmentListButton.vue'
import { Equipment } from '@/model/equipment'
import { computed, ref } from 'vue'

const props = defineProps<{
  equipment?: Equipment[]
}>()

const sortBy = ref<'name' | 'location' | 'type'>('name')
const reverse = ref(false)

function sortByClick (sort: 'name' | 'location' | 'type') {
  if (sortBy.value === sort) {
    reverse.value = !reverse.value
  } else {
    sortBy.value = sort
    reverse.value = false
  }
}

const expandedGroups = ref<string[]>([])
const listedEquipment = computed(() => {
  if (props.equipment) {
    const list = [
      ...Equipment.getGroups(props.equipment)
        .map(group => ({
          type: 'group',
          name: group,
          equipment: props.equipment.filter(eq => eq.group === group)
        })),

      ...props.equipment
        .filter(eq => !eq.group)
        .map(eq => ({
          type: 'equipment',
          equipment: eq
        }))
    ]
    return reverse.value ? list.reverse() : list
  }
  return []

  function sort (a, b) {
    // TODO: Sorting
  }
})

function itemClick (item: {
  type: 'group' | 'equipment'
  name?: string
  equipment?: Equipment | Equipment[]
}) {
  if (item.type === 'group') {
    if (expandedGroups.value.includes(item.name)) {
      expandedGroups.value = expandedGroups.value.filter(name => name !== item.name)
    } else {
      expandedGroups.value.push(item.name)
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.equipment-list {
  list-style: none;
  margin: 0 -1.5rem;

  &__item, &__sub-list__item {
    position: relative;
  }

  &__item--header {
    display: grid;
    padding: 0 4.5rem 0 1.5rem;
    gap: 1rem;
    grid-template-columns: 1rem 2fr 1fr;
    border-bottom: r.$bg-stroke solid 1px;

    &__sort-btn {
      margin: 0 -.5rem;
      padding: .5rem .5rem .5rem 1rem;
      background: none !important;
      font-size: .8rem;
      color: r.$text-secondary;
      text-align: right;
      white-space: nowrap;
      position: relative;
      border-radius: 0;

      &--type {
        margin: 0 -1rem 0 -1.5rem;
        padding: .5rem 1rem .5rem 0;
      }

      &--name {
        text-align: left;
        i {
          position: absolute;
          left: 0rem;
        }
      }
    }
  }

  &__sub-list {
    position: relative;
    border-bottom: r.$bg-stroke solid 1px;

    &::before {
      content: '';
      position: absolute;
      inset: 0 auto 1rem 1.9rem;
      width: .2rem;
      background: r.$bg-stroke;
    }

    &__item {
      height: 3rem;
    }

    &-enter-active,
    &-leave-active {
      transition: height .5s cubic-bezier(0.19, 1, 0.22, 1);
      height: calc(var(--count) * 3rem + 1px);
      overflow: hidden;
    }

    &-enter-from,
    &-leave-to {
      height: 0;
      border-bottom: r.$bg-stroke solid 0;
    }
  }
}
</style>
