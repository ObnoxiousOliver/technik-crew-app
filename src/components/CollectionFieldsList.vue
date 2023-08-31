<template>
  <div class="collection-fields-list">
    <Transition name="collection-fields-list__empty">
      <div v-if="fields.length === 0" class="collection-fields-list__empty">
        <i class="bi-collection" />
        <span>Keine Felder vorhanden</span>
      </div>
    </Transition>

    <TransitionGroup name="collection-fields-list-item">
      <CollectionFieldsListItem
        v-for="(field, i) in fields"
        :key="field.id ?? i"
        :field="field"
        @remove="fields.splice(i, 1)"
        @moveUp="fields.splice(i - 1, 0, fields.splice(i, 1)[0])"
        @moveDown="fields.splice(i + 1, 0, fields.splice(i, 1)[0])"
        :canMoveUp="i > 0"
        :canMoveDown="i < fields.length - 1"
      />
    </TransitionGroup>
    <Btn
      class="collection-fields-list__add-field"
      @click="addField"
    >
      <i class="bi-plus-lg btn__icon" />Feld hinzufügen
    </Btn>
  </div>
</template>

<script setup lang="ts">
import { FieldTemplate, FieldTypes } from '@/model/inventory/collectionField'
import CollectionFieldsListItem from './CollectionFieldsListItem.vue'
import { useVModel } from '@vueuse/core'

const props = defineProps<{
  modelValue: FieldTemplate<FieldTypes>[]
}>()
const emit = defineEmits(['update:modelValue'])

const fields = useVModel(props, 'modelValue', emit)

function addField () {
  fields.value.push(new FieldTemplate<FieldTypes>())
}
</script>

<style scoped lang="scss">
@use '../scss' as r;

.collection-fields-list {
  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    padding: .5rem;
    border-radius: r.$radius + .7rem;
    border: .2rem dashed r.$bg-secondary;
    background: r.$bg-primary;
    margin-bottom: .5rem;

    height: 6rem;

    i {
      font-size: 2.5rem;
    }

    &-enter-active {
      transition: .2s;
    }

    &-leave-active {
      transition: .5s cubic-bezier(0.19, 1, 0.22, 1);
    }

    &-enter-from, &-leave-to {
      opacity: 0;
      margin-bottom: -6rem;
    }
  }

  &__add-field {
    width: stretch;
    margin-top: .5rem;
  }
}
</style>
