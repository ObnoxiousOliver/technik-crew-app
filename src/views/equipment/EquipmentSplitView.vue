<template>
  <Page>
    <template #title>
      <i class="bi-vr" />Anzahl teilen
    </template>

    <FormContainer @submit.prevent="">
      <Slider
        type="range"
        v-model="amount"
        :min="1"
        :max="equipment?.amount - 1"
        noFill
      />

      <div class="equipment-split__split">
        <InputField type="number" class="equipment-split__split__input" v-model="part1" />
        <InputField type="number" class="equipment-split__split__input" v-model="part2" />
      </div>

      <Btn type="submit">
        Speichern
      </Btn>
    </FormContainer>
  </Page>
</template>

<script lang="ts" setup>
import { useEquipment } from '@/stores/equipment'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const eqStore = useEquipment()
const equipment = computed(() => eqStore.findByID(route.params.id))

const amount = ref(Math.round((equipment.value?.amount ?? 2) / 2))

const part1 = computed({
  get: () => amount.value,
  set: (v) =>
    amount.value = Math.min(Math.max(v, 1), equipment.value?.amount - 1)
  }
})
const part2 = computed({
  get: () => equipment.value?.amount - amount.value,
  set: (v) => {
    amount.value = equipment.value?.amount - v
  }
})
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.equipment-split {
  &__split {
    display: flex;
    gap: 1rem;

    &__input {
      flex: 1;
    }
  }
}
</style>
