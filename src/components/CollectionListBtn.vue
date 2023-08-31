<template>
  <li class="collection-btn">
    <!-- :class="['collection-btn', {
      'collection-btn--selected': selected,
      'collection-btn--selection-mode': selectionMode
    }]" -->
    <!-- v-on-long-press.prevent="longPress"
    @click="click" -->
    <Btn
      ref="btn"
      class="collection-btn__btn"
      :to="{
        name: 'inventory-collection',
        params: {
          id: collection.id
        }
      }"
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

    <!-- <Btn
      square
      transparent
      small
      aria-label="Optionen"
      @click="showOptions = true"
      class="collection-btn__options-btn"
      v-if="!selectionMode"
    >
      <i class="bi-three-dots-vertical" />
    </Btn> -->

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
import { ref } from 'vue'
import ActionSheet from './ActionSheet.vue'
import ActionSheetButton from './ActionSheetButton.vue'
import AppButton from './AppButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{
  collection: Collection
  // selected?: boolean
  // selectionMode?: boolean
}>()
// const emit = defineEmits(['update:selected'])

const btn = ref<typeof AppButton | null>(null)

// const _selected = useVModel(props, 'selected', emit)
// const selected = computed({
//   get: () => !!_selected.value,
//   set: (v) => (_selected.value = v)
// })

const showOptions = ref(false)

// const ignoreClick = ref(false)
// function click () {
//   if (ignoreClick.value) {
//     ignoreClick.value = false
//     return
//   }

//   if (props.selectionMode) {
//     selected.value = !selected.value
//   } else {
//     router.push({
//       name: 'inventory-collection',
//       params: {
//         id: props.collection.id
//       }
//     })
//   }
// }

// function longPress () {
//   if (!props.selectionMode) {
//     selected.value = true
//     ignoreClick.value = true

//     btn.value?.el.addEventListener('pointerup', () => {
//       setTimeout(() => {
//         ignoreClick.value = false
//       })
//     }, { once: true })
//   }
// }
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.collection-btn {
  position: relative;
  margin: 1rem 0;
  border-radius: r.$radius;
  transition: .5s cubic-bezier(0.19, 1, 0.22, 1);

  &--selection-mode:not(&--selected) {
    animation: .2s wiggle infinite;

    @keyframes wiggle {
      0%, 100% {
        transform: rotate(0.5deg);
      }
      50% {
        transform: rotate(-0.5deg);
      }
    }
  }

  &--selected {
    padding: .4rem;

    .collection-btn__btn {
      padding: 1.1rem;
      border-radius: r.$radius - .4rem;

      :deep(.btn__content) {
        transform: scale(.97);
      }
    }
    box-shadow: r.$accent 0 0 0 0.1rem;
  }

  &__btn {
    overflow: hidden;
    width: stretch;
    text-align: left;
    padding: 1.5rem;

    transition:
      border-radius .5s cubic-bezier(0.19, 1, 0.22, 1),
      padding .5s cubic-bezier(0.19, 1, 0.22, 1),
      background-color .2s,
      box-shadow .2s,
      opacity .2s;

    :deep(.btn__content) {
      transition: transform .5s cubic-bezier(0.19, 1, 0.22, 1);
      display: grid;
      grid-template-columns: 2.5rem 1fr;
      gap: 1rem 0;
    }
  }

  &__options-btn {
    position: absolute;
    inset: 1rem 1rem auto auto;
  }

  &__icon, &__name {
    grid-row: 1;
    font-size: 1.5em;
  }

  &__desc {
    grid-column: 1 / -1;
    font-weight: normal;
    color: r.$text-secondary;
    line-height: 1.2em;
    max-height: 1.2em * 3;
    text-overflow: ellipsis;
    overflow: hidden;

    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
}
</style>
