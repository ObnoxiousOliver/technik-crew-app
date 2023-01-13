<template>
  <Teleport to="#layer">
    <Transition name="action-sheet">
      <div
        v-if="show"
        @keydown.esc="show = false"
        :class="['action-sheet' , {
          'action-sheet--no-content': !$slots.default,
          'action-sheet--scrollable': scrollable
        }]"
      >
        <div class="action-sheet__mask" @click="show = false" />
        <div
          @pointerdown="onPointerDown"
          ref="sheet"
          class="action-sheet__box"
          :style="{
            transform: `translateY(${verticalDragDown * 100}%)`,
            transition: dragging ? 'none' : undefined
          }"
        >
          <FocusTrap >
            <div>
              <h2 v-if="$slots.title" class="action-sheet__title">
                <slot name="title" />
              </h2>
              <div
                v-if="$slots.default"
                ref="content"
                class="action-sheet__content"
                @pointerdown="contentDown"
              >
                <slot />
              </div>
              <div
                v-if="$slots.buttons"
                class="action-sheet__buttons"
                @pointerdown.stop
              >
                <div @click="show = false">
                  <slot name="buttons" />
                </div>
              </div>
            </div>
          </FocusTrap>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps<{
  show: boolean
}>()
const emit = defineEmits<{(e: 'update:show', v: boolean): void}>()

const show = ref(props.show)
const sheet = ref(null as HTMLElement | null)
const content = ref(null as HTMLElement | null)
const scrollable = ref(false)

const observer = new ResizeObserver(() => {
  if (content.value) {
    scrollable.value = content.value.scrollHeight > content.value.clientHeight
  }
})
onBeforeUnmount(() => {
  observer.disconnect()
})
watch(show, val => {
  if (val) {
    setTimeout(() => {
      observer.observe(content.value)
    })
  } else {
    observer.disconnect()
  }
})

const dragging = ref(false)
const verticalDragDown = ref(props.show ? 0 : 1)

watch(show, (v) => {
  emit('update:show', v)
})

watch(() => props.show, (v) => {
  show.value = v
  if (v) {
    verticalDragDown.value = 0
  } else {
    verticalDragDown.value = 1
  }
})

function contentDown (e: PointerEvent) {
  if (scrollable.value) {
    e.stopPropagation()
  }
}

function onPointerDown (e: PointerEvent) {
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointermove', onPointerMove)

  let startY = e.clientY
  let lastY = 0
  let velocity = 0

  function onPointerMove (e2: PointerEvent) {
    let dy = e2.clientY - startY

    if (!dragging.value && dy > 10) {
      dragging.value = true
      startY = e2.clientY
      dy = 0
      e.preventDefault()
      e.stopPropagation()
    }

    if (dragging.value) {
      velocity = dy - lastY
      verticalDragDown.value = Math.max(0, dy) / sheet.value.clientHeight
    }

    lastY = dy
  }
  function onPointerUp () {
    dragging.value = false
    if (velocity > 10 || verticalDragDown.value > 0.5) {
      setTimeout(() => {
        show.value = false
      })
    } else {
      verticalDragDown.value = 0
    }

    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointermove', onPointerMove)
  }
}
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.action-sheet {
  position: absolute;
  inset: 0;
  will-change: opacity;
  pointer-events: all;
  background: rgba(0, 0, 0, .5);
  backdrop-filter: blur(.5rem);

  &__box {
    position: absolute;
    inset: auto .5rem .5rem;
    background: r.$bg-secondary;
    border-radius: r.$radius;
    overflow: hidden;
    touch-action: none;
    transition: transform .5s cubic-bezier(0.19, 1, 0.22, 1);

    &::before {
      content: '';
      position: absolute;
      top: .5rem;
      left: 50%;
      transform: translateX(-50%);
      background: r.$text-secondary;
      height: .2rem;
      width: 3rem;
      border-radius: .15rem;
    }

    & > div {
      max-height: 80vh;
      display: flex;
      flex-direction: column;
    }
  }

  &__title {
    padding: 0 1.5rem;
    font-size: 1.5rem;
    margin: 2rem 0 1.5rem;
  }

  &__content {
    flex: 1 1 auto;
    padding: 0 1.5rem 1.5rem;
    overflow: auto;
    touch-action: none;
  }

  &__buttons {
    padding: 0;
    padding: .5rem 0;
    border-top: 1px solid r.$bg-stroke;
  }

  &__mask {
    position: absolute;
    inset: 0;
  }

  &--no-content {
    .action-sheet__buttons {
      border: none;
    }
  }

  &--scrollable {
    .action-sheet__content {
      touch-action: auto;
    }
  }

  &-enter-active, &-leave-active {
    transition: opacity .5s;

    .action-sheet__box {
      transition: transform .5s cubic-bezier(0.19, 1, 0.22, 1);
    }
  }
  &-enter-from, &-leave-to {
    opacity: 0;

    .action-sheet__box {
      transform: translateY(100%) !important;
    }
  }
}
</style>
