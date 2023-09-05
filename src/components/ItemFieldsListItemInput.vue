<template>
  <template v-if="fieldTemplate.type === 'string'">
    <InputField
      class="item-fields-list-item-input w-stretch"
      v-model="fieldValue"
      placeholder="Kein Wert"
    />
  </template>

  <template v-if="fieldTemplate.type === 'number'">
    <InputField
      class="item-fields-list-item-input w-stretch"
      v-model="fieldValue"
      placeholder="Kein Wert"
      type="number"
      after-padding
    >
      <template v-if="fieldTemplate.options.number?.symbol" #after>
        {{ fieldTemplate.options.number?.symbol }}
      </template>
    </InputField>
  </template>

  <template v-if="fieldTemplate.type === 'boolean'">
    <div class="item-fields-list-item-input item-fields-list-item-input--boolean">
      <InputCheckbox v-model="fieldValueNullBool" />
      <ToggleSwitch v-model="fieldValueBool" :disabled="!fieldValueNullBool" />
      <span class="text-secondary">
        <i v-if="!fieldValueNullBool">Kein Wert</i>
        <template v-else>
          {{ fieldValueBool ? 'Ja' : 'Nein' }}
        </template>
      </span>
    </div>
  </template>

  <template v-if="fieldTemplate.type === 'date'">
    <DateSelect
      class="item-fields-list-item-input w-stretch"
      v-model="fieldValueDate"
    />
  </template>
  <template v-if="fieldTemplate.type === 'time'">
    <TimeSelect
      class="item-fields-list-item-input w-stretch"
      v-model="fieldValueTime"
    />
  </template>

  <template v-if="fieldTemplate.type === 'enum'">
    <DropdownSelection
      class="item-fields-list-item-input w-stretch"
      v-model="fieldValue"
    >
      <option value="">
        Keine Auswahl
      </option>
      <option v-for="(option, i) in fieldTemplate.options.enum" :key="i">
        {{ option }}
      </option>
    </DropdownSelection>
  </template>

  <template v-if="fieldTemplate.type === 'list'">
    <div
      v-for="(_, i) in fieldValue"
      :key="i"
      class="item-fields-list-item-input item-fields-list-item-input--list"
    >
      <div>
        {{ i + 1 }}.
      </div>

      <div>
        <ItemFieldsListItemInput
          v-model="fieldValue[i]"
          @update:model-value="cleanList()"
          :fieldTemplate="{
            type: fieldTemplate.options.list?.type ?? 'string',
            options: fieldTemplate.options.list?.options ?? {}
          }"
        />
      </div>

      <Btn square @click="removeItem(i)">
        <i class="bi-trash" />
      </Btn>
    </div>
    <Btn @click="addItem()">
      <i class="bi-plus-lg btn__icon" />Wert hinzufügen
    </Btn>
  </template>
</template>

<script lang="ts" setup>
import { FieldTemplateBase, FieldTypes } from '@/model/inventory/collectionField'
import { useVModel } from '@vueuse/core'
import InputField from './InputField.vue'
import DropdownSelection from './DropdownSelection.vue'
import ToggleSwitch from './ToggleSwitch.vue'
import DateSelect from './DateSelect.vue'
import { computed, ref, watch } from 'vue'
import InputCheckbox from './InputCheckbox.vue'
import TimeSelect from './TimeSelect.vue'

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modelValue: any
  fieldTemplate: FieldTemplateBase<FieldTypes>
}>()

const emit = defineEmits(['update:modelValue'])

const fieldValue = useVModel(props, 'modelValue', emit)

// Boolean
const fieldValueBool = ref(false)
watch(fieldValueBool, (val) => {
  if (props.fieldTemplate.type !== 'boolean') return
  fieldValue.value = fieldValueNullBool.value ? val : null
})
watch(fieldValue, (val) => {
  if (props.fieldTemplate.type !== 'boolean') return
  fieldValueBool.value = val ?? fieldValueBool.value
})
const fieldValueNullBool = computed<boolean>({
  get: () => {
    if (props.fieldTemplate.type === 'boolean') {
      return fieldValue.value !== null
    }
    return false
  },
  set: (val) => {
    if (props.fieldTemplate.type !== 'boolean') return
    fieldValue.value = val ? fieldValueBool.value : null
  }
})

// Date
const fieldValueDate = computed({
  get: () => {
    if (props.fieldTemplate.type === 'date') {
      return fieldValue.value ? new Date(fieldValue.value) : null
    }
    return null
  },
  set: (val) => {
    if (props.fieldTemplate.type !== 'date') return

    if (!val) {
      fieldValue.value = val
      return
    }

    fieldValue.value = `${val.getFullYear()}-${(val.getMonth() + 1).toString().padStart(2, '0')}-${val.getDate().toString().padStart(2, '0')}`
  }
})

// Time
// const fieldValueTime = computed({
//   get: () => {
//     if (props.fieldTemplate.type === 'time') {
//       console.log(fieldValue.value)
//       return fieldValue.value ? new Date(fieldValue.value) : new Date()
//     }
//     return null
//   },
//   set: (val) => {
//     if (props.fieldTemplate.type !== 'time') return

//     if (!val) {
//       fieldValue.value = new Date()
//       return
//     }

//     fieldValue.value = `${val?.getHours().toString().padStart(2, '0')}:${val?.getMinutes().toString().padStart(2, '0')}`
//   }
// })

// List
function cleanList () {
  if (props.fieldTemplate.type !== 'list') return
  if (props.fieldTemplate.options.list?.type === 'string') {
    fieldValue.value = fieldValue.value.map((v: unknown) => v === '' ? null : v)
  }
}

function addItem () {
  if (props.fieldTemplate.type !== 'list') return

  switch (props.fieldTemplate.options.list?.type) {
    case 'string':
    case 'number':
    case 'date':
    case 'time':
    case 'datetime':
      fieldValue.value.push(null)
      break
    case 'boolean':
      fieldValue.value.push(null)
      break
  }
  fieldValue.value = [...fieldValue.value]
  cleanList()
}

function removeItem (i: number) {
  if (props.fieldTemplate.type !== 'list') return
  fieldValue.value.splice(i, 1)
  fieldValue.value = [...fieldValue.value]
  cleanList()
}
</script>

<style scoped lang="scss">
@use '../scss' as r;

.item-fields-list-item-input {
  &--boolean {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: .5rem;
  }

  &--list {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: .5rem;

    > :nth-child(1) {
      width: 2rem;
    }

    > :nth-child(2) {
      flex: 1 1 auto;
    }
  }
}
</style>
