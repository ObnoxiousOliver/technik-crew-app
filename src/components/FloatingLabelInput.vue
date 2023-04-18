<template>
  <div :class="['input', {
    'input--float': float
  }]">
    <input
      class="input__field"
      :type="inputType"
      :inputmode="inputType === 'number' ? 'numeric' : 'text'"
      @change="onChange"
      @focus="focused = true"
      @blur="focused = false"
      :aria-label="props.label"
      v-bind="$attrs"
      ref="input"
    >
    <Transition name="input__show-hide-btn">
      <button
        v-wave
        v-if="props.type == 'password' && float"
        class="input__show-hide-btn"
        aria-label="Passwort anzeigen"
        type="button"
        @keydown.space.prevent="showPassword = true"
        @keyup.space.prevent="showPassword = false"
        @keydown.enter.prevent="showPassword = true"
        @keyup.enter.prevent="showPassword = false"
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
import { computed, onMounted, ref, watch } from 'vue'

const emit = defineEmits([
  'update:modelValue'
])

const props = defineProps({
  type: {
    type: String,
    default: () => 'text'
  },
  label: String,
  modelValue: [String, Number],
  min: Number,
  max: Number,
  steps: {
    type: Number,
    default: () => 1
  }
})

const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  if (props.type === 'number') {
    return 'text'
  }
  return props.type
})
const showPassword = ref(false)

const input = ref(null as HTMLInputElement | null)

const inputValue = ref(props.modelValue)
watch(() => props.modelValue, val => { inputValue.value = val })
watch(inputValue, (val, old) => {
  if (props.type === 'number') {
    val = typeof val === 'number' ? val : parseFloat(val as string)
    if (props.min) val = Math.max(val, props.min)
    if (props.max) val = Math.min(val, props.max)

    if (props.min) {
      val = Math.round((val - props.min) / props.steps) * props.steps + props.min
    } else {
      val = Math.round(val / props.steps) * props.steps
    }

    if (!isFinite(val) || isNaN(val)) {
      inputValue.value = old
      input.value.value = old
      return
    }
  }

  input.value.value = val
  emit('update:modelValue', val)
})

function onChange (e: InputEvent) {
  inputValue.value = (e.target as HTMLInputElement).value
  input.value.value = inputValue.value
}

onMounted(() => {
  input.value.value = inputValue.value
})

const focused = ref(false)
const float = computed(() => focused.value || inputValue.value?.toString().length > 0)
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

  &.dark {
    background: r.$bg-primary;
  }

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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

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
        margin-right: -30%;
        font-weight: 600;
      }
    }
  }
}
</style>
