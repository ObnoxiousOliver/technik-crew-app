<template>
  <ul class="item-fields-list">
    <ItemFieldsListItem
      v-for="template in fieldTemplate"
      :key="template.id"
      v-model:field="fieldValues[template.id]"
      :fieldTemplate="template"
    />
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
}>()
const emit = defineEmits(['update:fields'])

const fields = useVModel(props, 'fields', emit)

const fieldValues = ref<{
  [id: string]: FieldValue<FieldTypes>
}>({})

watch(fields, () => {
  Object.fromEntries(props.fieldTemplate.map(template => [
    template.id,
    {
      id: template.id,
      template,
      value: null
    }
  ]))
}, { immediate: true })

watch(fieldValues, (val) => {
  if (!val) return

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
}
</style>
