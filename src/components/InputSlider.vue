<template>
  <div
    :class="['input-slider', {
      'input-slider--active': active
    }]"
    tabindex="0"
    @keydown.right.shift="value = validate(value + steps * 10)"
    @keydown.left.shift="value = validate(value - steps * 10)"
    @keydown.right.exact="value = validate(value + steps)"
    @keydown.left.exact="value = validate(value - steps)"
    :style="{
      '--input-slider-min': props.min ?? 0,
      '--input-slider-max': props.max ?? 100,
      '--input-slider-steps': props.steps ?? 1,
      '--input-slider-limit-min': props.limitMin,
      '--input-slider-limit-max': props.limitMax,
      '--input-slider-value': value,
      '--input-slider-progress': progress
    }">
    <div
      class="input-slider__track"
      ref="track"
      @pointerdown="onPointerDown"
    >
      <div v-if="fill" class="input-slider__fill" />
      <div class="input-slider__thumb" ref="thumb" />
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { useEventListener, useVModel } from '@vueuse/core'
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const track = ref<HTMLElement>()
const thumb = ref<HTMLElement>()

const emit = defineEmits<{
  'update:modelValue': number
}>()
const props = defineProps<{
  modelValue: number
  min?: number
  max?: number
  steps?: number
  limitMin?: number
  limitMax?: number
  noFill?: boolean
}>()

const fill = computed(() => !props.noFill ?? true)
const min = computed(() => props.min ?? 0)
const max = computed(() => props.max ?? 100)
const steps = computed(() => props.steps ?? 1)
const limitMin = computed(() => props.limitMin ?? min.value)
const limitMax = computed(() => props.limitMax ?? max.value)

const value = useVModel(props, 'modelValue', emit)
watch(value, () => {
  value.value = validate(value.value)
}, { deep: true })

function validate (v: number) {
  const min = props.limitMin ?? props.min ?? 0
  const max = props.limitMax ?? props.max ?? 100
  const steps = props.steps ?? 1

  v = Math.round((v - min) / steps) * steps + min
  v = Math.min(Math.max(v, min), max)
  return v
}

const active = ref(false)
const progress = ref(null)

function onPointerDown (e1: PointerEvent) {
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)

  move(e1, false)
  active.value = false

  function move (e: PointerEvent) {
    active.value = true
    const rect = track.value.getBoundingClientRect()
    const thumbRect = thumb.value.getBoundingClientRect()
    const tw = thumbRect.width
    const x = e.clientX - rect.left - tw / 2
    const w = rect.width - tw
    const v = (x / w) * (max.value - min.value) + min.value

    value.value = validate(v)

    const limitMinPx = (limitMin.value - min.value) / (max.value - min.value) * w
    const limitMaxPx = (limitMax.value - min.value) / (max.value - min.value) * w

    progress.value = Math.min(Math.max(x, limitMinPx), limitMaxPx) + 'px'
  }

  function up () {
    active.value = false
    progress.value = null
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
  }
}
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.input-slider {
  @include r.box;
  position: relative;
  border-radius: 1rem;
  padding: .2rem;

  transition: .5s cubic-bezier(0.19, 1, 0.22, 1);

  &:focus-visible {
    outline: none;
    box-shadow: r.$focus;
  }

  &:hover, &--active, &:active {
    background: lighten(r.$bg-secondary, 5%);
  }

  &--active, &:active {
    margin: -.25rem;
    padding: .3rem;

    .input-slider__track {
      height: 1.3rem;
    }
    .input-slider__thumb {
      height: 1.3rem;
      width: 1.3rem;
    }
  }

  &__track {
    position: relative;
    height: 1rem;
    transition: .5s cubic-bezier(0.19, 1, 0.22, 1);
    touch-action: pan-y;
  }

  --progress: (var(--input-slider-value, 0) - var(--input-slider-min, 0)) / (var(--input-slider-max, 100) - var(--input-slider-min, 0));

  &__fill {
    position: absolute;
    inset: -.2rem 0 -.2rem -.2rem;
    width: calc(var(--progress) * 100% - 1rem * var(--progress) + 1.4rem);
    background: r.$text-primary;
    border-radius: 1rem;

    transition: .5s cubic-bezier(0.19, 1, 0.22, 1);

    :where(.input-slider:active) & {
      width: calc(var(--progress) * 100% - 1rem * var(--progress) + 1.7rem);
    }

    .input-slider--active & {
      width: calc(var(--input-slider-progress) + 1.7rem);
      transition: .5s cubic-bezier(0.19, 1, 0.22, 1), width 0s;
    }

    & + .input-slider__thumb {
      transform: scale(.8);
      background: r.$bg-primary;
    }
  }

  &__thumb {
    position: absolute;
    width: 1rem;
    height: 1rem;
    background: r.$text-primary;
    border-radius: 50%;

    transition: .5s cubic-bezier(0.19, 1, 0.22, 1);
    left: calc(var(--progress) * 100% - 1rem * var(--progress));

    .input-slider--active & {
      left: var(--input-slider-progress);
      transition: .5s cubic-bezier(0.19, 1, 0.22, 1), left 0s;
    }

    &::before {
      content: '';
      position: absolute;
      inset: -.5rem;
      border-radius: 50%;
    }
  }
}
</style>
