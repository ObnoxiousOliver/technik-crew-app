<template>
  <Page>
    <template #title>
      Neuer Termin
    </template>
    Name: <input v-model="title" type="text"><br>
    Start: <input v-model="startDate" type="date"><br>
    End: <input v-model="endDate" type="date"><br>
    Whole Day: <input v-model="wholeDay" type="checkbox"><br>
    Desc:<br><textarea v-model="desc" /><br>
    <button @click="submit">Add</button>
  </Page>
</template>

<script lang="ts" setup>
import Event from '@/model/event'
import { addDoc, collection, getFirestore } from '@firebase/firestore'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNewEventStore } from '../stores/newEvent'

const db = getFirestore()
const router = useRouter()
const store = useNewEventStore()

async function submit () {
  await addDoc(collection(db, 'events'), new Event({
    name: title.value,
    description: desc.value,
    startDate: new Date(startDate.value).getTime(),
    endDate: startDate.value === endDate.value ? null : new Date(endDate.value).getTime(),
    wholeDay: wholeDay.value
  }).toDB())

  router.push('/events')
  store.reset()
}

const title = computed({
  get: () => store.title,
  set: (val) => {
    store.title = val
  }
})
const startDate = computed({
  get: () => store.startDate,
  set: (val) => {
    store.startDate = val
  }
})
const endDate = computed({
  get: () => store.endDate,
  set: (val) => {
    store.endDate = val
  }
})
const wholeDay = computed({
  get: () => store.wholeDay,
  set: (val) => {
    store.wholeDay = val
  }
})
const desc = computed({
  get: () => store.desc,
  set: (val) => {
    store.desc = val
  }
})
</script>
