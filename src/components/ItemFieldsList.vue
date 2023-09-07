<template>
  <ul class="item-fields-list">
    <ItemFieldsListItem
      v-for="template in fieldTemplate"
      :key="template.id"
      v-model:field="fieldValues[template.id]"
      :fieldTemplate="template"
      :readonly="readonly"
    />

    <!-- {{ fields }} -->

    <li v-if="fieldTemplate.length <= 0">
      <i class="text-secondary">Keine Felder vorhanden</i>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { FieldTemplate, FieldTypes, FieldValue } from '@/model/inventory/collectionField'
import { useVModel } from '@vueuse/core'
import { ref, watch } from 'vue'
import ItemFieldsListItem from './ItemFieldsListItem.vue'

const props = defineProps<{
  fields: FieldValue<FieldTypes>[]
  fieldTemplate: FieldTemplate<FieldTypes>[]
  readonly?: boolean
}>()
const emit = defineEmits(['update:fields'])

const fields = useVModel(props, 'fields', emit)

const fieldValues = ref<{
  [id: string]: FieldValue<FieldTypes>
}>(Object.fromEntries(props.fieldTemplate.map(template => [
  template.id,
  {
    id: template.id,
    template: template.toDB(),
    value: fields.value.find(field => field.id === template.id)?.value ?? null
  }
])))

// watch(fields, () => {
//   if (JSON.stringify(fieldValues.value) === JSON.stringify(fields.value)) return

//   fieldValues.value =
// }, { immediate: true })

watch(fieldValues, (val) => {
  if (!val) return

  console.log(Object.values(val))
  fields.value = Object.values(val).filter(field => field.value !== null)
}, { deep: true })
</script>

<style scoped lang="scss">
@use '../scss' as r;

.item-fields-list {
  display: flex;
  flex-flow: column nowrap;
  gap: 1.5rem;
  padding: 1rem 0;

  list-style: none;
}
</style>
