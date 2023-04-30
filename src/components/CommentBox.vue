<template>
  <div
    v-bind="$attrs"
    :class="['comment-box', {
      'comment-box--open': open,
      'comment-box--has-attachments': shownAttachments?.length ?? 0 > 0,
    }]"
  >
    <Textbox
      class="comment-box__textbox"
      placeholder="Anmerkung hinzufügen"
      v-model="value"
      @keydown.ctrl.enter="emit('send')"
    >
      <template #buttons>
        <template v-if="breakpoint.inMobileOrTablet">
          <Transition name="comment-box__upload-btns">
            <div v-if="open" class="comment-box__upload-btns">
              <Btn
                square
                @click="emit('addImage')"
              >
                <i class="bi-image" />
              </Btn>
              <Btn
                square
                @click="emit('addFile')"
              >
                <i class="bi-file-earmark-plus" />
              </Btn>
            </div>
          </Transition>

          <Btn
            class="comment-box__open-btn"
            square
            @click="open = !open"
          >
            <i class="bi-chevron-left" />
          </Btn>

        </template>
        <Btn
          v-else
          square
          @click="emit('addFile')"
        >
          <i class="bi-plus-lg" />
        </Btn>
        <Btn
          square
          :disabled="sending || (value.trim().length <= 0 && (attachments?.length ?? 0) <= 0)"
          @click="emit('send')"
          aria-label="Senden"
        >
          <i class="bi-send"></i>
        </Btn>
      </template>
    </Textbox>
  </div>

  <TransitionGroup
    class="comment-box__attachments"
    tag="div"
    name="comment-box__attachment"
  >
    <div
      :class="['comment-box__attachment', {
        'comment-box__attachment--image': compressableFileTypes.includes(attachment.type ?? ''),
      }]"
      v-for="attachment in shownAttachments"
      :key="attachment.name"
    >
      <template v-if="attachment.compressing">
        <div class="comment-box__attachment__info">
          <span class="comment-box__attachment__name">
            {{ attachment.name }}
          </span>
        </div>

        <Spinner class="comment-box__attachment__loading" />
      </template>
      <template v-else>
        <div class="comment-box__attachment__info">
          <span class="comment-box__attachment__name">
            {{ attachment.name }}
          </span>

          <span class="comment-box__attachment__size">
            {{ toByteString(attachment.size ?? 0) }}
          </span>
        </div>

        <template v-if="compressableFileTypes.includes(attachment.type ?? '')">
          <img
            v-if="imgDataUrls[attachment.name]"
            :src="imgDataUrls[attachment.name]"
            :alt="`Bild: ${attachment.name}`"
          />
          <Spinner class="comment-box__attachment__loading" v-else />
        </template>
        <GlowDiv v-else class="comment-box__attachment__icon">
          <FileTypeIcon :file="attachment" />
        </GlowDiv>

        <Btn
          small
          square
          transparent
          class="comment-box__attachment__remove-btn"
          @click="emit('removeFile', attachment.name)"
        >
          <i
            class="bi-x-lg"
          />
        </Btn>
      </template>
    </div>
    <div class="comment-box__attachment" v-if="attachments && attachments.length > maxShownAttachments">
      <div class="comment-box__attachment__info">
        <span class="comment-box__attachment__name">
          {{ (attachments?.length ?? 0) - maxShownAttachments }} weitere Dateien
        </span>
        <span class="comment-box__attachment__size">
          {{ toByteString(attachments?.reduce((acc, cur) => acc + cur.size, 0) - attachments?.slice(0, maxShownAttachments).reduce((acc, cur) => acc + cur.size, 0) ?? 0) }}
        </span>
      </div>
      <i class="comment-box__attachment__icon bi-file-earmark" />
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { useBreakpoint } from '@/utilities/breakpoint'
import { useVModel } from '@vueuse/core'
import { computed, ref, watchEffect } from 'vue'
import { toByteString } from '../utilities/bytes'
import reduce from 'image-blob-reduce'
import GlowDiv from './GlowDiv.vue'
import { compressableFileTypes } from '@/utilities/compress'
import FileTypeIcon from './FileTypeIcon.vue'

const breakpoint = useBreakpoint()

