<template>
  <!-- <Btn
    :class="['time-select', {
      'time-select--disabled': disabled
    }]"
    > -->
  <!-- <span class="time-select__display">
      {{ timeString }}
    </span>
    <div class="time-select__icon">
      <i class="bi-clock" />
    </div> -->

  <input
    v-model="timeInput"
    ref="input"
    type="time"
    :class="['time-select', {
      'time-select--disabled': disabled
    }]"
    @click="() => {
      input?.showPicker()
    }"
    :disabled="disabled"
  >
  <!-- </Btn> -->
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  modelValue: Date,
  disabled?: boolean
}>()
const emit = defineEmits(['update:modelValue'])
const input = ref<HTMLInputElement>()

const t = props.modelValue ?? new Date()
t.setSeconds(0)
const time = ref(t)
watch(time, (val) => {
  emit('update:modelValue', val)
})
watch(() => props.modelValue, (val) => {
  const opt: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit'
  }
  if (val) {
    if (val.toLocaleString('en-US', opt) !== time.value.toLocaleString('en-US', opt)) {
      time.value = val

      if (input.value) {
        input.value.value = timeInput.value
      }
    }
  }
})

const timeInput = computed({
  get: () => time.value.toTimeString().split(' ')[0].split(':').slice(0, 2).join(':'),
  set: (val) => {
    if (val === '') {
      time.value = new Date()
      return
    }

    const t = new Date()
    t.setHours(
      parseInt(val.split(':')[0]),
      parseInt(val.split(':')[1]),
      0
    )
    time.value = t
  }
})

// const timeString = computed(() => {
//   return time.value.toLocaleTimeString('de-DE', {
//     hour: '2-digit',
//     minute: '2-digit'
//   })
// })
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.time-select {
  // @include r.box;
  // position: relative;
  // padding-left: 1rem;
  // padding-right: 1rem;
  // font-weight: normal;
  // white-space: nowrap;
  // cursor: pointer;

  // & > :deep(.btn__content) {
  //   display: flex;
  //   align-items: center;
  //   justify-content: space-between;
  // }

  // &__display {
  //   user-select: text;
  // }

  // &__input {
    @include r.box;
    padding: 0 1rem;
    height: 3rem;
    border: none;
    font: inherit;
    color: inherit;

    transition: .2s;

    &:focus-visible {
      outline: none;
      box-shadow: r.$focus;
    }
  // }

  &--disabled {
    pointer-events: none;
    opacity: 0.5;
  }
}
</style>
