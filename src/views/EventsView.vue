<template>
  <UserPage
    :addBtn="true"
    :addBtnTo="{ name: 'events-add' }"
    :search="true"
    @search="search"
    @searchOpen="inSearchMenu = $event"
  >
    <template #btns>
    </template>
    <template #title>
      <i class="bi-calendar2-week"/>Termine
    </template>

    <div class="events-view__btns">
      <Btn
        aria-label="Vorheriger Monat"
        @click="prev"
        class="events-view__btns__prev"
        square
      >
        <i class="bi-chevron-left" />
      </Btn>
      <Btn
        :aria-label="`Zum ${currentMonth} springen`"
        @click="current"
        class="events-view__btns__current"
      >
        {{ date.toLocaleString('de', { month: 'long', year: 'numeric' }) }}
      </Btn>
      <DateSelect month noText v-model="date" />
      <Btn
        aria-label="Nächster Monat"
        @click="next"
        class="events-view__btns__next"
        square
      >
        <i class="bi-chevron-right" />
      </Btn>
    </div>

    <EventCalendar
      class="events-view__calendar"
      :events="events"
      v-model:date="date"
    />
  </UserPage>
</template>

<script lang="ts" setup>
import DateSelect from '../components/DateSelect.vue'
import UserPage from '../layout/UserPage.vue'
import EventCalendar from '../components/EventCalendar.vue'
import { useEvents } from '@/stores/events'
import { computed, ref, watch } from 'vue'

const eventStore = useEvents()

const events = computed(() => eventStore.events)

const currentMonth = new Date().toLocaleString('de', { month: 'long', year: 'numeric' })

const date = ref(new Date())
watch(date, (val) => {
  eventStore.setSubscribingMonth(val)
})

function next () {
  const d = new Date(date.value)
  d.setDate(1)
  d.setMonth(d.getMonth() + 1)
  date.value = d
}

function current () {
  date.value = new Date()
}

function prev () {
  const d = new Date(date.value)
  d.setDate(1)
  d.setMonth(d.getMonth() - 1)
  date.value = d
}
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.events-view {
  &__btns {
    // margin: 0 -1rem;
    display: flex;
    gap: .5rem;
    flex-flow: row nowrap;
    justify-content: center;
    margin-bottom: .5rem;

    &__current {
      flex: 1;
      white-space: nowrap;
    }
  }

  &__calendar {
    @include r.box;
    height: calc(100% - 3.5rem);
    min-height: 25rem;
  }
}
</style>
