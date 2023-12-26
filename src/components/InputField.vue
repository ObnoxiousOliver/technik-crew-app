<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div
    v-bind="$attrs"
    :class="['input', {
      'input--disabled': disabled,
      'input--has-before': !!$slots.before,
      'input--has-after': !!$slots.after,
      'input--focused': focused,
      'input--label': label,
      'input--dark': dark,
      'input--before-padding': beforePadding,
      'input--after-padding': afterPadding,
      'input--suggestions': suggestions
    }]"
  >
    <div class="input__label" v-if="label">
      {{ label }}
    </div>
    <div class="input__before">
      <slot name="before" />
    </div>
    <input
      class="input__field"
      ref="input"
      :disabled="disabled"
      @keydown.enter="enter"
      @focus="inputFocused = true"
      @blur="inputFocused = false"
      :type="type"
      v-bind="$attrs"
      v-model="value"
    >
    <!-- @change="onChange"
    @keydown="onChange" -->
    <!-- :inputmode="type === 'number' ? 'decimal' : undefined" -->
    <div class="input__after">
      <slot name="after" />
    </div>
    <div
      v-if="!disabled && suggestions && focused"
      class="input__suggestions"
    >
      <ul>
        <li v-for="suggestion in suggestions" :key="suggestion">
          <Btn
            chip
            class="input__suggestion"
            @focus="buttonFocused[suggestion] = true"
            @blur="buttonFocused[suggestion] = false"
            @click="selectSuggestion(suggestion)"
          >
            {{ suggestion }}
          </Btn>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'

const inputFocused = ref(false)
const buttonFocused = ref<Record<string, boolean>>({})

const focused = ref(false)
watch([inputFocused, buttonFocused], () => {
  setTimeout(() => {
    focused.value = inputFocused.value || Object.values(buttonFocused.value).some((v) => v)
  })
}, { immediate: true, deep: true })

const input = ref(null as HTMLInputElement | null)

const emit = defineEmits(['update:modelValue', 'submit'])

const props = defineProps<{
  label?: string
  disabled?: boolean
  modelValue?: string | number
  type?: 'text' | 'password' | 'email' | 'number' | 'search'
  dark?: boolean,
  beforePadding?: boolean,
  afterPadding?: boolean,
  suggestions?: string[]
}>()
const disabled = computed(() => props.disabled ?? false)
const type = computed(() => props.type ?? 'text')

const value = ref(props.modelValue)
watch(value, (val, old) => {
  if (!input.value) return

  input.value.value = val
  emit('update:modelValue', val)
})
watch(() => props.modelValue, (val) => {
  if (!input.value) return

  value.value = val
  input.value.value = val
})

// function onChange (e: InputEvent) {
//   value.value = (e.target as HTMLInputElement).value
//   input.value.value = value.value
// }

async function enter () {
  setTimeout(() => {
    if (!input.value) return
    emit('submit', input.value.value)
  })
}

onMounted(() => {
  if (!input.value) return

  input.value.value = value.value?.toString() ?? ''
})

function selectSuggestion (suggestion: string) {
  if (!input.value) return

  value.value = suggestion
  input.value.value = suggestion
  input.value.focus()
}

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
  overflow: hidden;

  transition: box-shadow .2s, opacity .2s;

  &__label {
    position: absolute;
    top: .4rem;
    left: .75rem;
    font-weight: 600;
    font-size: .8rem;
    padding: 0 .3rem;
    color: r.$text-secondary;
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

  &--dark {
    background: r.$bg-primary;
  }

  &__before {
    & > :deep(i) {
      margin-left: 1rem;
    }

    .input--before-padding > & {
      padding-left: 1rem;
    }
  }

  &__after {
    & > :deep(i) {
      margin-right: 1rem;
    }

    .input--after-padding > & {
      padding-right: 1rem;
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
    flex: 1;
    width: 0;
    height: 3rem;
    padding: 0 .5rem 0 1rem;
    display: inline-block;
    background: none;
    border: none;
    font: inherit;
    color: inherit;

    .input--label & {
      padding-top: .75rem;
    }

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

  &__suggestions {
    overflow: auto;
    grid-row: 2;
    grid-column: 1 / -1;
    padding: 0 1rem 1rem;
    margin-top: -.5rem;

    ul {
      display: flex;
      flex-direction: row;
      gap: 0.5rem;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    li {
      flex: 0 0 auto;

      padding: 0;
      margin: 0;
    }
  }

  &--suggestions {
    display: inline-grid;
    grid-template-columns: auto 1fr auto;

    .input__field {
      width: stretch;
    }
  }
}
</style>
