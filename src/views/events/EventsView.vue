<template>
  <UserPage
    :addBtn="true"
    :addBtnTo="{ name: 'events-add' }"
    :search="true"
    @search="search"
    @searchOpen="searchOpen"
    :search-recents="recents"
  >
    <template #btns>
      <Btn
        :to="{
          name: 'events-archive'
        }"
      >
        <i class="bi-archive" />
      </Btn>
    </template>
    <template #title>
      <i class="bi-calendar2-week" />Termine
    </template>

    <template v-if="searchOpenState">
      <ul v-if="results.length > 0" class="events-view__results">
        <li class="events-view__results__item" v-for="(result, i) in (results as Event[])" :key="result.id ?? i">
          <EventBtn :event="result" />
        </li>
      </ul>
      <span v-else class="events-view__no-results">
        Keine Ergebnisse
      </span>
    </template>

    <template v-else>
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
        <!-- <DateSelect month noText v-model="date" /> -->
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
    </template>
  </UserPage>
</template>

<script lang="ts" setup>
import UserPage from '@/layout/UserPage.vue'
import EventCalendar from '@/components/EventCalendar.vue'
import { useEvents } from '@/stores/events'
import { computed, ref, watch, watchEffect } from 'vue'
import Event from '@/model/event'
import { useTemp } from '@/stores/temp'
import EventBtn from '@/components/EventBtn.vue'

const eventStore = useEvents()

const events = computed<Event[]>(() => eventStore.events as Event[])

const currentMonth = new Date().toLocaleString('de', { month: 'long', year: 'numeric' })

const temp = useTemp()

const recents = ref<string[]>(temp.getData('events-search-recents', false) as string[] | undefined ?? [])
watchEffect(() => {
  temp.setData('events-search-recents', recents.value)
})

const searchOpenState = ref(false)
const results = ref<Event[]>([])
function search (val: string) {
  results.value = eventStore.search(val)
  recents.value.push(val)
  recents.value = recents.value.filter((val, i, self) => self.lastIndexOf(val) === i)
}

function searchOpen (val: boolean) {
  searchOpenState.value = val
  if (!val) {
    results.value = []
  }
}

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
@use '../../scss' as r;

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

  &__no-results {
    display: block;
    text-align: center;
    margin-top: 1rem;
    color: r.$text-secondary;
  }

  &__results {
    list-style: none;
  }
}
</style>
