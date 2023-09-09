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
    <div class="item-fields-list-item-input item-fields-list-item-input--date">
      <InputCheckbox v-model="fieldValueNullDate" />
      <DateSelect
        :disabled="!fieldValueNullDate"
        v-model="fieldValueDate"
        noClear
      />
    </div>
  </template>

  <template v-if="fieldTemplate.type === 'time'">
    <div class="item-fields-list-item-input item-fields-list-item-input--time">
      <InputCheckbox v-model="fieldValueNullTime" />
      <TimeSelect
        v-if="fieldValueTime"
        :disabled="!fieldValueNullTime"
        v-model="fieldValueTime"
      />
    </div>
  </template>

  <template v-if="fieldTemplate.type === 'datetime'">
    <div class="item-fields-list-item-input item-fields-list-item-input--datetime">
      <InputCheckbox v-model="fieldValueNullDatetime" />
      <DateTimeSelect
        v-if="fieldValueDatetime"
        :disabled="!fieldValueNullDatetime"
        v-model="fieldValueDatetime"
        noClear
      />
    </div>
  </template>

  <template v-if="fieldTemplate.type === 'enum'">
    <div class="item-fields-list-item-input item-fields-list-item-input--enum">
      <DropdownSelection v-model="fieldValue">
        <option value="">
          Keine Auswahl
        </option>
        <option v-for="(option, i) in fieldTemplate.options.enum" :key="i">
          {{ option }}
        </option>
      </DropdownSelection>
    </div>
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

  <!-- {{ fieldValue }} -->
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
import DateTimeSelect from './DateTimeSelect.vue'

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
  if (val !== null) {
    fieldValueBool.value = val
  }
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
function getDateAsString (date: Date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

const fieldValueDate = ref(new Date())
watch(fieldValueDate, (val, old) => {
  if (props.fieldTemplate.type !== 'date') return

  if (val === null) {
    fieldValueDate.value = old
    return
  }

  fieldValue.value = fieldValueNullDate.value ? getDateAsString(val) : null
})
watch(fieldValue, (val) => {
  if (props.fieldTemplate.type !== 'date') return
  if (val) {
    fieldValueDate.value = new Date(val)
  }
})
const fieldValueNullDate = computed<boolean>({
  get: () => {
    if (props.fieldTemplate.type === 'date') {
      return fieldValue.value !== null
    }
    return false
  },
  set: (val) => {
    if (props.fieldTemplate.type !== 'date') return
    fieldValue.value = val ? getDateAsString(fieldValueDate.value) : null
  }
})

// Time
function getTimeAsString (time: Date) {
  return `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`
}

const fieldValueTime = ref(new Date())
watch(fieldValueTime, (val) => {
  if (props.fieldTemplate.type !== 'time') return
  fieldValue.value = fieldValueNullTime.value ? getTimeAsString(val) : null
})
watch(fieldValue, (val) => {
  if (props.fieldTemplate.type !== 'time') return
  if (val) {
    fieldValueTime.value = new Date('0 ' + val)
  }
})
const fieldValueNullTime = computed<boolean>({
  get: () => {
    if (props.fieldTemplate.type === 'time') {
      return fieldValue.value !== null
    }
    return false
  },
  set: (val) => {
    if (props.fieldTemplate.type !== 'time') return
    fieldValue.value = val ? getTimeAsString(fieldValueTime.value) : null
  }
})

// Datetime
function getDatetimeAsString (datetime: Date) {
  return `${getDateAsString(datetime)} ${getTimeAsString(datetime)}`
}

const fieldValueDatetime = ref(new Date())
watch(fieldValueDatetime, (val) => {
  if (props.fieldTemplate.type !== 'datetime') return
  fieldValue.value = fieldValueNullDatetime.value ? getDatetimeAsString(val) : null
})
watch(fieldValue, (val) => {
  if (props.fieldTemplate.type !== 'datetime') return
  if (val) {
    fieldValueDatetime.value = new Date(val)
  }
})
const fieldValueNullDatetime = computed<boolean>({
  get: () => {
    if (props.fieldTemplate.type === 'datetime') {
      // console.log(fieldValue.value)
      return fieldValue.value !== null
    }
    return false
  },
  set: (val) => {
    if (props.fieldTemplate.type !== 'datetime') return
    fieldValue.value = val ? getDatetimeAsString(fieldValueDatetime.value) : null
  }
})

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

  &--time, &--date, &--datetime {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: .5rem;

    & > :nth-child(2) {
      flex: 1 1 auto;
    }
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
