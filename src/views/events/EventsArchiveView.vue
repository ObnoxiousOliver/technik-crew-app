<template>
  <Page>
    <template #title>
      <i class="bi-archive" />Terminarchiv
    </template>

    <Spinner v-if="loading" />

    <ul v-else>
      <li v-for="(event, i) in (archivedEvents as Event[])" :key="event.id ?? i">
        <EventBtn :event="event" />
      </li>
    </ul>
  </Page>
</template>

<script setup lang="ts">
import EventBtn from '@/components/EventBtn.vue'
import Event from '@/model/event'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const archivedEvents = ref<Event[]>([])

const loading = ref(true)
onMounted(async () => {
  archivedEvents.value = await Event.getArchived()
  loading.value = false

  const unsubscribe = Event.subscribeArchived((change) => {
    const index = archivedEvents.value.findIndex((e) => e.id === change.doc.id)

    if (index === -1) {
      archivedEvents.value.push(new Event(change.doc.id, change.doc.data()))
      return
    }

    switch (change.type) {
      case 'added':
      case 'modified':
        archivedEvents.value[index] = new Event(change.doc.id, change.doc.data())
        break
      case 'removed':
        archivedEvents.value.splice(index, 1)
        break
    }
  })

  onBeforeUnmount(unsubscribe)
})
</script>

<style scoped lang="scss">
ul {
  list-style: none;
}
</style>
