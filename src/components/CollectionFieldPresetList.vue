<template>
  <div class="collection-field-preset-list">
    <button
      v-wave
      class="collection-field-preset-list__item"
      v-for="preset in presets"
      :key="preset.name"
      @click="emit('select', preset)"
    >
      <div class="collection-field-preset-list__item__name">
        {{ preset.name }}
      </div>
      <div class="collection-field-preset-list__item__type">
        {{ getTypeString(preset) }}
      </div>
      <div v-if="getOptionString(preset)" class="collection-field-preset-list__item__options">
        {{ getOptionString(preset) }}
      </div>
    </button>

    <div v-if="!presets.length" class="collection-field-preset-list__item">
      Keine Vorlagen vorhanden
    </div>
  </div>
</template>

<script setup lang="ts">
import { FieldTemplate, fieldTypes, FieldTypes, getOptionString } from '@/model/inventory/collectionField'
import { useInventory } from '@/stores/inventory'
import { computed } from 'vue'

const emit = defineEmits(['select'])

const inventory = useInventory()

const presets = computed(() => {
  const p: FieldTemplate<FieldTypes>[] = []

  inventory.collections.forEach(collection => {
    p.push(...collection.fields)
  })

  return p.filter((preset, i) => p.findIndex(p => {
    return p.name === preset.name &&
    p.type === preset.type &&
    JSON.stringify(p.options) === JSON.stringify(preset.options)
  }) === i)
})

function getTypeString (preset: FieldTemplate<FieldTypes>) {
  return fieldTypes[preset.type]
}

</script>

<style scoped lang="scss">
@use '../scss' as r;

.collection-field-preset-list {
  display: flex;
  flex-direction: column;

  &__item {
    background: none;
    font: inherit;
    border: none;
    color: r.$text-secondary;
    border-radius: r.$radius;
    text-align: left;
    margin: 0 -1rem;

    display: grid;
    grid-template-columns: auto 1fr;
    padding: 1rem;
    gap: 0 .5rem;
    align-items: center;

    &__name {
      color: r.$text-primary;
      font-size: 1.2em;
      font-weight: 600;
    }

    &__options {
      grid-column: 1 / -1;
    }
  }
}
</style>