const props = defineProps<{
  modelValue: string
  attachments?: File[]
  sending: boolean
  compressing?: {
    done: number
    total: number
    files: string[]
  } | null
}>()
const emit = defineEmits(['update:modelValue', 'send', 'addFile', 'addImage', 'removeFile'])
const value = useVModel(props, 'modelValue', emit)

const open = ref(false)

const shownAttachments = computed(() => {
  const attachments: (Partial<File> & {
    name: string
    compressing?: boolean
  })[] = [...(props.attachments ?? [])]
  const c = props.compressing
  if (c) {
    attachments.push(
      ...Array(c?.total - c?.done)
        .fill(0).map((_, i) => ({
          name: c.files[i],
          compressing: true
        }))
    )
  }
  return attachments.slice(0, maxShownAttachments)
})

const maxShownAttachments = Infinity
const imgDataUrls = ref<Record<string, string>>({})
watchEffect(() => {
  // remove deleted files
  Object.keys(imgDataUrls.value).forEach((key) => {
    if (!props.attachments?.some((file) => file.name === key)) {
      delete imgDataUrls.value[key]
    }
  })

  for (const file of props.attachments?.slice(0, maxShownAttachments) ?? []) {
    if (!compressableFileTypes.includes(file.type)) continue
    // if image is already loaded, skip
    if (imgDataUrls.value[file.name]) continue

    // load image
    file.arrayBuffer().then((buffer) => {
      // reduce image size
      reduce().toBlob(new Blob([buffer], { type: file.type }), {
        max: 200
      }).then(blob => {
        // create url
        const urlCreator = window.URL || window.webkitURL
        const imageUrl = urlCreator.createObjectURL(blob)
        imgDataUrls.value[file.name] = imageUrl
      })
    })
  }
})
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.comment-box {
  display: flex;
  gap: .5rem;
  align-items: center;
  margin: 1rem 0;

  &__textbox {
    flex: 1;
  }

  &__open-btn {
    i {
      display: inline-block;
      transition: .5s cubic-bezier(0.19, 1, 0.22, 1);
    }
  }

  &--open {
    .comment-box__open-btn i {
      transform: rotate(-180deg);
    }
  }

  &__upload-btns {
    &-enter-active,
    &-leave-active {
      transition: .5s cubic-bezier(0.19, 1, 0.22, 1);
      clip-path: inset(0);
    }

    &-enter-from,
    &-leave-to {
      opacity: 0;
      margin-right: -5rem;
      clip-path: inset(0 100% 0 0);
    }
  }

  &__attachments {
    margin: -1rem -1.5rem 1rem;
    padding: 0 1.5rem;
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    transition: .5s cubic-bezier(0.19, 1, 0.22, 1);

    .comment-box--has-attachments + & {
      margin: -.5rem -1.5rem 1rem;
    }
  }

  &__attachment {
    @include r.box;
    position: relative;
    flex-shrink: 0;
    width: 12rem;
    height: 8rem;
    word-wrap: break-word;
    overflow: hidden;

    &--image {
      .comment-box__attachment {
        &__info {
          position: relative;
          z-index: 1;
          padding-bottom: 3rem;
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
    }

    &__remove-btn {
      z-index: 1;
      position: absolute;
      top: .5rem;
      right: .5rem;
    }

    &__info {
      padding: 1rem 1rem .2em;
      display: flex;
      flex-direction: column;
    }

    &__icon {
      display: block;
      font-size: 2.5rem;
      text-align: center;
    }

    &__name {
      margin-right: 1.5rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 600;
    }

    &__loading {
      position: absolute;
      inset: auto 0 1rem;
      margin: 0;
    }

    img {
      position: absolute;
      object-fit: cover;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    &-enter-active,
    &-leave-active {
      transition: .5s cubic-bezier(0.19, 1, 0.22, 1);
      clip-path: inset(0);
    }

    &-enter-from {
      transform: scale(.8);
      opacity: 0;
      margin-bottom: -8rem;
    }

    &-leave-to {
      transform: scale(.8);
      opacity: 0;
      margin-right: -13rem;
      margin-bottom: -8rem;
    }
  }
}
</style>
