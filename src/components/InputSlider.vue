<template>
  <div
    :class="['input-slider', {
      'input-slider--active': active,
      'input-slider--fill': fill,
      'input-slider--ticks': ticks
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
    }"
  >
    <div
      class="input-slider__track"
      ref="track"
      @pointerdown="onPointerDown"
    >
      <div v-if="fill" class="input-slider__fill">
      </div>
      <div v-if="limitMin !== min || limitMax !== max" class="input-slider__limit">
        <div v-if="fill" class="input-slider__limit__fill" />
      </div>
      <div v-if="ticks" class="input-slider__ticks">
        <div v-for="i in Math.round((max - min + 1) / steps)" :key="i" class="input-slider__tick" />
      </div>
      <div class="input-slider__thumb" ref="thumb" />
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { useVModel } from '@vueuse/core'
import { computed, ref, watch } from 'vue'

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
  noFill?: boolean,
  ticks?: boolean
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
    const thumbStyle = getComputedStyle(thumb.value)
    const tw = thumbRect.width + +thumbStyle.marginLeft.replace('px', '') + +thumbStyle.marginRight.replace('px', '')
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
  position: relative;
  transition: .5s cubic-bezier(0.19, 1, 0.22, 1);

  &:focus-visible {
    outline: none;

    .input-slider__track {
      box-shadow: r.$focus;
    }
  }

  &:hover, &--active, &:active {
    .input-slider__track {
      background: lighten(r.$bg-secondary, 5%);
    }
  }

  &--active, &:active {
    margin: -.3rem;

    .input-slider__track {
      height: 2rem;
    }
    .input-slider__thumb {
      margin: .3rem;
      height: 1.4rem;
      width: 1.4rem;
    }
  }

  &__track {
    flex: 1;
    @include r.box;
    border-radius: 1rem;
    position: relative;
    height: 1.4rem;
    transition: .5s cubic-bezier(0.19, 1, 0.22, 1);
    touch-action: pan-y;
  }

  --progress: (var(--input-slider-value, 0) - var(--input-slider-min, 0)) / (var(--input-slider-max, 100) - var(--input-slider-min, 0));
  --limitMin: (var(--input-slider-limit-min, 0) - var(--input-slider-min, 0)) / (var(--input-slider-max, 100) - var(--input-slider-min, 0));
  --limitMax: (var(--input-slider-limit-max, 0) - var(--input-slider-min, 0)) / (var(--input-slider-max, 100) - var(--input-slider-min, 0));

  &__fill {
    position: absolute;
    inset: 0;
    width: calc(var(--progress) * 100% - 1.4rem * var(--progress) + 1.4rem);
    background: r.$text-primary;
    border-radius: 1rem;

    transition: .5s cubic-bezier(0.19, 1, 0.22, 1);

    :where(.input-slider:active) & {
      width: calc(var(--progress) * 100% - 1.4rem * var(--progress) + 2rem);
    }

    .input-slider--active & {
      width: calc(var(--input-slider-progress) + 2rem);
      transition: .5s cubic-bezier(0.19, 1, 0.22, 1), width 0s;
    }

    & ~ .input-slider__thumb {
      width: .8rem;
      height: .8rem;
      margin: .3rem;
      background: r.$bg-primary;
    }
  }

  &__limit {
    position: absolute;
    inset: 0;
    left: calc(var(--limitMin) * 100% - 1.4rem * var(--limitMin));
    right: calc(100% - (var(--limitMax) * 100% + 1.4rem * (1 - var(--limitMax))));
    background: r.$bg-stroke;
    border-radius: 1rem;
    margin: .65rem;
    overflow: hidden;

    transition: .5s cubic-bezier(0.19, 1, 0.22, 1);
    will-change: margin, background;

    .input-slider--ticks & {
      border-radius: 0;
    }

    .input-slider:hover &,
    .input-slider--active &,
    .input-slider:active & {
      background: lighten(r.$bg-stroke, 5%);
    }

    .input-slider--active &,
    :where(.input-slider:active) & {
      margin: .8rem;
    }

    &__fill {
      position: absolute;
      inset: 0;
      width: calc(((var(--progress) - var(--limitMin)) / (var(--limitMax) - var(--limitMin))) * 100%);
      background: r.$bg-secondary;

      transition: .5s cubic-bezier(0.19, 1, 0.22, 1);

      .input-slider--active & {
        width: calc((var(--input-slider-progress) - (100% * var(--limitMin)) / (var(--limitMax) - var(--limitMin))) + .55rem);
        transition: .5s cubic-bezier(0.19, 1, 0.22, 1), width 0s;
      }
    }
  }

  &__ticks {
    position: absolute;
    inset: .5rem .6rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: .5s cubic-bezier(0.19, 1, 0.22, 1);

    .input-slider--active &,
    :where(.input-slider:active) & {
      inset: .6rem .8rem;
    }
  }

  &__tick {
    width: .1rem;
    border-radius: .5rem;
    height: stretch;
    background: r.$bg-stroke;

    transition: .5s cubic-bezier(0.19, 1, 0.22, 1);

    .input-slider:hover &,
    .input-slider--active &,
    .input-slider:active & {
      background: lighten(r.$bg-stroke, 5%);
    }

    // .input-slider--active &,
    // .input-slider:active & {
    //   width: .2rem;
    // }
  }

  &__thumb {
    position: absolute;
    top: 0;
    width: 1rem;
    height: 1rem;
    background: r.$text-primary;
    border-radius: 50%;
    margin: .2rem;

    transition: .5s cubic-bezier(0.19, 1, 0.22, 1);
    left: calc(var(--progress) * 100% - 1.4rem * var(--progress));

    .input-slider--active & {
      left: var(--input-slider-progress);
      transition: .5s cubic-bezier(0.19, 1, 0.22, 1), left 0s;
    }
  }
}
</style>
