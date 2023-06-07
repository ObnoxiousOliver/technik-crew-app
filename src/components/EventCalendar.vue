<template>
  <CalendarView
    :show-date="date"
    :startingDayOfWeek="1"
    :itemContentHeight="'1.4em'"
    :itemTop="'2em'"
    :itemBorderHeight="'0.2em'"
    :time-format-options="{ hour: 'numeric', minute: '2-digit' }"
    :items="items"
    class="calendar theme-default"
    @click-item="itemClick"
  >
    <template #header>
    </template>
  </CalendarView>
</template>

<script lang="ts" setup>
import { CalendarView } from 'vue-simple-calendar'
import 'vue-simple-calendar/dist/style.css'
import { ICalendarItem as CalendarItem } from 'vue-simple-calendar/dist/src/ICalendarItem'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Event from '@/model/event'

const props = defineProps<{
  events: Event[],
  date: Date
}>()
const router = useRouter()

const items = computed(() => props.events
  ?.filter(e => e.hidden !== true && e.id).map((e) => ({
    id: e.id,
    title: e.name || 'Unbenannter Termin',
    startDate: getDate(e.startDate, e.wholeDay),
    endDate: e.endDate && getDate(e.endDate, e.wholeDay),
    classes: ['calendar-' + (e.color ?? 'gray')]
  }))
)

function getDate (dateNumber: number, wholeDay: boolean): string {
  let dateString = ''
  const date = new Date(dateNumber)
  dateString += `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

  if (!wholeDay) {
    dateString += ` ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:01`
  }

  return dateString
}

function itemClick (item: CalendarItem) {
  router.push({ name: 'events-details', params: { id: item.id } })
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
      border-width: 0 0 1px;
    }

    .cv-header-day {
      padding: .8rem 0;
      font-size: .8rem;
      font-weight: 600;
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

      .cv-day-number {
        color: r.$accent;
      }

      &::before {
        content: '';
        z-index: -1;
        position: absolute;
        inset: 0 25% auto;
        height: .3rem;
        background: r.$accent;
        border-radius: 0 0 r.$radius r.$radius;
      }
    }

    .cv-day {
      justify-content: center;
    }

    .cv-day-number {
      margin-top: .3em;
    }

    .outsideOfMonth {
      color: r.$text-secondary;
      font-size: .8rem;
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

    .calendar-gray {
      background-color: r.$col-gray;
      color: white;
      // box-shadow: rgba(r.$col-gray, 0.2) 0 .2rem 1rem;
    }
    .calendar-red {
      background-color: r.$col-red;
      // box-shadow: rgba(r.$col-red, 0.2) 0 .2rem 1rem;
    }
    .calendar-orange {
      background-color: r.$col-orange;
      // box-shadow: rgba(r.$col-orange, 0.2) 0 .2rem 1rem;
    }
    .calendar-yellow {
      background-color: r.$col-yellow;
      // box-shadow: rgba(r.$col-yellow, 0.2) 0 .2rem 1rem;
    }
    .calendar-green {
      background-color: r.$col-green;
      // box-shadow: rgba(r.$col-green, 0.2) 0 .2rem 1rem;
    }
    .calendar-cyan {
      background-color: r.$col-cyan;
      // box-shadow: rgba(r.$col-cyan, 0.2) 0 .2rem 1rem;
    }
    .calendar-blue {
      background-color: r.$col-blue;
      // box-shadow: rgba(r.$col-blue, 0.2) 0 .2rem 1rem;
    }
    .calendar-purple {
      background-color: r.$col-purple;
      // box-shadow: rgba(r.$col-purple, 0.2) 0 .2rem 1rem;
    }
    .calendar-pink {
      background-color: r.$col-pink;
      // box-shadow: rgba(r.$col-pink, 0.2) 0 .2rem 1rem;
    }

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
