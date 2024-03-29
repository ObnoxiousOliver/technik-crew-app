<template>
  <li class="item-fields-list-item">
    <div class="item-fields-list-item__header">
      <span class="item-fields-list-item__name">
        {{ fieldTemplate.name }}
      </span>
      <span class="item-fields-list-item__desc text-secondary">
        {{ fieldTypes[fieldTemplate.type] }}
        {{ getOptionString(fieldTemplate) ? `- ${getOptionString(fieldTemplate)}` : '' }}
      </span>
    </div>

    <ItemFieldsListItemInput
      v-if="!readonly"
      v-model="fieldValue"
      :fieldTemplate="fieldTemplate"
      :string-suggestions="suggestions"
    />

    <div class="item-fields-list-item__display">
      <ItemFieldsListItemDisplay
        v-if="readonly"
        :fieldValue="fieldValue"
        :fieldTemplate="fieldTemplate"
      />
    </div>

  </li>
</template>

<script lang="ts" setup>
import { FieldTemplate, FieldTypes, fieldTypes, FieldValue, getOptionString } from '@/model/inventory/collectionField'
import { useVModel } from '@vueuse/core'
import { computed } from 'vue'
import ItemFieldsListItemInput from './ItemFieldsListItemInput.vue'
import ItemFieldsListItemDisplay from './ItemFieldsListItemDisplay.vue'
import { useInventory } from '@/stores/inventory'

const props = defineProps<{
  field: FieldValue<FieldTypes> | undefined
  fieldTemplate: FieldTemplate<FieldTypes>
  readonly?: boolean
  collectionId: string
}>()

const emit = defineEmits(['update:field'])

const field = useVModel(props, 'field', emit)

const suggestions = computed(() => {
  if (props.fieldTemplate.type === 'string') {
    return useInventory().getSuggestions(props.collectionId, props.fieldTemplate.id)
  }
  return undefined
})

const fieldValue = computed({
  get: () => {
    if (props.fieldTemplate.type === 'string') {
      return field.value?.value as string | null ?? ''
    }
    if (props.fieldTemplate.type === 'number') {
      return field.value?.value as number | null ?? ''
    }
    if (props.fieldTemplate.type === 'boolean') {
      return field.value?.value as boolean | null ?? null
    }
    if (props.fieldTemplate.type === 'date') {
      return field.value?.value as Date | null ?? null
    }
    if (props.fieldTemplate.type === 'time') {
      return field.value?.value as Date | null ?? null
    }
    if (props.fieldTemplate.type === 'datetime') {
      return field.value?.value as Date | null ?? null
    }
    if (props.fieldTemplate.type === 'enum') {
      return field.value?.value as string | null ?? ''
    }
    if (props.fieldTemplate.type === 'list') {
      return field.value?.value as (string | number | boolean)[] ?? []
    }

    return field.value?.value
  },
  set: (val) => {
    let value = val

    if (
      value === null ||
      value === '' ||
      (Array.isArray(value) && value?.length === 0)
    ) value = null

    field.value = {
      id: props.fieldTemplate.id,
      template: props.fieldTemplate.toDB(),
      value
    }
  }
})
</script>

<style scoped lang="scss">
@use '../scss' as r;

.item-fields-list-item {
  display: flex;
  flex-flow: column nowrap;
  gap: .5rem;

  &__header {
    display: flex;
    flex-flow: row nowrap;
    gap: .5rem;
  }
}

</style>
