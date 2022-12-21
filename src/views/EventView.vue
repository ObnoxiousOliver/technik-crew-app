<template>
  <UserPage>
    <template #title>
      <i class="bi-calendar-week"/>Termine
    </template>
    <EventCalendar :events="events" @needUpdate="updateEvents">
      <template #btns>
        <Btn @click="updateEvents" aria-label="Aktualisieren">
          <i class="bi-arrow-clockwise"></i>
        </Btn>
      </template>
    </EventCalendar>
    <!-- {{ events }} -->

    <RouterLink to="/events/new">Add</RouterLink>

    <!-- <button @click="addEvent">Add</button> -->
  </UserPage>
</template>

<script lang="ts" setup>
import UserPage from '../layout/UserPage.vue'
import EventCalendar from '../components/EventCalendar.vue'
import { collection, getDocs, getFirestore, query, where } from '@firebase/firestore'
import { onMounted, ref } from 'vue'
import { EventDB } from '@/model/event'

const db = getFirestore()

const events = ref([] as EventDB[])

onMounted(() => {
  updateEvents()
})

async function updateEvents () {
  const querySnapshot = await getDocs(query(collection(db, 'events'), where('startDate', '>', 0)))

  events.value = []

  querySnapshot.forEach(doc => {
    events.value.push(doc.data() as EventDB)
  })
}
</script>
