<template>
  <Page>
    <template #title>
      <i class="bi-pencil-square" />Termin bearbeiten
    </template>

    <EventEditForm
      :event="event"
      v-if="event"
      @submit="submit"
      :disabled="submitting"
    />
  </Page>
</template>

<script lang="ts" setup>
import EventEditForm from '@/components/EventEditForm.vue'
import Event, { EventDB } from '@/model/event'
import { back } from '@/router'
import { useEvents } from '@/stores/events'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const eventStore = useEvents()

const event = ref<Event>()

;(async () => {
  event.value = await eventStore.getById(route.params.id as string)
})()

const submitting = ref(false)
async function submit (changes: Partial<EventDB>) {
  if (!event.value) return

  function notSame (key: keyof EventDB) {
    if (!event.value) return
    if (JSON.stringify(event.value.toDB()[key]) !== JSON.stringify(changes[key])) {
      return changes[key]
    }
  }

  submitting.value = true

  console.log(notSame('description') as number)

  await event.value.set({
    name: notSame('name') as string,
    description: notSame('description') as string,
    color: notSame('color') as string,
    startDate: notSame('startDate') as number,
    endDate: notSame('endDate') as number,
    wholeDay: notSame('wholeDay') as boolean,
    neededUsers: notSame('neededUsers') as string[],
    neededEquipment: notSame('neededEquipment') as string[]
  })

  submitting.value = false
  back()
}
</script>

<style scoped lang="scss">
</style>
