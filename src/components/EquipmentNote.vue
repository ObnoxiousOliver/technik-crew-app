<template>
  <div
    ref="noteEl"
    :class="['equipment-note', {
      'equipment-note--view-more': viewMore
    }]"
    :style="{
      '--height': `${height}px`
    }"
  >
    <div class="equipment-note__head">
      <span class="equipment-note__author">
        <Username v-if="author" :user="author" />
        <span v-else>
          {{ note?.author }}
        </span>
      </span>
      <span class="equipment-note__date">
        {{ date }}
      </span>
      <Btn @click="$emit('options')" class="equipment-note__options">
        <i class="bi-three-dots-vertical" />
      </Btn>
    </div>
    <div ref="content" class="equipment-note__content">{{ note?.content }}</div>
    <button class="equipment-note__view-more-btn" @click="viewMore = !viewMore" v-if="showViewMoreBtn">
      {{ viewMore ? 'Weniger anzeigen' : 'Mehr anzeigen' }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { NoteDB } from '@/model/equipment'
import { User } from '@/model/user'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { toDateString } from '@/utilities/date'

const props = defineProps<{
  note?: NoteDB
}>()

const content = ref<HTMLElement>()
const noteEl = ref<HTMLElement>()

const height = ref()

const author = ref()
const date = computed(() => {
  const date = new Date(props.note?.date)
  return toDateString(date)
})

const viewMore = ref(false)
const showViewMoreBtn = ref(false)

onMounted(async () => {
  const observer = new ResizeObserver(() => {
    height.value = noteEl.value?.getBoundingClientRect().height
  })
  observer.observe(noteEl.value)

  onBeforeUnmount(() => {
    observer.disconnect()
  })

  author.value = await User.fromUsername(props.note?.author)

  if (content.value?.scrollHeight > content.value?.clientHeight) {
    showViewMoreBtn.value = true
  }
})
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.equipment-note {
  position: relative;
  margin: 1rem 0;
  border-radius: r.$radius;

  &--view-more {
    .equipment-note__content {
      max-height: none;
    }
  }

  &__head {
    font-size: .8rem;
    margin-bottom: .2rem;
  }

  &__author {
    display: inline-block;
    margin-right: .5rem;
    font-weight: 600;
  }

  &__date {
    color: r.$text-secondary;
  }

  &__options {
    position: absolute;
    right: -.5rem;
    top: -.5rem;
    width: 2rem;
    height: 2rem;
    padding: 0;
    background: none !important;
  }

  &__content {
    font: inherit;
    white-space: pre-wrap;
    word-break: break-word;
    user-select: text;
    line-height: 1.5;
    max-height: 1.5 * 3rem;
    overflow: hidden;
  }

  &__view-more-btn {
    background: none;
    border: none;
    font: inherit;
    color: inherit;
    font-size: .8rem;
    text-decoration: underline;
    color: r.$text-secondary;
    cursor: pointer;
    transition: .2s;

    &:hover {
      color: r.$text-primary;
    }
  }
}
</style>
