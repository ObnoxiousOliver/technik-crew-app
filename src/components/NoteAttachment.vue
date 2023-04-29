<template>
  <Btn @click="emit('openImage')" v-if="isImage" class="note-attachment note-attachment--is-image">
    <div class="note-attachment__name">
      <span class="note-attachment__name__name">
        {{ attachment.name.split('.').slice(0, -1).join('.') }}</span><span class="note-attachment__name__extention">.{{ attachment.name.split('.').pop() }}
      </span>
    </div>
    <img
      class="note-attachment__img"
      :src="attachment.url"
      :alt="`Bild: ${attachment.name}`"
    />
  </Btn>
  <div
    v-else
    :class="['note-attachment', {
      'note-attachment--not-found': notFound
    }]"
  >
    <div class="note-attachment__name">
      <span class="note-attachment__name__name">
        {{ attachment.name.split('.').slice(0, -1).join('.') }}</span><span class="note-attachment__name__extention">.{{ attachment.name.split('.').pop() }}
      </span>
    </div>
    <GlowDiv class="note-attachment__icon">
      <i v-if="notFound" class="bi-file-earmark-x" />
      <FileTypeIcon v-else :file="attachment" />
    </GlowDiv>
    <Btn
      v-if="!notFound"
      small
      square
      transparent
      @click="download"
      class="note-attachment__download-btn"
    >
      <i class="bi-download" />
    </Btn>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import FileTypeIcon from './FileTypeIcon.vue'
import GlowDiv from './GlowDiv.vue'
import { compressableFileTypes } from '@/utilities/compress'

const props = defineProps<{
  attachment: {
    type?: string
    name: string
    url?: string
  }
}>()

const emit = defineEmits(['openImage'])

const notFound = computed(() => !props.attachment.url)
const isImage = computed(() => props.attachment.type && compressableFileTypes.includes(props.attachment.type))

function download () {
  window.open(props.attachment.url, '_blank')
}
</script>

<style lang="scss" scoped>
@use '@/scss' as r;

.note-attachment {
  flex: 0 0 auto;
  @include r.box;
  position: relative;
  height: 10rem;
  width: fit-content;
  max-width: 18rem;
  min-width: 8rem;
  padding: 1rem;
  overflow: hidden;

  &--is-image {
    display: flex;
    justify-self: start;
    align-items: flex-start;
    font-weight: normal;
    padding: 0;
    text-align: left;
    min-width: 5rem;

    .note-attachment__name {
      background: linear-gradient(
        to bottom,
        rgba(r.$bg-primary, (1.000 * 0.8)) 00.0%,
        rgba(r.$bg-primary, (0.987 * 0.8)) 12.3%,
        rgba(r.$bg-primary, (0.952 * 0.8)) 23.5%,
        rgba(r.$bg-primary, (0.897 * 0.8)) 33.4%,
        rgba(r.$bg-primary, (0.826 * 0.8)) 42.4%,
        rgba(r.$bg-primary, (0.743 * 0.8)) 50.4%,
        rgba(r.$bg-primary, (0.651 * 0.8)) 57.5%,
        rgba(r.$bg-primary, (0.553 * 0.8)) 63.9%,
        rgba(r.$bg-primary, (0.454 * 0.8)) 69.7%,
        rgba(r.$bg-primary, (0.356 * 0.8)) 74.9%,
        rgba(r.$bg-primary, (0.264 * 0.8)) 79.6%,
        rgba(r.$bg-primary, (0.180 * 0.8)) 84.0%,
        rgba(r.$bg-primary, (0.108 * 0.8)) 88.2%,
        rgba(r.$bg-primary, (0.052 * 0.8)) 92.1%,
        rgba(r.$bg-primary, (0.014 * 0.8)) 96.1%,
        transparent 100%
      );
    }
  }

  &__name {
    position: absolute;
    inset: 0 0 auto;
    padding: 1rem 1rem 2rem;
    display: flex;

    &__name {
      flex: 1 1 auto;
      width: 0;
      max-width: fit-content;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__extention {
      flex-direction: 1 0 auto;
    }
  }

  &__icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%)translateY(.5rem);
    font-size: 2.5rem;
  }

  &__download-btn {
    position: absolute;
    inset: auto .5rem .5rem auto;
  }

  &__img {
    height: 10rem;
    min-width: 100%;
    max-width: 100%;
    object-fit: cover;
    pointer-events: none;
  }
}
</style>
