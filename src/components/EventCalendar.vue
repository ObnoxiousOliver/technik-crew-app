<template>
  <Card>
    <template #title>
      <Btn @click="showDate = new Date()" :aria-label="`Nach ${new Date().toLocaleString('de', { month:'long' })} springen`">
        {{ showDate.toLocaleString('de', { month:'long' }) }}
        {{ showDate.getFullYear() }}
      </Btn>
    </template>
    <template #btns>
      <Btn @click="previousMonth" aria-label="Ein Monat zurück">
        <i class="bi-chevron-left"></i>
      </Btn>
      <Btn @click="nextMonth" aria-label="Ein Monat vor">
        <i class="bi-chevron-right"></i>
      </Btn>
      <slot name="btns" />
    </template>
    <calendar-view
      :show-date="showDate"
      :startingDayOfWeek="1"
      :itemContentHeight="'1.4em'"
      :itemBorderHeight="'0.2em'"
      :time-format-options="{ hour: 'numeric', minute: '2-digit' }"
      :items="items"
      class="calendar theme-default"
    >
      <template #header>
      </template>
    </calendar-view>
  </Card>
</template>

<script lang="ts" setup>
import Card from './DashboardCard.vue'
import { CalendarView } from 'vue-simple-calendar'
import 'vue-simple-calendar/dist/style.css'
import { ICalendarItem as CalendarItem } from 'vue-simple-calendar/dist/src/ICalendarItem'
import { EventDB } from '../model/event'
import { computed, ref } from 'vue'

const showDate = ref(new Date())
const props = defineProps({
  events: Array
})

const show = ref(false)

setTimeout(() => {
  show.value = true
}, 1000)

const emit = defineEmits([
  'needUpdate'
])

const items = computed((): CalendarItem[] => props.events
  ?.map((e: EventDB): CalendarItem => ({
    id: e.id,
    title: e.name,
    startDate: getDate(e.startDate, e.wholeDay),
    endDate: e.endDate && getDate(e.endDate, e.wholeDay),
    classes: ['calendar-' + (e.color ?? 'gray')]
  }))
)

function nextMonth () {
  const d = new Date(showDate.value)
  d.setMonth(d.getMonth() + 1)
  showDate.value = d

  emit('needUpdate')
}
function previousMonth () {
  const d = new Date(showDate.value)
  d.setMonth(d.getMonth() - 1)
  showDate.value = d

  emit('needUpdate')
}

function getDate (dateNumber: number, wholeDay: boolean): string {
  let dateString = ''
  const date = new Date(dateNumber)
  dateString += `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

  if (!wholeDay) {
    dateString += ` ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:01`
  }

  console.log(dateString)

  return dateString
}
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.calendar {
  height: 26rem;

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
      border-width: 1px 0 1px;
    }

    .cv-weeks {
      border-width: 0;
    }

    .cv-week {
      // min-height: 5.2rem;
      scroll-padding: 1rem;
    }

    .cv-weeknumber {
      color: r.$text-secondary;
      border-width: 0 1px 0 0;
      width: 1.5rem;

      span {
        display: inline-block;
        transform: rotate(-90deg)translateX(-.5rem);
      }
    }

    .cv-header-days, .cv-header-day, .cv-weeks, .cv-week, .cv-day, .cv-item, .cv-weeknumber {
      border-color: r.$bg-stroke;
    }

    .today {
      background: rgba(r.$accent, 0.1);
      .cv-day-number {
        color: r.$accent;
      }
    }

    .outsideOfMonth {
      color: r.$text-secondary
    }

    .cv-item {
      border-radius: 999rem;
      background: white;
      color: black;
      padding: .2rem .5rem;
      border: none;
      background-clip: padding-box;
      text-overflow: ellipsis;

      transition: background-color .2s, color .2s;
      cursor: pointer;
    }

    .calendar-gray   { background-color: #4a4a4a; color: white; }
    .calendar-red    { background-color: #FF7676; }
    .calendar-orange { background-color: #FFAD61; }
    .calendar-yellow { background-color: #FCFF6B; }
    .calendar-green  { background-color: #92FF6B; }
    .calendar-cyan   { background-color: #7AFFDF; }
    .calendar-blue   { background-color: #799FFF; }
    .calendar-purple { background-color: #C275FF; }
    .calendar-pink   { background-color: #FF6BCD; }

    .toBeContinued {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    .continued {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    .isHovered {
      background-color: r.$text-primary;
      color: r.$bg-primary;
    }

    @for $i from 1 through 7 {
      .span#{$i} {
        width: calc(((100% - 6px) / 7) * $i + 1px * ($i - 1));
      }
    }
    @for $i from 0 through 6 {
      .offset#{$i} {
        left: calc(((100% - 6px) / 7) * $i + 1px * $i);
      }
    }
  }
}
</style>
