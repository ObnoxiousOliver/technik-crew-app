<template>
  <DashboardCard class="upcoming-events">
    <template #title>
      <i class="bi-calendar2-week"/>Nächste Termine
    </template>

    <ul class="upcoming-events__list">
      <li
        class="upcoming-events__list-item"
        v-for="event in events"
        :key="event.id"
      >
        <RouterLink
          class="upcoming-events__event-link"
          v-wave
          :to="{ name: 'event', params: { id: event.id } }"
        >
          <div :class="['upcoming-events__event-link__color', 'upcoming-events__event-link__color--' + event.color ?? 'gray']"></div>
          <div class="upcoming-events__event-link__name">
            {{ event.name || 'Unbenannter Termin' }}
            <br>
            <span class="upcoming-events__event-link__date">
              am {{ getDate(event) }}
            </span>
            <br>
          </div>
          <div v-if="event.description" class="upcoming-events__event-link__description">
            {{ event.description }}
          </div>
        </RouterLink>
      </li>
    </ul>
  </DashboardCard>
</template>

<script lang="ts" setup>
import DashboardCard from '@/components/DashboardCard.vue'
import Event from '@/model/event'
import { toDateString } from '@/utilities/date'

defineProps<{
  events: Event
}>()

function getDate (event: Event) {
  const d = new Date(event.startDate)

  let year = 'numeric'
  if (d.getFullYear() === new Date().getFullYear()) {
    year = undefined
  }

  return toDateString(d, {
    year,
    month: 'long',
    hour: undefined,
    minute: undefined,
    second: undefined
  })
}
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.upcoming-events {
  &__list {
    list-style: none;
    padding: 0 0 .5rem;
    margin: 0;
  }

  &__list-item {
  }

  &__event-link {
    display: flex;
    padding: .5rem 1.5rem .5rem 1rem;
    gap: 1rem;
    align-items: center;
    color: inherit;
    text-decoration: none;

    &__name {
      flex: 1 1 auto;
    }

    &__date {
      color: r.$text-secondary;
    }

    &__description {
      color: r.$text-secondary;
    }

    &__color {
      width: 1.2rem;
      height: 1.2rem;
      border-radius: 50%;
      background: currentColor;
      border: 1px solid rgba(r.$text-primary, 0.2);

      &--gray { color: r.$col-gray; }
      &--red { color: r.$col-red; }
      &--orange { color: r.$col-orange; }
      &--yellow { color: r.$col-yellow; }
      &--green { color: r.$col-green; }
      &--cyan { color: r.$col-cyan; }
      &--blue { color: r.$col-blue; }
      &--purple { color: r.$col-purple; }
      &--pink { color: r.$col-pink; }
    }
  }
}
</style>
