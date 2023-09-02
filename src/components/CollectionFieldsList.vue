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
    <div class="collection-fields-list__buttons">
      <Btn @click="addField()">
        <i class="bi-plus-lg btn__icon" />Feld hinzufügen
      </Btn>
      <Btn square @click="showPresetSheet = true">
        <i class="bi-grid" />
      </Btn>
    </div>
  </div>

  <ActionSheet v-model:show="showPresetSheet">
    <template #title>
      <i class="bi-grid" />Vorlagen
    </template>

    <CollectionFieldPresetList
      @select="(preset) => {
        addField(preset)
        showPresetSheet = false
      }"
    />

    <template #buttons>
      <ActionSheetButton @click="showPresetSheet = false">
        <i class="bi-x" />Abbrechen
      </ActionSheetButton>
    </template>
  </ActionSheet>
</template>

<script setup lang="ts">
import { FieldTemplate, FieldTypes } from '@/model/inventory/collectionField'
import CollectionFieldsListItem from './CollectionFieldsListItem.vue'
import { useVModel } from '@vueuse/core'
import ActionSheet from './ActionSheet.vue'
import { ref } from 'vue'
import ActionSheetButton from './ActionSheetButton.vue'
import CollectionFieldPresetList from './CollectionFieldPresetList.vue'

const props = defineProps<{
  modelValue: FieldTemplate<FieldTypes>[]
}>()
const emit = defineEmits(['update:modelValue'])

const fields = useVModel(props, 'modelValue', emit)

const showPresetSheet = ref(false)

function addField (preset?: FieldTemplate<FieldTypes>) {
  if (preset) {
    fields.value.push(new FieldTemplate<FieldTypes>({
      name: preset.name,
      type: preset.type,
      options: preset.options
    }))
  } else {
    fields.value.push(new FieldTemplate<FieldTypes>())
  }
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
    border: .2rem dashed r.$bg-stroke;
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

  &__buttons {
    display: flex;
    flex-flow: row wrap;
    gap: 0.5rem;
    justify-content: stretch;

    :not(:last-child) {
      flex: 1 1 auto;
    }
  }
}
</style>
