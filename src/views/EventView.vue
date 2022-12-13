<template>
  <UserPage>
    <template #title>
      Termine
    </template>
    <EventCalendar :events="events" />
    <!-- {{ events }} -->

    <!-- <button @click="addEvent">Add</button> -->
  </UserPage>
</template>

<script lang="ts" setup>
import UserPage from '../layout/UserPage.vue'
import EventCalendar from '../components/EventCalendar.vue'
import { addDoc, collection, doc, getDocs, getFirestore, limit, onSnapshot, query, where } from '@firebase/firestore'
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

async function addEvent () {
  addDoc(collection(db, 'events'), {
    id: Math.random().toString(),
    name: 'New Event',
    description: 'This is a new event',
    wholeDay: true,
    startDate: new Date().getTime(),
    endDate: null
  } as EventDB)

  updateEvents()
}
</script>
