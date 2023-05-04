<template>
  <div class="date-time-select">
    <DateSelect :disabled="disabled || disabledDate" class="date-time-select__date" v-model="date" />
    <TimeSelect :disabled="disabled || disabledTime" class="date-time-select__time" v-model="time" />
  </div>
</template>

<script lang="ts" setup>
import DateSelect from '@/components/DateSelect.vue'
import TimeSelect from '@/components/TimeSelect.vue'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  modelValue: Date,
  disabled?: boolean,
  disabledDate?: boolean,
  disabledTime?: boolean
}>()
const emit = defineEmits<{
  'update:modelValue': Date
}>()

const value = ref(props.modelValue ?? new Date())
watch(value, (val) => {
  emit('update:modelValue', val)
})
watch(() => props.modelValue, (val) => {
  const opt = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }
  if (val) {
    if (val.toLocaleString('en-US', opt) !== value.value.toLocaleString('en-US', opt)) {
      value.value = val
    }
  }
})

const date = computed({
  get: () => value.value,
  set: (val) => {
    const t = new Date(value.value)
    t.setFullYear(
      val.getFullYear(),
      val.getMonth(),
      val.getDate()
    )
    value.value = t
  }
})

const time = computed({
  get: () => value.value,
  set: (val) => {
    const t = new Date(value.value)
    t.setHours(
      val.getHours(),
      val.getMinutes(),
      0
    )
    value.value = t
  }
})
</script>

<style lang="scss" scoped>
.date-time-select {
  display: flex;
  gap: .5rem;

  &__date {
    flex: 2;
  }

  &__time {
    flex: 1;
  }
}
</style>
