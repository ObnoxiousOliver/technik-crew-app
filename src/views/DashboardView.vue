<template>
  <UserPage>
    <template #title>
      <i class="bi-house-door"/>Dashboard
    </template>

    <div class="dashboard-grid">
      <UpcomingEventsCard :events="upcomingEvents" />

      <EventCalendar :events="events" v-model:date="date">
        <template #btns>
          <Btn @click="refresh">
            <i class="bi-arrow-counterclockwise"/>
          </Btn>
        </template>
      </EventCalendar>
    </div>
  </UserPage>
</template>

<script lang="ts" setup>
import UpcomingEventsCard from '@/components/UpcomingEventsCard.vue'
import { useEvents } from '@/stores/events'
import { computed, onMounted, ref, watch } from 'vue'
import EventCalendar from '../components/EventCalendar.vue'
import UserPage from '../layout/UserPage.vue'

const eventStore = useEvents()
const events = computed(() => eventStore.events)

const upcomingAmount = ref(3)
const upcomingEvents = computed(() => eventStore.upcoming)
onMounted(async () => {
  await refresh()
})

const date = ref(new Date())
watch(date, (val) => {
  eventStore.fetchMonth(val)
})
async function refresh () {
  await getMonth()
  await eventStore.fetchUpcoming(upcomingAmount.value)
}

async function getMonth () {
  await eventStore.fetchMonth(date.value)
}
</script>

<style lang="scss" scoped>
.dashboard-grid {
  display: flex;
  gap: 1rem;
  flex-flow: column nowrap;
}
</style>
