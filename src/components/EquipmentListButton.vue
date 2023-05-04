<template>
  <template  v-if="item.type === 'group'">
    <EquipmentListButtonRaw
      :eq="item"
      class="equipment-list-button"
      @click="open = !open"
      :groupOpen="open"
    />

    <li
      :style="{
        '--height': item.equipment.length * 3 + 'rem'
      }"
    >
      <Transition name="equipment-list-button__list">
        <ul
          class="equipment-list-button__list"
          v-if="open"
        >
          <EquipmentListButtonRaw
            v-for="eq in item.equipment"
            :key="eq.id"
            :eq="eq"
            class="equipment-list-button__list-item"
          />
        </ul>
      </Transition>
    </li>
  </template>
  <EquipmentListButtonRaw
    v-else
    :eq="item.equipment"
    class="equipment-list-button"
  />
</template>

<script lang="ts" setup>
import { Equipment } from '@/model/equipment'
import EquipmentListButtonRaw from '../components/EquipmentListButtonRaw.vue'
import { ref } from 'vue'

defineProps<{
  item: {
    type: 'group' | 'equipment'
    name?: string
    equipment?: Equipment | Equipment[]
  }
}>()

const open = ref(false)
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.equipment-list-button {
  i {
    display: inline-block;
    transition: .5s cubic-bezier(0.19, 1, 0.22, 1);
  }

  &--open {
    i {
      transform: rotate(90deg);
    }
  }

  &__list {
    list-style-type: none;
    border-bottom: r.$bg-stroke solid 1px;
    overflow: hidden;
    position: relative;

    :deep(.equipment-list-button__name-icon-container) {
      padding-left: 1.3rem;
      grid-template-columns: 1.5rem auto;
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 1.9rem;
      bottom: 1rem;
      width: .2rem;
      background: r.$text-secondary;
      border-radius: .1rem;
    }

    &-enter-active,
    &-leave-active {
      transition: .5s cubic-bezier(0.19, 1, 0.22, 1);
      height: var(--height);
    }

    &-enter-from,
    &-leave-to {
      height: 0;
      border-bottom-width: 0;
    }
  }
}
</style>
