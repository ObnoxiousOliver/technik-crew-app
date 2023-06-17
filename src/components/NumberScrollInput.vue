<template>
  <div class="number-scroll-input">
    <div class="number-scroll-input__scroller" ref="scrollEl" @scroll="updateValue">
      <div
        v-for="i in (max - min + 1)"
        :key="i"
        class="number-scroll-input__number"
        :data-value="min + i - 1"
        @click="() => {
          value = min + i - 1
          $nextTick(() => {
            updateScroll()
          })
        }"
        ref="activeNumberEl"
      >
        <!-- <template v-if="min + i - 1 === value">
        </template>
        <template v-else> -->
        {{ pad ? (min + i - 1).toString().padStart(2, '0') : min + i - 1 }}
        <!-- </template> -->
      </div>
      <!-- <Teleport
        v-if="activeNumberEl?.[value - min]!"
        :to="activeNumberEl?.[value - min]!"
      >
        <input
          type="text"
          :value="value"
          ref="input"
          @blur="updateValue"
          @keydown.enter="updateValue"
          @keydown.escape=""
        >
      </Teleport> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useVModel } from '@vueuse/core'
import { onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: number
  min: number
  max: number
  pad?: boolean
}>(), {
  min: 1,
  max: 10
})

const emit = defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue', emit)

const scrollEl = ref<HTMLDivElement>()
const activeNumberEl = ref<HTMLElement[]>()
// watchEffect(() => {
//   updateScroll()
// })

function updateScroll () {
  if (!scrollEl.value) return

  const item = activeNumberEl.value?.[value.value - props.min - 1]
  if (!item) return

  scrollEl.value.scrollTop = item?.offsetTop - item.clientHeight / 2 ?? 0
}
onMounted(() => {
  updateScroll()
})

function updateValue () {
  const rem = parseInt(getComputedStyle(document.documentElement).fontSize)
  value.value = Math.round((scrollEl.value?.scrollTop ?? rem) / rem / 2) + props.min
}
</script>

<style scoped lang="scss">
@use '../scss' as r;
@use 'sass:math';

.number-scroll-input {
  position: relative;
  width: fit-content;

  $height: 8rem;
  $padding: math.div($height - 2.5rem, 2);
  $padding2: math.div($height - 2rem, 2);

  &__scroller {
    overflow: auto;
    height: $height;
    padding: $padding2 1rem;
    min-width: fit-content;
    scroll-behavior: smooth;
    scroll-padding: $padding2 1rem;
    scroll-snap-type: y mandatory;
    mask-image: linear-gradient(
      transparent,
      #0008 $padding,
      #000 $padding + .1rem,
      #000 calc(100% - $padding - .1rem),
      #0008 calc(100% - $padding),
      transparent
    );

    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  &::before {
    content: '';
    position: absolute;
    inset: 50% 0 auto;
    display: block;
    height: 2.5rem;
    transform: translateY(-50%);
    pointer-events: none;
    border-radius: r.$radius;
    border: r.$bg-stroke solid .1rem;
  }

  &__number {
    scroll-snap-align: start;
    height: 2rem;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
