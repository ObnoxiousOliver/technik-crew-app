<template>
  <Page>
    <template #title>
      Neuer Termin
    </template>

    <template #btns>
      <!-- Reset -->
      <Btn @click="showResetSheet = true" aria-label="Zurücksetzen">
        <i class="bi-arrow-counterclockwise" />
      </Btn>
    </template>

    <EventEditForm ref="form" v-model:event="event" @submit="submit" />

    <ActionSheet v-model:show="showResetSheet">
      <template #title>
        Zurücksetzen
      </template>

      Möchtest du wirklich alle Eingaben zurücksetzen?

      <template #buttons>
        <ActionSheetButton @click="reset">
          <i class="bi-arrow-counterclockwise" /> Zurücksetzen
        </ActionSheetButton>
        <ActionSheetButton>
          <i class="bi-x-lg" /> Abbrechen
        </ActionSheetButton>
      </template>
    </ActionSheet>

    <!-- {{neededUsers}}
    <RouterLink
      @click="temp.setData('events-add-select-users', neededUsers)"
      :to="{ name: 'events-add-select-users' }">
      Benutzer
    </RouterLink> -->
  </Page>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue'
import { useEvents } from '@/stores/events'
import ActionSheet from '@/components/ActionSheet.vue'
import ActionSheetButton from '@/components/ActionSheetButton.vue'
import EventEditForm from '@/components/EventEditForm.vue'
import { EventDB } from '@/model/event'
import { back } from '@/router'
import { useTemp } from '@/stores/temp'

const events = useEvents()

const event = ref<Partial<EventDB>>({})
const temp = useTemp()

const form = ref<typeof EventEditForm | null>(null)

// Save state in local storage to restore it on reload
watch(event, () => {
  temp.setData('event_add_state', {
    name: event.value.name,
    color: event.value.color,
    description: event.value.description,
    startDate: event.value.startDate,
    endDate: event.value.endDate,
    wholeDay: event.value.wholeDay
  } as Partial<EventDB>)
})
const state = temp.getData('event_add_state', false) as Partial<EventDB> | undefined
if (state) {
  event.value = {
    name: state.name,
    color: state.color,
    description: state.description,
    wholeDay: state.wholeDay,
    startDate: state.startDate,
    endDate: state.endDate,
    hidden: false,
    months: [],
    neededEquipment: [],
    neededUsers: []
  }
}

// Reset
const showResetSheet = ref(false)
function reset () {
  event.value = {}
  nextTick(() => {
    form.value?.updateForm()
  })
}

function submit () {
  if (!event.value) return
  events.create(event.value)

  temp.deleteData('event_add_state')

  back()
}
</script>
