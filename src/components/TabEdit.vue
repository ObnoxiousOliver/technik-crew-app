<template>
  <div class="tab-edit">
    <div class="tab-edit__header">
      <span class="text-secondary">
        Seite {{ index + 1 }} von {{ tabs.length }}
      </span>
      <template v-if="tabs.length > 1">
        <Btn
          small
          square
          transparent
          aria-label="vorherige Seite"
          @click="prevTab"
        >
          <i class="bi-chevron-left" />
        </Btn>
        <Btn
          small
          square
          transparent
          aria-label="nächste Seite"
          @click="nextTab"
        >
          <i class="bi-chevron-right" />
        </Btn>
      </template>
      <Btn
        small
        square
        transparent
        aria-label="Seite Hinzufügen"
        @click="addTab"
      >
        <i class="bi-plus-lg" />
      </Btn>
    </div>
    <FocusTrap
      :active="expanded"
      :click-outside-deactivates="true"
      @deactivate="expanded = false"
    >
      <div class="tab-edit__container">
        <Transition name="tab-edit">
          <template v-if="expanded && tabs.length > 1">
            <Draggable
              v-model="tabs"
              item-key="id"
              class="tab-edit__list"
              handle=".tab-edit-btn__grip"
              ghost-class="tab-edit-btn--ghost"
              :component-data="{
                style: {
                  '--height': (tabs.length * 3.5 - 0.5) + 'rem'
                }
              }"
            >
              <template #item="{element}">
                <TabEditBtn
                  v-model:title="element.title"
                  @removeTab="removeTab(element.id)"
                  :active="element.id === activeId"
                  @selected="() => {
                    activeId = element.id
                    nextTick(() => {
                      expanded = false
                    })
                  }"
                />
              </template>
            </Draggable>
          </template>
          <TabEditBtn
            v-else
            :style="{
              '--top-offset': (index * 3.5) + 'rem',
            }"
            class="tab-edit__expand-btn"
            @selected="expanded = true"
            v-model:title="currentTab.title"
            noHandle
          />
        </Transition>
      </div>
    </FocusTrap>
  </div>
</template>

<script setup lang="ts">
import { WikiPageTabDB } from '@/model/wiki'
import { createId } from '@/utilities/id'
import { useVModels } from '@vueuse/core'
import { computed, nextTick, ref, watchEffect } from 'vue'
import TabEditBtn from './TabEditBtn.vue'
import Draggable from 'vuedraggable'
import { FocusTrap } from 'focus-trap-vue'

const props = defineProps<{
  modelValue: WikiPageTabDB[]
  index: number
}>()

const emit = defineEmits(['update:modelValue', 'update:index'])

const {
  index,
  modelValue
} = useVModels(props, emit)

const tabs = ref<(WikiPageTabDB & { id: string })[]>(
  modelValue.value.map(tab => ({ ...tab, id: createId() }))
)
watchEffect(() => {
  modelValue.value = tabs.value.map(tab => ({
    title: tab.title,
    content: tab.content
  }))
})
const currentTab = computed(() => tabs.value[index.value])

const expanded = ref(false)

const activeId = ref<string>(tabs.value[0]?.id ?? '')
watchEffect(() => {
  index.value = tabs.value.findIndex(tab => tab.id === activeId.value)
})

function nextTab () {
  index.value = (index.value + 1) % tabs.value.length
}

function prevTab () {
  index.value = (index.value - 1 + tabs.value.length) % tabs.value.length
}

function addTab () {
  tabs.value.push({
    title: null,
    content: {},
    id: createId()
  })
  activeId.value = tabs.value.slice(-1)[0].id
}

function removeTab (id: string) {
  const index = tabs.value.findIndex(tab => tab.id === id)
  tabs.value.splice(index, 1)
  if (activeId.value === id) {
    activeId.value = tabs.value[index]?.id ?? tabs.value[index - 1]?.id ?? ''
  }
}
</script>

<style scoped lang="scss">
@use '../scss' as r;

.tab-edit {
  &__header {
    padding-left: .2rem;
    margin-bottom: .5rem;
    display: flex;
    align-items: center;

    span {
      flex: 1;
    }

    .btn {
      font-size: 1rem;
    }
  }

  &__container {
    position: relative;
    margin-bottom: 1rem;
    max-height: calc(100vh - 15rem);
    overflow-y: auto;
  }

  &__list {
    display: flex;
    flex-flow: column nowrap;
    gap: 0.5rem;
    overflow: hidden;

    &.tab-edit-enter-active {
      transition: height .5s cubic-bezier(0.19, 1, 0.22, 1), .5s opacity;
      height: 3.5rem;

      :deep(.tab-edit-btn--active) {
        opacity: 0;
      }
    }

    &.tab-edit-enter-from {
      opacity: 0;
    }
    &.tab-edit-enter-to {
      height: var(--height);
    }
    &.tab-edit-leave-active {
      pointer-events: none;
      transition: 1s, height .5s cubic-bezier(0.19, 1, 0.22, 1), .5s opacity;
      height: var(--height);

      :deep(.tab-edit-btn--active) {
        opacity: 0;
      }
    }
    &.tab-edit-leave-to {
      height: 3rem;
      opacity: 0;
    }
  }

  &__expand-btn {
    &.tab-edit-leave-active {
      z-index: 1;
      pointer-events: none;
      position: absolute !important;
      inset: 0 0 auto 0;

      transition:
        transform .5s cubic-bezier(0.19, 1, 0.22, 1),
        opacity .5s .5s;

      :deep(.tab-edit-btn__title) {
        transition: .5s cubic-bezier(0.19, 1, 0.22, 1);
      }
    }
    &.tab-edit-leave-to {
      transform: translateY(var(--top-offset));
      opacity: 0;

      :deep(.tab-edit-btn__title) {
        margin-left: 0;
      }
      :deep(.tab-edit-btn__grip) {
        opacity: 1;
      }
    }

    &.tab-edit-enter-active {
      z-index: 1;
      position: absolute !important;
      inset: 0 0 auto 0;

      transition:
        transform .5s cubic-bezier(0.19, 1, 0.22, 1),
        opacity .5s .5s;

      :deep(.tab-edit-btn__title) {
        transition: .5s cubic-bezier(0.19, 1, 0.22, 1);
      }
    }
    &.tab-edit-enter-from {
      transform: translateY(var(--top-offset));

      :deep(.tab-edit-btn__grip) {
        opacity: 1;
      }
      :deep(.tab-edit-btn__title) {
        margin-left: 0;
      }
    }
  }
}
</style>
