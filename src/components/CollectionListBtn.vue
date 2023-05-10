<template>
  <li class="collection-btn">
    <Btn
      ref="btn"
      :to="selectionMode ? undefined : {
        name: 'inventory',
        params: { id: collection.id }
      }"
      v-on-long-press.prevent="() => {
        if (!selectionMode) {
          selected = true
        }
      }"
      @click="() => {
        if (selectionMode) {
          selected = !selected
        }
      }"
      class="collection-btn__btn"
    >
      <div class="collection-btn__icon">
        <GlowDiv>
          <template v-if="collection.icon">
            {{ collection.icon }}
          </template>
          <template v-else>
            <i class="bi-collection" />
          </template>
        </GlowDiv>
      </div>
      <div class="collection-btn__name">
        {{ collection.name }}
      </div>
      <div class="collection-btn__desc">
        {{ collection.description ?? 'Keine Beschreibung' }}
      </div>
    </Btn>

    <Btn
      square
      transparent
      small
      aria-label="Optionen"
      @click="showOptions = true"
      class="collection-btn__options-btn"
      v-if="!selectionMode"
    >
      <i class="bi-three-dots-vertical" />
    </Btn>

    <InputCheckbox
      v-else
      class="collection-btn__checkbox"
      type="checkbox"
      v-model="selected"
    />

    <ActionSheet v-model:show="showOptions">
      <template #title>
        <template v-if="collection.icon">
          {{ collection.icon }}
        </template>
        {{ collection.name }}
      </template>

      <template #buttons>
        <ActionSheetButton>
          <i class="bi-pencil-square" />
          Bearbeiten
        </ActionSheetButton>
      </template>
    </ActionSheet>
  </li>
</template>

<script setup lang="ts">
import { Collection } from '@/model/inventory/collection'
import GlowDiv from './GlowDiv.vue'
import { useVModel } from '@vueuse/core'
import { vOnLongPress } from '@vueuse/components'
import InputCheckbox from './InputCheckbox.vue'
import { computed, ref } from 'vue'
import ActionSheet from './ActionSheet.vue'
import ActionSheetButton from './ActionSheetButton.vue'

const props = defineProps<{
  collection: Collection
  selected?: boolean
  selectionMode?: boolean
}>()
const emit = defineEmits(['update:selected'])

const _selected = useVModel(props, 'selected', emit)
const selected = computed({
  get: () => !!_selected.value,
  set: (v) => (_selected.value = v)
})

const showOptions = ref(false)
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.collection-btn {
  position: relative;
  margin: 1rem 0;

  &__btn {
    overflow: hidden;
    width: stretch;
    text-align: left;
    padding: 1.5rem;

    :deep(.btn__content) {
      display: grid;
      grid-template-columns: 2.5rem 1fr;
      gap: 1rem 0;
    }
  }

  &__options-btn {
    position: absolute;
    inset: 1rem 1rem auto auto;
  }

  &__checkbox {
    position: absolute;
    inset: 1rem 1rem auto auto;
  }

  &__icon, &__name {
    grid-row: 1;
    font-size: 1.5rem;
  }

  &__desc {
    grid-column: 1 / -1;
    font-weight: normal;
    color: r.$text-secondary;
    line-height: 1.2rem;
    max-height: 1.2rem * 3;
    text-overflow: ellipsis;
    overflow: hidden;

    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
}
</style>
