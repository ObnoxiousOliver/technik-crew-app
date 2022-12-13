<template>
  <calendar-view
    :show-date="showDate"
    :show-times="true"
    :startingDayOfWeek="1"
    :time-format-options="{ hour: 'numeric', minute: '2-digit' }"
    :items="items"
    class="calendar theme-default"
  >
    <template #header>
      <div class="calendar__header">
        <div class="calendar__header__month">
          {{ showDate.toLocaleString('default', { month:'long' }) }}
          {{ showDate.getFullYear() }}
        </div>
        <Btn>
          <i class="bi-chevron-left"></i>
        </Btn>
        <Btn>
          <i class="bi-chevron-right"></i>
        </Btn>
        <Btn>
          <i class="bi-arrow-clockwise"></i>
        </Btn>
      </div>
    </template>
  </calendar-view>

  <!-- {{ items }} -->
</template>

<script lang="ts" setup>
import { CalendarView, CalendarViewHeader } from 'vue-simple-calendar'
import 'vue-simple-calendar/dist/style.css'
import { ICalendarItem as CalendarItem } from 'vue-simple-calendar/dist/src/ICalendarItem'
import { EventDB } from '../model/event'
import { computed, ref } from 'vue'

const showDate = ref(new Date())
const props = defineProps({
  events: Array
})

const items = computed((): CalendarItem[] => props.events
  ?.map((e: EventDB): CalendarItem => ({
    id: e.id,
    title: e.name,
    startDate: getDate(e.startDate, e.wholeDay),
    endDate: e.endDate ? getDate(e.endDate, e.wholeDay) : undefined
  }))
)

function getDate (dateNumber: number, wholeDay: boolean): string {
  let dateString = ''
  const date = new Date(dateNumber)
  dateString += `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

  if (wholeDay) {
    dateString += ` ${date.getHours()}:${date.getMinutes()}:00`
  }

  return dateString
}
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.calendar {
  background: r.$bg-secondary;
  border-radius: r.$radius;

  :deep() {
    .cv-day, .cv-header-day {
      border-width: 0 1px 0 0;

      &:nth-child(7) {
        border-width: 0;
      }
    }

    .cv-week {
      border-width: 0 0 1px;

      &:last-child {
        border-width: 0;
      }
    }

    .cv-header-days {
      border-width: 0 0 1px;
    }

    .cv-weeks {
      border-width: 0;
    }

    .cv-header-days, .cv-header-day, .cv-weeks, .cv-week, .cv-day, .cv-item {
      border-color: r.$text-secondary;
    }
  }
}
</style>
