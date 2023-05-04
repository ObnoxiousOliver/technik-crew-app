<template>
  <div class="equipment-badge">
    <div class="equipment-badge__icon">
      <i :class="icon" />
    </div>
    <div class="equipment-badge__info">
      <div class="equipment-badge__name">
        {{ equipment?.name }}
      </div>
      <div class="equipment-badge__location">
        {{ location ?? 'Kein Standort hinterlegt' }}
      </div>
    </div>
    <div class="equipment-badge__buttons">
      <Btn
        @click="router.push('/equipment/' + equipment?.id + '/history')"
        class="btn--square"
      >
        <i class="bi-clock-history" />
      </Btn>
      <Btn
        @click="router.push('/equipment/' + equipment?.id + '/edit')"
        class="btn--square"
      >
        <i class="bi-pencil-square" />
      </Btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Equipment, EquipmentTypeInfo } from '@/model/equipment'
import { Location } from '@/model/location'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{
  equipment?: Equipment
}>()

const icon = computed(() => {
  return EquipmentTypeInfo[props.equipment?.type]?.icon ?? EquipmentTypeInfo.other.icon
})
const location = ref()

watch(() => props.equipment, update)
onMounted(update)
async function update () {
  if (props.equipment?.location) {
    location.value = (await Location.get(props.equipment?.location))?.name
  }
}
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.equipment-badge {
  position: relative;
  background: r.$bg-secondary;
  border-radius: r.$radius;
  padding: 4rem 1rem 5rem;
  text-align: center;

  &__icon {
    font-size: 2rem;
    margin-bottom: .5rem;
  }

  &__info {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    gap: 1rem;
    color: r.$text-secondary;
  }

  &__name {
    font-size: 2rem;
    font-weight: 600;
    color: r.$text-primary;
  }

  &__buttons {
    position: absolute;
    top: .5rem;
    right: .5rem;
  }
}
</style>
