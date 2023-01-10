<template>
  <div class="equipment-list-btn__container">
    <Btn @click="$emit('eqClick', $event)" :class="['equipment-list-btn', {
      'equipment-list-btn--group': group,
      'equipment-list-btn--open': open,
      'equipment-list-btn--in-group': inGroup
    }]">
      <i :class="['equipment-list-btn__icon', icon ]" />
      <div class="equipment-list-btn__name">
        {{ group ?? equipment?.name }}
      </div>
      <div class="equipment-list-btn__location">
        {{ location }}
      </div>
    </Btn>
    <Btn @click="$emit('optionsClick', $event)" class="equipment-list-btn__options">
      <i class="bi-three-dots-vertical" />
    </Btn>
  </div>
</template>

<script lang="ts" setup>
import { Equipment, EquipmentTypeInfo } from '@/model/equipment'
import { Location } from '@/model/location'
import { computed, onMounted, onUpdated, ref } from 'vue'

const props = defineProps<{
  equipment?: Equipment,
  group?: string,
  open?: boolean,
  inGroup?: boolean
}>()

defineEmits([
  'eqClick',
  'optionsClick'
])

const icon = computed(() => {
  return props.group
    ? 'bi-chevron-right'
    : EquipmentTypeInfo[props.equipment?.type]?.icon ?? EquipmentTypeInfo.other.icon
})
const location = ref('')

onMounted(update)
onUpdated(update)
async function update () {
  if (props.inGroup) return
  const locId = props.equipment?.location
  if (locId) {
    location.value = (await Location.get(locId)).name
  }
}
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.equipment-list-btn {
  width: 100%;
  text-align: left;
  padding: 0 1.5rem;
  height: 3rem;
  background: none !important;
  border-radius: 0;
  font-weight: normal;

  display: grid;
  gap: 1rem;
  grid-template-columns: 1rem 2fr 1fr 2rem;
  align-items: center;

  &--open {
    .equipment-list-btn__icon {
      transform: rotate(90deg);
    }
  }

  &--in-group {
    padding-left: 3rem;
  }

  &__container {
    position: relative;
  }

  &__icon {
    display: inline-block;
    transition: .5s cubic-bezier(0.19, 1, 0.22, 1);
  }

  &__location {
    text-align: right;
    color: r.$text-secondary;
  }

  &__options {
    position: absolute;
    inset: 0 1rem 0 auto;
    padding: 0;
    width: 3rem;
    background: none !important;
  }
}
</style>
