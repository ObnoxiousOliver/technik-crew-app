<template>
  <UserPage>
    <template #title>
      <i class="bi-house-door" />Dashboard
    </template>

    <InfoCard v-if="useUpdate().updated.value">
      <template #title>
        <i class="bi-arrow-repeat" />Update installiert
      </template>

      <template #desc>
        Es ist ein neues Update automatisch installiert worden.
        Die Änderungen werden nach einem Neustart wirksam.
      </template>
    </InfoCard>
    <InfoCard v-else-if="useUpdate().updateFound.value">
      <template #title>
        <i class="bi-arrow-repeat" />Update wird installiert...
      </template>

      <Spinner />
    </InfoCard>

    <div class="dashboard-grid">
      <LensCard />

      <UpcomingEventsCard :events="(upcomingEvents as Event[])" />

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
import InfoCard from '@/components/InfoCard.vue'
import Event from '@/model/event'
import { useUpdate } from '@/utilities/update'

const eventStore = useEvents()
const events = computed(() => eventStore.events)

const upcomingEvents = computed(() => eventStore.upcoming)

eventStore.fetchUpcoming()

const date = ref(new Date())
watch(date, (val) => {
  eventStore.setSubscribingMonth(val)
})

function reload () {
  location.reload()
}
</script>

<style lang="scss" scoped>
.dashboard-grid {
  display: flex;
  gap: 1rem;
  flex-flow: column nowrap;
}
</style>
