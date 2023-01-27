<template>
  <UserPage>
    <template #title>
      <i class="bi-house-door"/>Dashboard
    </template>

    <EventCalendar :events="events">
      <template #btns>
        <Btn @click="refresh">
          <i class="bi-arrow-counterclockwise"/>
        </Btn>
      </template>
    </EventCalendar>
  </UserPage>
</template>

<script lang="ts" setup>
import Event from '@/model/event'
import { onMounted, ref } from 'vue'
import EventCalendar from '../components/EventCalendar.vue'
import UserPage from '../layout/UserPage.vue'

const events = ref<Event[]>([])

onMounted(async () => {
  events.value = await Event.get()
})

async function refresh () {
  events.value = await Event.get()
}
</script>
