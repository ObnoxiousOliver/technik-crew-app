<template>
  <div class="collection-fields-list-item">

    <div class="collection-fields-list-item__controls">
      <InputField
        v-model="field.name"
        label="Feldname"
        class="collection-fields-list-item__name"
      />

      <Btn square @click="emit('remove')">
        <i class="bi-trash" />
      </Btn>

      <Btn square @click="emit('moveUp')" :disabled="!canMoveUp">
        <i class="bi-chevron-up" />
      </Btn>
    </div>

    <div class="collection-fields-list-item__controls">
      <DropdownSelection
        v-model="field.type"
        class="collection-fields-list-item__type"
      >
        <option
          v-for="(option, key) in fieldTypes"
          :key="key"
          :value="key"
        >
          {{ option }}
        </option>
      </DropdownSelection>

      <Btn square @click="emit('moveDown')" :disabled="!canMoveDown">
        <i class="bi-chevron-down" />
      </Btn>
    </div>

    <div v-if="field.type === 'number'" class="collection-fields-list-item__options collection-fields-list-item__options--number">
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

    <div v-if="field.type === 'enum'" class="collection-fields-list-item__options collection-fields-list-item__options--enum">
      <ul v-if="enumOptions.length > 0">
        <li v-for="(option, i) in enumOptions" :key="i">
          <InputField
            class="collection-fields-list-item__options--enum__input"
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
  </div>
</template>

<script setup lang="ts">
import { fieldTypeNumberUnits, FieldTypeNumberUnits, FieldTypes, Option } from '@/model/inventory/collectionField'
import DropdownSelection from './DropdownSelection.vue'
import InputField from './FloatingLabelInput.vue'
import { ref, watch, watchEffect } from 'vue'
import { useVModel } from '@vueuse/core'

const props = defineProps<{
  field: {
    id: string
    name: string
    type: FieldTypes
    options: Option<FieldTypes>
  }
  canMoveUp: boolean
  canMoveDown: boolean
}>()
const emit = defineEmits(['update:modelValue', 'remove', 'moveUp', 'moveDown'])

const field = useVModel(props, 'field', emit)

const fieldTypes: {
  [key in FieldTypes]: string
} = {
  string: 'Text',
  number: 'Zahl',
  boolean: 'Ja/Nein',
  date: 'Datum',
  time: 'Uhrzeit',
  datetime: 'Datum und Uhrzeit',
  enum: 'Eigene Auswahl',
  list: 'Liste'
}

watchEffect(() => {
  if (field.value.type === 'number') {
    field.value.options = {
      number: {
        unit: unit.value,
        symbol: Object.keys(fieldTypeNumberUnits[unit.value]?.units)[unitSymbol.value]
      }
    } as Option<'number'>
  }
})

// Number
const unit = ref<FieldTypeNumberUnits>('none')
const unitSymbol = ref<number>(0)
watch(unit, () => {
  unitSymbol.value = 0
})

// Enum
const enumOptions = ref<string[]>([''])
</script>

<style scoped lang="scss">
@use '../scss' as r;

.collection-fields-list-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: .5rem;

  padding: .5rem;
  border-radius: r.$radius + .7rem;
  border: .2rem dashed r.$bg-secondary;
  background: r.$bg-primary;

  &__controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__options {
    margin-top: .5rem;
    display: flex;
    flex-flow: row wrap;
    gap: 0.5rem;
    width: stretch;

    & > * {
      flex: 1 1 auto;
      width: 0;
      min-width: 10rem;
    }

    &--enum {
      flex-direction: column;
      gap: 1rem;

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
          gap: 0.5rem;
          width: stretch;
        }
      }

      &__input {
        flex: 1 1 auto;
      }
    }
  }

  &__type, &__name {
    flex: 1 1 auto;
  }

  .btn {
    flex: 0 0 auto;
  }

  &-enter-active {
    transition: .5s cubic-bezier(0.19, 1, 0.22, 1);
  }

  &-leave-active {
    transition: .2s;
  }

  &-enter-from, &-leave-to {
    opacity: 0;
    transform: translateY(-1rem);
    margin-bottom: -7.85rem;
  }

  &-move {
    transition: transform .5s cubic-bezier(0.19, 1, 0.22, 1);
  }
}
</style>
