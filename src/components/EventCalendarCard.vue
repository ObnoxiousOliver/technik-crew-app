<template>
  <Card>
    <template #title>
      <Btn @click="date = new Date()" :aria-label="`Nach ${new Date().toLocaleString('de', { month:'long' })} springen`">
        {{ date.toLocaleString('de', { month:'long' }) }}
        {{ date.getFullYear() }}
      </Btn>
    </template>
    <template #btns>
      <DateSelect month noText v-model="date" />
      <Btn @click="previousMonth" aria-label="Ein Monat zurück">
        <i class="bi-chevron-left"></i>
      </Btn>
      <Btn @click="nextMonth" aria-label="Ein Monat vor">
        <i class="bi-chevron-right"></i>
      </Btn>
      <slot name="btns" />
    </template>

    <EventCalendar v-model:date="date" :events="events" />
  </Card>
</template>

<script lang="ts" setup>
import DateSelect from './DateSelect.vue'
import Card from './DashboardCard.vue'
import EventCalendar from './EventCalendar.vue'
import 'vue-simple-calendar/dist/style.css'
import { ref, watch } from 'vue'

const emit = defineEmits([
  'update:date'
])
const props = defineProps({
  events: Array,
  date: Date
})
const date = ref(props.date ?? new Date())
watch(date, (val) => {
  emit('update:date', val)
})
watch(() => props.date, (val) => {
  if (val) {
    date.value = val
  }
})

function nextMonth () {
  const d = new Date(date.value)
  d.setDate(1)
  d.setMonth(d.getMonth() + 1)
  date.value = d
}
function previousMonth () {
  const d = new Date(date.value)
  d.setDate(1)
  d.setMonth(d.getMonth() - 1)
  date.value = d
}
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.calendar {
  border-top: 1px solid r.$bg-stroke;
}
</style>
