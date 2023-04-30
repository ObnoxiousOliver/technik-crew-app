<template>
  <div v-if="loading" class="note-attachment">
    <div class="note-attachment__name">
      <span class="note-attachment__name__name">
        {{ name.split('.').slice(0, -1).join('.') }}</span><span class="note-attachment__name__extention">.{{ name.split('.').pop() }}
      </span>
    </div>
    <Spinner class="note-attachment__loading" />
  </div>
  <Btn @click="open" v-else-if="hasThumbnail" class="note-attachment note-attachment--has-thumbnail">
    <div class="note-attachment__name">
      <span class="note-attachment__name__name">
        {{ name.split('.').slice(0, -1).join('.') }}</span><span class="note-attachment__name__extention">.{{ name.split('.').pop() }}
      </span>
    </div>
    <!-- <img
      class="note-attachment__thumbnail--blur"
      :src="attachment.thumbnail"
      aria-hidden="true"
    /> -->
    <img
      class="note-attachment__thumbnail"
      :src="thumbnailUrl"
      :alt="`Bild: ${name}`"
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
        {{ name.split('.').slice(0, -1).join('.') }}</span><span class="note-attachment__name__extention">.{{ name.split('.').pop() }}
      </span>
    </div>
    <GlowDiv class="note-attachment__icon">
      <i v-if="notFound" class="bi-file-earmark-x" />
      <FileTypeIcon
        v-else
        :file="{
          name: name,
          type: meta?.contentType
        }"
      />
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
import { computed, ref } from 'vue'
import FileTypeIcon from './FileTypeIcon.vue'
import GlowDiv from './GlowDiv.vue'
import { FullMetadata, getDownloadURL, getMetadata, getStorage, ref as storageRef } from 'firebase/storage'
import { FirebaseError } from 'firebase/app'
import { logOnServer } from '@/utilities/log'

const storage = getStorage()

const props = defineProps<{
  attachment: {
    path: string
    thumbnailPath?: string
  }
}>()

const emit = defineEmits(['open'])

const loading = ref(true)

const meta = ref<FullMetadata>()
const thumbnailUrl = ref<string>()
const url = ref<string>()

const name = computed(() =>
  meta.value?.name ??
  props.attachment.path.split('/').pop() ??
  props.attachment.path)

;(async function init () {
  meta.value = await getMetadata(storageRef(storage, props.attachment.path))
    .catch((error) => {
      const err = error as FirebaseError
      if (err.code === 'storage/object-not-found') {
        console.error('Attachment not found', props.attachment.path)
        return undefined
      } else if (err.code === 'storage/unauthorized') {
        console.error('Unauthorized to access attachment', props.attachment.path)
        return undefined
      } else {
        console.error('Error while loading attachment', props.attachment.path, err)
        logOnServer('Error while loading attachment', props.attachment.path, err.message)
      }
    })

  url.value = await getDownloadURL(storageRef(storage, props.attachment.path))

  if (props.attachment.thumbnailPath) {
    const url = await getDownloadURL(storageRef(storage, props.attachment.thumbnailPath))
    thumbnailUrl.value = url
  }

  loading.value = false
})()

const notFound = computed(() => !meta.value)
const hasThumbnail = computed(() => !!props.attachment.thumbnailPath)

async function open () {
  emit('open', url.value)
}

function download () {
  window.open(url.value, '_blank')
}
</script>

<style lang="scss" scoped>
@use '@/scss' as r;

.note-attachment {
  flex: 0 0 auto;
  @include r.box;
  position: relative;
  height: 15rem;
  max-width: 20rem;
  min-width: 10rem;
  overflow: hidden;

  &--has-thumbnail {
    padding: 0;
    // Compensate for the padding
    // min-width: 9rem;

    // :deep(.btn__content) {
    //   display: flex;
    //   align-items: center;
    //   justify-content: center;
    // }

    .note-attachment__name {
      background: linear-gradient(
        to bottom,
        rgba(r.$bg-primary, (1.000 * 0.7)) 00.0%,
        rgba(r.$bg-primary, (0.987 * 0.7)) 12.3%,
        rgba(r.$bg-primary, (0.952 * 0.7)) 23.5%,
        rgba(r.$bg-primary, (0.897 * 0.7)) 33.4%,
        rgba(r.$bg-primary, (0.826 * 0.7)) 42.4%,
        rgba(r.$bg-primary, (0.743 * 0.7)) 50.4%,
        rgba(r.$bg-primary, (0.651 * 0.7)) 57.5%,
        rgba(r.$bg-primary, (0.553 * 0.7)) 63.9%,
        rgba(r.$bg-primary, (0.454 * 0.7)) 69.7%,
        rgba(r.$bg-primary, (0.356 * 0.7)) 74.9%,
        rgba(r.$bg-primary, (0.264 * 0.7)) 79.6%,
        rgba(r.$bg-primary, (0.180 * 0.7)) 84.0%,
        rgba(r.$bg-primary, (0.108 * 0.7)) 88.2%,
        rgba(r.$bg-primary, (0.052 * 0.7)) 92.1%,
        rgba(r.$bg-primary, (0.014 * 0.7)) 96.1%,
        transparent 100%
      );
    }
  }

  &__name {
    z-index: 1;
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

  &__loading {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__download-btn {
    position: absolute;
    inset: auto .5rem .5rem auto;
  }

  &__thumbnail {
    // position: relative;
    // margin: auto;
    width: stretch;
    height: 15rem;
    max-width: 20rem;
    max-height: 15rem;
    object-fit: cover;
    pointer-events: none;
    // border-radius: r.$radius - .5rem;

    &--blur {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      filter: blur(1rem);
      object-fit: cover;
      transform: scale(1.1);
      opacity: 0.4;
      pointer-events: none;
    }
  }
}
</style>
