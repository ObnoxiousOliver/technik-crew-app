<template>
  <Page>
    <template #title>
      <div :class="['event-color', 'event-color--' + event?.color]" />{{ event?.name ?? 'Termin' }}
    </template>

    <SettingsList>
      <SettingsListOption>
        <i class="bi bi-card-text" />Beschreibung
        <template #desc>
          <template v-if="event?.description">
            <span class="pre-wrap">
              {{ event?.description }}
            </span>
          </template>
          <template v-else>
            <i>Keine Beschreibung</i>
          </template>
        </template>
      </SettingsListOption>

      <SettingsListOption>
        <i class="bi bi-calendar2-event" />Datum
        <template #desc>
          {{ startDate }}
          <template v-if="endDate">
            <br />
            {{ endDate }}
          </template>
        </template>
      </SettingsListOption>
    </SettingsList>
  </Page>
</template>

<script lang="ts" setup>
import SettingsList from '@/components/SettingsList.vue'
import { useEvents } from '@/stores/events'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import Event from '@/model/event'
import SettingsListOption from '@/components/SettingsListOption.vue'
import { toDateString } from '@/utilities/date'

const route = useRoute()

const eventStore = useEvents()

const event = ref<Event>()
;(async () => {
  event.value = await eventStore.getById(route.params.id as string)
})()

const startDate = computed(() => event.value?.startDate
  ? toDateString(new Date(event.value.startDate), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'auto',
    hour: event.value?.wholeDay ? undefined : 'numeric',
    minute: event.value?.wholeDay ? undefined : 'numeric'
  })
  : undefined)

const endDate = computed(() => {
  if (!event.value?.endDate) return undefined
  const end = new Date(event.value.endDate)
  const start = new Date(event.value.startDate)

  let sameDay = false
  let sameMonth = false

  if (wholeDay.value) {
    end.setHours(0, 0, 0, 0)
    start.setHours(0, 0, 0, 0)
  } else {
    const e = new Date(end)
    const s = new Date(start)
    s.setHours(0, 0, 0, 0)
    e.setHours(0, 0, 0, 0)

    if (e.getTime() === s.getTime()) {
      sameDay = true
    }

    if (e.getMonth() === s.getMonth() &&
      e.getFullYear() === s.getFullYear()) {
      sameMonth = true
    }
  }

  if (end.getTime() === start.getTime()) return undefined

  return toDateString(end, {
    weekday: 'long',
    day: sameDay ? undefined : 'numeric',
    month: sameMonth ? undefined : 'long',
    year: 'auto',
    hour: wholeDay.value ? undefined : 'numeric',
    minute: wholeDay.value ? undefined : 'numeric'
  })
})

const wholeDay = computed(() => event.value?.wholeDay)
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.event-color {
  display: inline-block;
  vertical-align: -0.2rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  margin-right: 0.5rem;
  background-color: r.$col-gray;
  border: 1px solid rgba(r.$text-primary, 0.2);

  &--red    { background-color: r.$col-red;     }
  &--orange { background-color: r.$col-orange;  }
  &--yelw   { background-color: r.$col-yellow;  }
  &--green  { background-color: r.$col-green;   }
  &--cyan   { background-color: r.$col-cyan;    }
  &--blue   { background-color: r.$col-blue;    }
  &--purple { background-color: r.$col-purple;  }
  &--pink   { background-color: r.$col-pink;    }
}
</style>
