<template>
  <div
    class="select-color"
    ref="root"
    :style="{
      '--color': selected?.color,
      '--color-a': selected?.color + '44',
      '--selected-index': selectedIndex,
      '--color-count': colors.length,
      '--menu-left': rect?.left + 'px',
      '--menu-top': rect?.top + 'px',
    }"
  >
    <button
      type="button"
      @click="open = !open"
      :class="['select-color__btn', {
        'select-color__btn--open': open
      }]"
    />

    <div
      v-if="open"
      class="select-color__mask"
      @pointerdown="open = false"
    />

    <Transition name="select-color__menu">
      <FocusTrap v-if="open">
        <div class="select-color__menu">
          <button
            type="button"
            class="select-color__btn"
            v-for="color in colors"
            :key="color.value"
            :style="{ '--color': color.color }"
            @click="select(color.value)"
          />
        </div>
      </FocusTrap>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

const emit = defineEmits<{
  'update:modelValue': string
}>()
const props = defineProps<{
  modelValue: string
}>()

const rawColors = [
  'red',
  'orange',
  'yellow',
  'green',
  'cyan',
  'blue',
  'purple',
  'pink',
  'gray'
].map((color) => ({
  value: color,
  color: getComputedStyle(document.documentElement).getPropertyValue(`--col-${color}`)
}))

const open = ref(false)

const value = ref(props.modelValue)
watch(value, (val) => {
  emit('update:modelValue', val)
})
watch(() => props.modelValue, (val) => {
  value.value = val
})
const selected = computed(() => rawColors.find((c) => c.value === value.value))
const selectedIndex = computed(() => colors.value.findIndex((c) => c.value === value.value))
const colors = computed(() => {
  const index = rawColors.findIndex((c) => c.value === value.value)

  if (index === rawColors.length - 1) {
    return [
      rawColors[index],
      ...rawColors.slice(0, index)
    ]
  }

  return [
    ...rawColors.slice(index, rawColors.length - 1),
    ...rawColors.slice(0, index),
    rawColors[rawColors.length - 1]
  ]
})

const root = ref<HTMLElement>()
const rect = ref<DOMRect>()
watch(() => open.value, () => {
  rect.value = root.value?.getBoundingClientRect()
})

function select (val: string) {
  value.value = val
  open.value = false
}
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.select-color {
  position: relative;
  display: inline-block;
  width: 2rem;
  height: 2rem;

  &__btn {
    flex: 0 0 auto;
    width: 2rem;
    height: 2rem;

    border-radius: 50%;
    border: none;
    box-shadow: rgba(r.$text-primary, 0.2) 0 0 0 1px inset;

    background: var(--color);
    transition: .2s;
    cursor: pointer;

    &:hover {
      box-shadow: rgba(r.$text-primary, 0.4) 0 0 0 1px inset;
    }

    &:focus-visible {
      outline: none;
      box-shadow: rgba(r.$text-primary, 0.2) 0 0 0 1px inset, r.$focus;
    }

    &:not(.select-color__menu &):not(&--open) {
      box-shadow:
        rgba(r.$text-primary, 0.2) 0 0 0 1px inset,
        var(--color-a) 0 .5rem 2rem;

      &:hover {
        box-shadow:
          rgba(r.$text-primary, 0.4) 0 0 0 1px inset,
          var(--color-a) 0 .5rem 2rem;
      }

      &:focus-visible {
        outline: none;
        box-shadow:
          rgba(r.$text-primary, 0.2) 0 0 0 1px inset,
          var(--color-a) 0 .5rem 2rem,
          r.$focus;
      }

    }
  }

  &__menu {
    position: absolute;
    top: -.5rem;
    left: -.5rem;
    z-index: 99;
    display: flex;
    flex-flow: column;
    gap: .5rem;
    width: auto;
    min-width: 3rem;
    height: max-content;
    max-height: calc(100vh - var(--menu-top) - 5rem);
    min-height: 3rem;
    overflow: auto;
    padding: .5rem;
    border-radius: 1.5rem;
    background: r.$bg-secondary;

    // Hide scrollbar
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }

    &-enter-active,
    &-leave-active {
      transition: .2s;
    }

    &-enter-from,
    &-leave-to {
      opacity: 0;
    }
  }

  &__mask {
    position: fixed;
    inset: 0;
    pointer-events: all;
    z-index: 99;
  }
}
</style>
