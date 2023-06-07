<template>
  <Btn
    transparent
    class="event-btn"
    :to="{
      name: 'events-details',
      params: {
        id: event.id
      }
    }"
  >
    <EventColor class="event-btn__color" :color="event.color" />
    <div class="event-btn__name-date">
      <span class="event-btn__name">
        {{ event.name || 'Unbenannter Termin' }}
      </span>
      <span class="event-btn__date">
        {{ dateString }}
      </span>
    </div>
    <span class="event-btn__desc">
      {{  event.description }}
    </span>
  </Btn>
</template>

<script setup lang="ts">
import Event from '@/model/event'
import EventColor from './EventColor.vue'
import { computed } from 'vue'

const props = defineProps<{
  event: Event
}>()

const dateString = computed(() => {
  const event = props.event
  const sameDay = Event.isSameDay(event)
  const sameYear = Event.isSameYear(event)

  const s = new Date(event.startDate)
  const e = new Date(event.endDate)

  const thisYear = new Date().getFullYear() === s.getFullYear()

  let str = s.toLocaleDateString('de', {
    day: '2-digit',
    month: 'short',
    year: thisYear ? undefined : 'numeric',
    hour: event.wholeDay ? undefined : '2-digit',
    minute: event.wholeDay ? undefined : '2-digit'
  })

  if (!sameDay) {
    str += ' - '
    str += e.toLocaleDateString('de', {
      day: '2-digit',
      month: 'short',
      year: sameYear ? undefined : 'numeric',
      hour: event.wholeDay ? undefined : '2-digit',
      minute: event.wholeDay ? undefined : '2-digit'
    })
  }

  return str
})
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.event-btn {
  font-weight: normal;
  width: stretch;
  padding: .5rem .5rem;
  text-align: left;
  overflow: hidden;

  :deep(.btn__content) {
    display: flex;
    align-items: center;
    gap: .5rem;
  }

  &__color {
    flex: 0 0 auto;
  }
  &__name-date {
    display: flex;
    flex-flow: column nowrap;
    flex: 0 0 auto;
  }
  &__desc {
    flex: 1 1 auto;
    text-align: right;
    word-wrap: break-word;
    width: 0;
    font-size: .8em;
    color: r.$text-secondary;
    place-self: center;
  }
  &__date {
    font-size: .8em;
    color: r.$text-secondary;
  }
}
</style>
