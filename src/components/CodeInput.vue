<template>
  <input
    class="code-input"
    ref="input"
    placeholder="XXXXXX"
    type="text"
    inputmode="numeric"
    @input="codeInput"
    :value="code"
  />
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
}>()
const emit = defineEmits<{(e: 'update:modelValue', v: string): void}>()
const code = computed({
  get: () => _code.value,
  set: (val) => {
    _code.value = val.split('').filter(x => '0123456789'.includes(x)).join('').slice(0, 6)
    emit('update:modelValue', val)
  }
})
const _code = ref()
const input = ref(null)

onMounted(() => {
  code.value = props.modelValue
})

function codeInput (e: InputEvent) {
  if (e.inputType === 'insertText' && !'0123456789'.includes(e.data)) {
    e.target.value = code.value
    return
  }
  if (e.target.value.length <= 6) {
    code.value = e.target.value
  }
  e.target.value = code.value
}
watch(code, (val) => {
  input.value = val
  emit('update:modelValue', val)
})
watch(() => props.modelValue, (val) => {
  code.value = val
})
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.code-input {
  width: 100%;
  height: 4rem;

  border: none;
  font: inherit;
  color: inherit;
  background: r.$bg-secondary;
  border-radius: r.$radius;

  text-align: center;
  letter-spacing: 1em;
  text-indent: 1em;
  font-size: 1.5rem;

  transition: box-shadow .2s;

  &::placeholder {
    color: r.$text-secondary;
  }

  &:focus {
    outline: none;
    box-shadow: r.$focus;
  }
}
</style>
