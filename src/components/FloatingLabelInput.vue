<template>
  <div :class="['input', {
    'input--float': float
  }]">
    <input
      class="input__field"
      :type="inputType"
      v-model="inputValue"
      @focus="focused = true"
      @blur="focused = false"
      :aria-label="props.label"
      v-bind="$attrs"
    >
    <Transition name="input__show-hide-btn">
      <button
        v-wave
        v-if="props.type == 'password' && float"
        class="input__show-hide-btn"
        @keydown.space="showPassword = true"
        @keyup.space="showPassword = false"
        @keydown.enter="showPassword = true"
        @keyup.enter="showPassword = false"
        @blur="showPassword = false"
        @pointerdown="showPassword = true"
        @pointerup="showPassword = false"
        @pointerleave="showPassword = false"
      >
        <i class="bi-eye" />
      </button>
    </Transition>
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

const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})
const showPassword = ref(false)

const inputValue = ref(props.modelValue)
watch(() => props.modelValue, val => { inputValue.value = val })
watch(inputValue, val => emit('update:modelValue', val))

const focused = ref(false)
const float = computed(() => focused.value || inputValue.value?.length > 0)
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.input {
  display: inline-flex;
  position: relative;
  background: r.$bg-secondary;
  border-radius: r.$radius;
  overflow: hidden;

  transition: box-shadow .2s, opacity .2s;

  &:focus-within {
    outline: none;
    box-shadow: r.$focus;
  }

  &:disabled {
    opacity: 0.5;
  }

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
      & ~ .input__label {
        color: r.$text-primary;
      }
      & ~ .input__show-hide-btn {
        display: none;
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
    transition: .07s, transform .5s cubic-bezier(0.19, 1, 0.22, 1);
  }

  &__show-hide-btn {
    background: none;
    font: inherit;
    color: inherit;
    border: none;
    padding: 0 1rem;
    cursor: pointer;

    &-enter-active, &-leave-active {
      transition: .1s;
    }
    &-enter-from, &-leave-to {
      opacity: 0;
    }
  }

  &--float {
    .input{
      &__label {
        transform: translateY(-.7rem)scale(0.75);
        font-weight: 600;
      }
    }
  }
}
</style>
