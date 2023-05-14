<template>
  <FocusTrap
    :active="edit"
    :click-outside-deactivates="true"
    @deactivate="() => {
      title = editableTitle || null
      edit = false
    }"
  >
    <div
      :class="['tab-edit-btn', {
        'tab-edit-btn--active': active,
        'tab-edit-btn--edit': edit,
        'tab-edit-btn--no-handle': noHandle
      }]"
      v-bind="$attrs"
      @keydown.esc="edit = false"
      v-wave="!edit"
    >
      <Transition name="tab-edit-btn__active-indicator">
        <div v-if="active" class="tab-edit-btn__active-indicator" />
      </Transition>
      <i
        class="bi-grip-vertical tab-edit-btn__grip"
        :style="{
          opacity: edit ? 0 : undefined,
          pointerEvents: edit ? 'none' : undefined
        }"
      />

      <input
        v-if="edit"
        class="tab-edit-btn__title"
        v-model="editableTitle"
        type="text"
        placeholder="Unbenannte Seite"
        autocomplete="off"
        ref="titleInput"
        @keydown.enter="() => {
          title = editableTitle || null
          edit = false
        }"
      />
      <button
        v-else
        v-wave-trigger
        @click="emit('selected')"
        :class="['tab-edit-btn__title', {
          'tab-edit-btn__title--placeholder': !title
        }]"
      >
        {{ title || 'Unbenannte Seite' }}
      </button>
      <div class="tab-edit-btn__btns">
        <template v-if="edit">
          <Btn
            small
            square
            transparent
            @click="() => {
              title = editableTitle || null
              edit = false
            }"
          >
            <i class="bi-check2" />
          </Btn>
          <Btn
            small
            square
            transparent
            @click="edit = false"
          >
            <i class="bi-x-lg" />
          </Btn>
        </template>
        <template v-else>

          <Btn
            small
            square
            transparent
            @click="edit = true"
          >
            <i class="bi-input-cursor-text" />
          </Btn>
          <Btn
            small
            square
            transparent
            @click="showOptions = true"
          >
            <i class="bi-three-dots-vertical" />
          </Btn>
        </template>
      </div>

      <ActionSheet v-model:show="showOptions">
        <template #title>
          {{ title ?? 'Unbenannte Seite' }}
        </template>

        <template #buttons>
          <ActionSheetButton danger @click="removeTab">
            <i class="bi-trash" /> Löschen
          </ActionSheetButton>
          <ActionSheetButton @click="edit = true">
            <i class="bi-input-cursor-text" /> Umbenennen
          </ActionSheetButton>
          <ActionSheetDivider />
          <ActionSheetButton>
            <i class="bi-x-lg" /> Abbrechen
          </ActionSheetButton>
        </template>
      </ActionSheet>
    </div>
  </FocusTrap>
</template>

<script lang="ts" setup>
import { useVModel } from '@vueuse/core'
import { ref, watchEffect } from 'vue'
import ActionSheet from './ActionSheet.vue'
import ActionSheetButton from './ActionSheetButton.vue'
import ActionSheetDivider from './ActionSheetDivider.vue'
import { FocusTrap } from 'focus-trap-vue'

const props = defineProps<{
  title?: string | null
  active?: boolean,
  noHandle?: boolean
}>()

const emit = defineEmits([
  'removeTab',
  'update:title',
  'selected'
])

const edit = ref(false)

const title = useVModel(props, 'title', emit)

const editableTitle = ref()
const titleInput = ref<HTMLInputElement>()

watchEffect(() => {
  editableTitle.value = title.value ?? ''
})

watchEffect(() => {
  if (edit.value) {
    titleInput.value?.focus()
  } else {
    editableTitle.value = title.value ?? ''
  }
})

const showOptions = ref(false)

function removeTab () {
  emit('removeTab')
}
</script>

<style scoped lang="scss">
@use '../scss' as r;

.tab-edit-btn {
  flex: 0 0 auto;
  @include r.box;
  display: flex;
  align-items: center;
  overflow: hidden;

  &--ghost {
    background: none;
    box-shadow: r.$bg-stroke 0 0 0 .1rem inset;
    color: r.$text-secondary;

    .tab-edit-btn__active-indicator {
      display: none;
    }
  }

  &--no-handle &__title {
    margin-left: -1rem;
  }
  &--no-handle &__grip {
    opacity: 0;
    pointer-events: none;
  }

  &__grip {
    position: relative;
    cursor: grab;
    color: r.$text-secondary;
    transition: .2s;
    display: flex;
    align-items: center;
    justify-content: center;

    height: 3rem;
    width: 3rem;
    margin-right: -.5rem;

    .tab-edit-btn--active & {
      color: inherit;
    }
  }

  &__active-indicator {
    flex: 0 0 auto;
    width: .2rem;
    height: 1rem;
    border-radius: 1rem;
    background: r.$accent;
    box-shadow:
      r.$accent 0 0 .1rem,
      r.$accent 0 0 1rem,
      r.$accent 0 0 2rem,
      r.$accent 0 0 3rem,
    ;
    margin-right: -.2rem;

    &-enter-active, &-leave-active {
      transition: .5s;
    }

    &-enter-from, &-leave-to {
      transform: translateX(-.3rem);
      box-shadow: 0 0 0 0 r.$accent;
    }
  }

  &__title {
    flex: 1 1 auto;
    font: inherit;
    border: none;
    background: none;
    color: inherit;
    height: 3rem;
    width: 0;

    &:focus-visible {
      outline: none;
    }

    &::placeholder, &--placeholder {
      color: r.$text-secondary;
    }

    &:not(input) {
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &:is(input) {
      touch-action: manipulation;
    }
  }

  &__btns {
    flex: 0 0 auto;
    margin-right: .5rem;
  }
}
</style>
