<template>
  <input class="toggle-switch" type="checkbox" v-model="value" v-bind="$attrs" />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue'])

const value = ref(props.modelValue)
watch(value, (newValue) => {
  emit('update:modelValue', newValue)
})
watch(() => props.modelValue, (val) => {
  value.value = val
})
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.toggle-switch {
  appearance: none;
  display: inline-block;
  position: relative;
  width: 3rem;
  height: 1.5rem;
  border-radius: .75rem;
  background: r.$bg-secondary;
  color: r.$text-primary;
  transition: background-color .5s cubic-bezier(0.19, 1, 0.22, 1);

  $padding: .25rem;
  &::before {
    content: '';
    display: block;
    width: 1.5rem - $padding * 2;
    height: 1.5rem - $padding * 2;
    border-radius: 1rem;
    background: currentColor;
    position: absolute;
    top: $padding;
    left: $padding;
    transition: .5s cubic-bezier(0.19, 1, 0.22, 1);
  }

  &:focus-visible {
    outline: none;
    box-shadow: r.$focus;
  }

  &:disabled {
    opacity: 0.5;
  }

  &:active::before {
    width: 1.5rem;
  }

  &:checked {
    background: r.$text-primary;
    color: r.$bg-primary;

    &:active::before {
      width: 1.5rem;
      transform: translateX(1rem);
    }

    &::before {
      transform: translateX(1.5rem);
    }
  }
}
</style>
