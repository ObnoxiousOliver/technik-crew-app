<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div :class="['input', {
    'input--disabled': disabled,
    'input--has-before': !!$slots.before,
    'input--has-after': !!$slots.after,
    'input--focused': focused
  }]">
    <div v-if="$slots.before" class="input__before">
      <slot name="before" />
    </div>
    <input
      class="input__field"
      ref="input"
      :disabled="disabled"
      v-model="value"
      @focus="focused = true"
      @blur="focused = false"
      v-bind="$attrs"
    >
    <div v-if="$slots.after" class="input__after">
      <slot name="after" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const focused = ref(false)
const input = ref(null as HTMLInputElement | null)

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: String,
    default: ''
  }
})

const value = ref(props.modelValue)
watch(value, (val) => {
  emit('update:modelValue', val)
})
watch(() => props.modelValue, (val) => {
  value.value = val
})

defineExpose({
  input,
  focus () {
    if (input.value) {
      input.value.focus()
    }
  },
  blur () {
    if (input.value) {
      input.value.blur()
    }
  }
})
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.input {
  position: relative;
  display: inline-flex;
  background: r.$bg-secondary;
  border-radius: r.$radius;
  align-items: center;
  height: 3rem;
  overflow: hidden;

  transition: box-shadow .2s, opacity .2s;

  &--focused {
    box-shadow: r.$focus;
  }

  &--disabled {
    opacity: 0.5;
  }

  &--has-after {
    .input__field {
      padding-right: 0;
    }
  }

  &__before {
    & > :deep(i) {
      margin-left: 1rem;
    }
  }

  &__after {
    & > :deep(i) {
      margin-right: 1rem;
    }
  }

  &__before,
  &__after {
    color: r.$text-secondary;

    & > :deep(.btn) {
      background: none !important;
      height: 3rem;
      width: 3rem;
      padding: 0;
    }
  }

  &__field {
    flex: 1 1 auto;
    width: 0;
    height: 100%;
    padding: 0 .5rem 0 1rem;
    display: inline-block;
    background: none;
    border: none;
    font: inherit;
    color: inherit;

    &:focus-visible {
      outline: none;
    }

    &:disabled {
      opacity: 0.5;
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &[type=number] {
      -moz-appearance: textfield;
    }
  }
}
</style>
