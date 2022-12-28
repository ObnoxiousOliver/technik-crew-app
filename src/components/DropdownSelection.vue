<template>
  <div class="dropdown">
    <select class="dropdown__select" v-model="value" v-bind="$attrs">
      <slot />
    </select>
    <i class="bi-chevron-down" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: String
})
const emit = defineEmits(['update:modelValue'])

const value = ref(props.modelValue)
watch(value, (val) => {
  emit('update:modelValue', val)
})
watch(() => props.modelValue, (val) => {
  value.value = val
})
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.dropdown {
  position: relative;

  i {
    display: block;
    position: absolute;
    inset: 50% 1rem auto auto;
    transform: translateY(-50%);
    pointer-events: none;
  }

  &__select {
    appearance: none;
    display: inline-block;
    border: none;
    font: inherit;
    color: inherit;
    width: 100%;

    padding: .875rem 3rem .875rem 1rem;

    background: r.$bg-secondary;
    border-radius: r.$radius;

    transition: box-shadow .2s, opacity .2s;

    &:focus-visible {
      outline: none;
      box-shadow: r.$focus;
    }

    &:disabled {
      opacity: 0.5;
    }
  }
}
</style>
