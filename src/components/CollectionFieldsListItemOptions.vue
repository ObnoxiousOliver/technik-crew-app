<template>
  <!-- String -->
  <div v-if="field.type === 'string'" class="collection-fields-list-item-option collection-fields-list-item-option--string">
    <div>
      <label :for="'multiline' + id">
        Mehrzeilig
      </label>
      <ToggleSwitch
        :id="'multiline' + id"
        v-model="multiline"
      />
    </div>

    <div>
      <label :for="'autofill' + id">
        Textvorschläge
      </label>
      <ToggleSwitch
        :disabled="multiline"
        :id="'autofill' + id"
        v-model="autofill"
      />
    </div>
  </div>

  <!-- Number -->
  <div v-if="field.type === 'number'" class="collection-fields-list-item-option collection-fields-list-item-option--number">
    <DropdownSelection v-model="unit">
      <option
        v-for="(unit, i) in fieldTypeNumberUnits"
        :key="i"
        :value="i"
      >
        {{ unit.name }}
      </option>
    </DropdownSelection>
    <DropdownSelection
      v-if="unit !== 'none'"
      v-model="unitSymbol"
    >
      <option
        v-for="(symbol, i) in Object.keys(fieldTypeNumberUnits[unit]?.units)"
        :key="symbol"
        :value="i"
      >
        {{ symbol }} ({{ fieldTypeNumberUnits[unit]?.units[symbol] }})
      </option>
    </DropdownSelection>
  </div>

  <!-- Enum -->
  <div v-if="field.type === 'enum'" class="collection-fields-list-item-option collection-fields-list-item-option--enum">
    <ul v-if="enumOptions.length > 0">
      <li v-for="(option, i) in enumOptions" :key="i">
        <InputField
          class="collection-fields-list-item-option--enum__input"
          v-model="enumOptions[i]"
          :label="`${i + 1}. Option`"
        />
        <Btn
          square
          @click="enumOptions.splice(i, 1)"
        >
          <i class="bi-trash" />
        </Btn>
      </li>
    </ul>
    <Btn @click="enumOptions.push('')">
      <i class="bi-plus-lg btn__icon" />Option hinzufügen
    </Btn>
  </div>

  <!-- List -->
  <template v-if="field.type === 'list'">
    <div class="collection-fields-list-item-option collection-fields-list-item-option--list">
      <DropdownSelection v-model="listOptions.type">
        <option
          v-for="(type, i) in listFieldTypes"
          :key="i"
          :value="i"
        >
          {{ type }}
        </option>
      </DropdownSelection>

      <CollectionFieldsListItemOptions
        v-if="listOptions.type !== 'list'"
        v-model:field="listOptions"
      />
    </div>
  </template>
</template>

<script setup lang="ts">
import { FieldTemplateBase, FieldTypeNumberUnits, FieldTypes, Option, fieldTypeNumberUnits, fieldTypes } from '@/model/inventory/collectionField'
import DropdownSelection from './DropdownSelection.vue'
import InputField from './InputField.vue'
import { ref, watch, watchEffect } from 'vue'
import { useVModel } from '@vueuse/core'
import ToggleSwitch from './ToggleSwitch.vue'
import { createId } from '@/utilities/id'

const id = ref(createId())

const props = defineProps<{
  field: {
    type: FieldTypes
    options: Option<FieldTypes>
  }
}>()
const emit = defineEmits(['update:field'])

const field = useVModel(props, 'field', emit)

// String
const multiline = ref<boolean>(props.field.options.string?.multiline ?? false)
const autofill = ref<boolean>(props.field.options.string?.autofill ?? false)
watch([multiline, autofill], () => {
  field.value.options = {
    string: {
      multiline: multiline.value,
      autofill: multiline.value ? false : autofill.value
    }
  } as Option<'string'>
})

// Number
const unit = ref<FieldTypeNumberUnits>(props.field.options.number?.unit ?? 'none')
const unitSymbol = ref<number>(Object.keys(fieldTypeNumberUnits[unit.value]?.units).indexOf(props.field.options.number?.symbol ?? '') ?? 0)
watch(unit, () => {
  unitSymbol.value = 0
})

// Enum
const enumOptions = ref<string[]>(props.field.options?.enum ?? [''])

// List
const listOptions = ref<FieldTemplateBase<FieldTypes>>(props.field.options.list ?? {
  type: 'string',
  options: {}
})
const listFieldTypes = Object.fromEntries(Object.entries(fieldTypes).filter(type => type[0] !== 'list'))

// Watch for changes in the field type
watchEffect(() => {
  if (field.value.type === 'number') {
    field.value.options = {
      number: {
        unit: unit.value,
        symbol: Object.keys(fieldTypeNumberUnits[unit.value]?.units)[unitSymbol.value] ?? ''
      }
    } as Option<'number'>
  }
  if (field.value.type === 'enum') {
    field.value.options = {
      enum: enumOptions.value
    } as Option<'enum'>
  }
  if (field.value.type === 'list') {
    field.value.options = {
      list: listOptions.value
    } as Option<'list'>
  }
})

</script>

<style scoped lang="scss">
@use '../scss' as r;

.collection-fields-list-item-option {
  margin-top: .5rem;
  display: flex;
  flex-flow: row wrap;
  gap: 0.5rem;
  width: stretch;

  > * {
    flex: 1 1 auto;
    width: 0;
    min-width: 10rem;
  }

  > .collection-fields-list-item-option {
    width: stretch;
  }

  &--string {
    padding-left: .5rem;

    & > div {
      width: stretch;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      label {
        flex: 1 1 auto;
      }
    }
  }

  &--enum {
    flex-direction: column;
    gap: .5rem;

    & > * {
      width: stretch;
    }

    ul {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      list-style: none;

      li {
        display: flex;
        align-items: center;
        width: stretch;

        .btn {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }

      }
    }

    &__input {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      flex: 1 1 auto;
    }
  }
}
</style>
