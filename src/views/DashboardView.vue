<template>
  <UserPage>
    <template #title>
      <i class="bi-house-door"/>Dashboard
    </template>

    <div class="dashboard-grid">
      <LensCard />

      <UpcomingEventsCard :events="upcomingEvents" />

      <EventCalendarCard :events="events" v-model:date="date" />
    </div>
  </UserPage>
</template>

<script lang="ts" setup>
import LensCard from '@/components/LensCard.vue'
import UpcomingEventsCard from '@/components/UpcomingEventsCard.vue'
import { useEvents } from '@/stores/events'
import { computed, ref, watch } from 'vue'
import EventCalendarCard from '../components/EventCalendarCard.vue'
import UserPage from '../layout/UserPage.vue'

const eventStore = useEvents()
const events = computed(() => eventStore.events)

const upcomingEvents = computed(() => eventStore.upcoming)

eventStore.fetchUpcoming()

const date = ref(new Date())
watch(date, (val) => {
  eventStore.setSubscribingMonth(val)
})
</script>

<style lang="scss" scoped>
.dashboard-grid {
  display: flex;
  gap: 1rem;
  flex-flow: column nowrap;
}
</style>
