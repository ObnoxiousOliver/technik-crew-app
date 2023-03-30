<template>
  <UserPage>
    <template #title>
      <i class="bi-calendar2-week"/>Termine
    </template>
    <EventCalendar :events="events" v-model:date="date" />
  </UserPage>
</template>

<script lang="ts" setup>
import UserPage from '../layout/UserPage.vue'
import EventCalendar from '../components/EventCalendar.vue'
import { useEvents } from '@/stores/events'
import { computed, ref, watch } from 'vue'

const eventStore = useEvents()

const events = computed(() => eventStore.events)

const date = ref(new Date())
watch(date, (val) => {
  eventStore.setSubscribingMonth(val)
})
</script>
