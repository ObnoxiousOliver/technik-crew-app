<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="input__label" v-if="label">
    {{ label }}
  </div>
  <div
    v-bind="$attrs"
    :class="['input', {
      'input--disabled': disabled,
      'input--has-before': !!$slots.before,
      'input--has-after': !!$slots.after,
      'input--focused': focused
    }]"
  >
    <div v-if="$slots.before" class="input__before">
      <slot name="before" />
    </div>
    <input
      class="input__field"
      ref="input"
      :disabled="disabled"
      @change="onChange"
      @keydown="onChange"
      @keydown.enter="enter"
      @focus="focused = true"
      @blur="focused = false"
      :type="type === 'number' ? 'text' : type"
      :inputmode="type === 'number' ? 'decimal' : undefined"
      v-bind="$attrs"
    >
    <div v-if="$slots.after" class="input__after">
      <slot name="after" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'

const focused = ref(false)
const input = ref(null as HTMLInputElement | null)

const emit = defineEmits(['update:modelValue', 'submit'])

const props = defineProps<{
  label?: string
  disabled?: boolean
  modelValue?: string | number
  type?: 'text' | 'password' | 'email' | 'number' | 'search'
  min?: number
  max?: number
  steps?: number
}>()
const disabled = computed(() => props.disabled ?? false)
const type = computed(() => props.type ?? 'text')

const min = computed(() => props.min ?? 0)
const max = computed(() => props.max ?? 100)
const steps = computed(() => props.steps ?? 1)

const value = ref(props.modelValue)
watch(value, (val, old) => {
  if (props.type === 'number') {
    val = typeof val === 'number' ? val : parseFloat(val as string)
    if (min.value) val = Math.max(val, min.value)
    if (max.value) val = Math.min(val, max.value)

    if (min.value) {
      val = Math.round((val - min.value) / steps.value) * steps.value + min.value
    } else {
      val = Math.round(val / steps.value) * steps.value
    }

    if (!isFinite(val) || isNaN(val)) {
      value.value = old
      input.value.value = old
      return
    }
  }

  input.value.value = val
  emit('update:modelValue', val)
})
watch(() => props.modelValue, (val) => {
  value.value = val
  input.value.value = val
})

function onChange (e: InputEvent) {
  value.value = (e.target as HTMLInputElement).value
  input.value.value = value.value
}

async function enter () {
  setTimeout(() => {
    emit('submit', input.value.value)
  })
}

onMounted(() => {
  input.value.value = value.value
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

  &__label {
    margin-bottom: -.5rem;
    font-weight: 600;
    font-size: .8rem;
    padding: 0 .3rem;
  }

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
