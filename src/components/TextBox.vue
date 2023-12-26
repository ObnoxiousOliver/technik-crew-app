<template>
  <div
    :class="['text-box', {
      'text-box--focused': focused,
      'text-box--has-label': label
    }]"
  >
    <div class="text-box__content">
      <div v-if="label" class="text-box__label" @click="inputEl?.focus()">
        {{ label }}
      </div>
      <div class="text-box__area-container">
        <span
          contenteditable="true"
          role="textbox"
          ref="inputEl"
          class="text-box__area"
          @paste="paste"
          @focus="focused = true"
          @blur="focused = false"
          @input="input"
          inputmode="text"
        />
        <span class="text-box__placeholder" v-if="value.trim().length === 0">
          {{ placeholder }}
        </span>
      </div>
    </div>

    <div v-if="$slots.buttons" class="text-box__buttons">
      <slot name="buttons" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  label: String,
  placeholder: String,
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])

const inputEl = ref<HTMLElement>()

const focused = ref(false)
const value = ref(props.modelValue ?? '')
watch(value, (val) => {
  emit('update:modelValue', val)
})
watch(() => props.modelValue, (val) => {
  if (val !== value.value) {
    if (inputEl.value) {
      inputEl.value.innerText = val ?? ''
    }
    value.value = val ?? ''
  }
})

onMounted(() => {
  if (inputEl.value) {
    inputEl.value.innerText = value.value
  }
})

function input (e: Event) {
  console.log('input', (e.target as HTMLSpanElement).innerText)

  value.value = (e.target as HTMLSpanElement).innerText
  if (inputEl.value) {
    if (inputEl.value.children.length > 0) {
      if (inputEl.value.innerHTML === inputEl.value.innerText) {
        inputEl.value.innerHTML = inputEl.value.innerText
      }
    }
  }
}

function paste (e: ClipboardEvent) {
  e.preventDefault()
  const text = e.clipboardData?.getData('text/plain')
  const selectedRange = window.getSelection()?.getRangeAt(0)
  if (!selectedRange || !text) return

  selectedRange.deleteContents()
  selectedRange.insertNode(document.createTextNode(text))
  selectedRange.setStart(selectedRange.endContainer, selectedRange.endOffset)

  input(e)
}
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.text-box {
  @include r.box;
  position: relative;
  display: grid;
  // padding: .8rem 1rem 1rem;
  grid-template-columns: 1fr;
  grid-auto-columns: auto;

  transition: box-shadow .2s;

  &--focused {
    box-shadow: r.$focus;
  }

  &--has-label {
    .text-box {
      &__content {
        grid-row: span 1;
      }
      &__area, &__placeholder {
        padding: 0 1rem 1rem;
      }
    }
  }

  &__label {
    font-size: .8rem;
    padding: .8rem 1rem .2rem;
    color: r.$text-secondary;
    font-weight: 600;
  }

  &__area-container {
    position: relative;
    height: 100%;
    min-height: 3rem;
  }

  &__area {
    padding: .75rem 1rem;
    display: block;
    width: 100%;
    resize: both;
    min-height: 100%;
    word-break: break-word;
    user-select: text;
    line-height: 1.5;
    white-space: pre-wrap;

    &:focus {
      outline: none;
    }
  }

  &__buttons {
    display: flex;
    padding: .25rem .25rem .25rem 0;
    margin-left: -1rem;
    grid-column: 2;
    grid-row: 1 / 3;

    :deep(.btn) {
      @include r.btnTransparent;
      @include r.btnSquare(2.5rem)
    }
  }

  &__content {
    grid-row: span 2;
    height: fit-content;
  }

  &__placeholder {
    position: absolute;
    inset: 0;
    padding: .75rem 1rem;
    line-height: 1.5;
    pointer-events: none;
    color: r.$text-secondary;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
