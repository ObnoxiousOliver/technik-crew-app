<template>
  <div :class="['input', {
    'input--float': float
  }]">
    <input
      class="input__field"
      :type="props.type"
      v-model="inputValue"
      @focus="focused = true"
      @blur="focused = false"
      :aria-label="props.label"
      v-bind="$attrs"
    >
    <div class="input__label" aria-hidden>
      {{ props.label }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

const emit = defineEmits([
  'update:modelValue'
])

const props = defineProps({
  type: {
    type: String,
    default: () => 'text'
  },
  label: String,
  modelValue: String
})

const inputValue = ref(props.modelValue)
watch(() => props.modelValue, val => { inputValue.value = val })
watch(inputValue, val => emit('update:modelValue', val))

const focused = ref(false)
const float = computed(() => focused.value || inputValue.value?.trim().length > 0)
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.input {
  display: inline-block;
  position: relative;
  background: r.$bg-secondary;
  border-radius: r.$radius;
  overflow: hidden;

  &__field {
    background: none;
    border: none;
    color: inherit;
    font: inherit;
    width: 100%;

    padding: 1.2rem .5rem .55rem 1rem;

    &:focus {
      outline: none;
    }

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus {
      & + .input__label {
        color: r.$text-primary;
      }
    }
  }
  &__label {
    inset: .875rem 1rem;
    position: absolute;

    color: r.$text-secondary;

    transform-origin: 0 100%;
    pointer-events: none;
    user-select: none;
    transition: .2s;
  }

  &--float {
    .input__label {
      transform: translateY(-.7rem)scale(0.75);
      font-weight: 600;
    }
  }
}
</style>
