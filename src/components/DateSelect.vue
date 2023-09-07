<template>
  <!-- <Btn
    :class="['date-select', {
      'date-select--disabled': disabled,
      'date-select--no-text': noText
    }]"
    :square="noText"
    >
    <template v-if="noText">
      <i class="bi-calendar2-week" />
    </template>
    <template v-else>
      <span class="date-select__display">
        {{ dateString }}
      </span>
      <div class="date-select__icon">
        <i class="bi-calendar2-week" />
      </div>
    </template> -->

  <input
    @click="() => {
      input?.showPicker()
    }"
    v-model="dateInput"
    ref="input"
    :class="['date-select', {
      'date-select--disabled': disabled
    }]"
    type="date"
    :disabled="disabled"
  >
  <!-- :type="month ? 'month' : 'date'" -->
  <!-- </Btn> -->

</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  modelValue: Date | null,
  disabled?: boolean,
  // month?: boolean,
  noClear?: boolean
  // noText?: boolean
}>()
const emit = defineEmits(['update:modelValue'])

const input = ref<HTMLInputElement>()

const date = ref<Date | null>(props.modelValue || new Date())
watch(date, (val) => {
  emit('update:modelValue', val)
})
watch(() => props.modelValue, (val) => {
  const opt: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: /* props.month ? undefined :  */'2-digit'
  }
  if (val) {
    if (val.toLocaleString('en-US', opt) !== date.value?.toLocaleString('en-US', opt)) {
      date.value = val

      if (input.value) {
        input.value.value = dateInput.value
      }
    }
  }
})

function getDateAsString (date: Date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

const dateInput = computed({
  get: () => {
    if (!date.value) return props.noClear ? getDateAsString(new Date()) : ''

    return getDateAsString(date.value)
  },
  set: (val) => {
    if (val === '' && props.noClear) {
      if (input.value) {
        input.value.value = getDateAsString(new Date())
      }
      return
    }

    if (val === '') {
      date.value = null
      return
    }

    date.value = new Date(val)
  }
})

// const dateString = computed(() => {
//   return date.value?.toLocaleDateString('de-DE', props.month
//     ? {
//         year: 'numeric',
//         month: 'long'
//       }
//     : {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       }) ?? ''
// })
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.date-select {
  // position: relative;
  // font-weight: normal;
  // white-space: nowrap;

  // &:not(&--no-text) {
  //   padding-left: 1rem;

  //   & > :deep(.btn__content) {
  //     display: flex;
  //     align-items: center;
  //     justify-content: space-between;
  //   }
  //   padding-right: 1rem;
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
