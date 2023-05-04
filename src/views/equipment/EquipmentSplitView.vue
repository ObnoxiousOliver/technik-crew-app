<template>
  <Page>
    <template #title>
      <i class="bi-vr" />Anzahl teilen
    </template>

    <FormContainer @submit.prevent="submit" :disabled="submitting">
      <Slider
        type="range"
        v-model="amount"
        :min="0"
        :max="equipment?.amount"
        :limitMax="equipment?.amount - 1"
        :limitMin="1"
        noFill
      />

      <FormGroup inline>
        <InputField
          ref="part1"
          type="number"
          v-model="part1Val"
          :min="1"
          :max="equipment?.amount - 1"
        />
        <InputField
          ref="part2"
          type="number"
          v-model="part2Val"
          :min="1"
          :max="equipment?.amount - 1"
        />
      </FormGroup>

      <p class="no-reset">
        <b>{{ equipment?.name }}</b> wird zu:
        <ul>
          <li>{{ part1Val }}x {{ equipment?.name }}</li>
          <li>{{ part2Val }}x {{ equipment?.name }}</li>
        </ul>
      </p>

      <Btn type="submit">
        Teilen
      </Btn>
    </FormContainer>
  </Page>
</template>

<script lang="ts" setup>
import { back } from '@/router'
import { useEquipment } from '@/stores/equipment'
import { computed, ref, VueElement } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const eqStore = useEquipment()
const equipment = computed(() => eqStore.findByID(route.params.id))

const amount = ref(Math.round((equipment.value?.amount ?? 2) / 2))

const part1 = ref<VueElement>()
const part1Val = computed({
  get: () => amount.value,
  set: (v) => {
    amount.value = Math.min(Math.max(v, 1), equipment.value?.amount - 1)
    part1.value.input.value = amount.value.toString()
  }
})
const part2 = ref<VueElement>()
const part2Val = computed({
  get: () => equipment.value?.amount - amount.value,
  set: (v) => {
    amount.value = equipment.value?.amount - v
    part2.value.input.value = (equipment.value?.amount - amount.value).toString()
  }
})

const submitting = ref(false)
async function submit () {
  if (!equipment.value) return
  submitting.value = true
  await eqStore.split(equipment.value, amount.value)
  back()
}
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.equipment-split {
}
</style>
