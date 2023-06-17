<template>
  <Page>
    <template #btns>
      <Btn
        v-if="event"
        aria-label="Bearbeiten"
        :to="{
          name: 'events-edit',
          params: { id: event.id }
        }"
      >
        <i class="bi-pencil-square" />
      </Btn>
    </template>

    <CenteredCard>
      <template #icon>
        <template v-if="multipleDays">
          <i class="bi-calendar2-week" />
        </template>
        <template v-else>
          <i class="bi-calendar2-event" />
        </template>
      </template>
      <template #title>
        <EventColor :color="event?.color ?? 'gray'" />
        {{ event?.name || 'Unbenannter Termin' }}
      </template>
      <template v-if="dateString">
        <template v-if="dateString.split('-').length > 1">
          <span class="event-date">
            <span>{{ dateString.split('-')[0] }} -&nbsp;</span>
            <span v-if="dateString.split('-').length > 1">{{ dateString.split('-')[1] }}</span>
          </span>
        </template>
        <template v-else>
          {{ dateString }}
        </template>
      </template>
    </CenteredCard>

    <Spinner v-if="!event" />

    <SettingsList v-else>
      <SettingsListOption>
        <i class="bi-card-text" />Beschreibung
        <template #desc>
          <template v-if="event?.description">
            <span class="prewrap user-select">
              {{ event?.description }}
            </span>
          </template>
          <template v-else>
            <i>Keine Beschreibung</i>
          </template>
        </template>
      </SettingsListOption>

      <!-- <SettingsListOption>
        <i class="bi-people" />Zuständige
        <template #desc>
          <span
            v-for="(user, i) in neededUsers"
            :key="user.username"
            :title="user.username"
          >
            <UsernameDisplay :user="user" />
            <template v-if="i !== neededUsers.length - 1"> • </template>
          </span>
          <template v-if="neededUsers.length === 0">
            <i>Keine Zuständigen</i>
          </template>
        </template>
      </SettingsListOption>

      <SettingsListOption>
        <i class="bi-box" />Benötigtes Equipment
        <template #desc>
          <span
            v-for="(equipment, i) in neededEquipment"
            :key="equipment"
            :title="equipment"
          >
            {{ equipment }}
            <template v-if="i !== neededEquipment.length - 1"> • </template>
          </span>
          <template v-if="neededEquipment.length === 0">
            <i>Kein Equipment benötigt</i>
          </template>
        </template>
      </SettingsListOption> -->

      <SettingsListDivider>
        Aktionen
      </SettingsListDivider>

      <!-- <SettingsListLink isButton>
        <i class="bi-person-plus" />Zuständige
        <template v-if="neededUsers.length > 0">
          ändern
        </template>
        <template v-else>
          hinzufügen
        </template>
      </SettingsListLink>

      <SettingsListLink isButton>
        <i class="bi-box" />Benötigtes Equipment
        <template v-if="neededUsers.length > 0">
          ändern
        </template>
        <template v-else>
          hinzufügen
        </template>
      </SettingsListLink>

      <SettingsListDivider  /> -->

      <SettingsListLink :to="{ name: 'events-edit', params: { id: event.id } }">
        <i class="bi-pencil-square" />Bearbeiten
      </SettingsListLink>

      <SettingsListLink :to="{ name: 'events-history', params: { id: event.id } }">
        <i class="bi-clock-history" />Verlauf
      </SettingsListLink>

      <SettingsListDivider />

      <SettingsListLink
        v-if="!event.hidden"
        isButton
        danger
        :arrow="false"
        @click="showArchiveSheet = true"
      >
        <i class="bi-archive" />Archivieren
      </SettingsListLink>
      <template v-else>
        <SettingsListLink
          isButton
          :arrow="false"
          @click="recover"
        >
          <i class="bi-arrow-clockwise" />Wiederherstellen
        </SettingsListLink>
        <SettingsListLink
          isButton
          danger
          :arrow="false"
          @click="showDeleteSheet = true"
        >
          <i class="bi-trash" />Löschen
        </SettingsListLink>
      </template>
    </SettingsList>

    <ActionSheet v-model:show="showArchiveSheet">
      <template #title>
        <i class="bi-archive" />Termin Archivieren
      </template>

      Möchtest du diesen Termin wirklich archivieren?<br>
      Du kannst ihn jederzeit wiederherstellen.

      <template #buttons>
        <ActionSheetButton danger @click="archive">
          <i class="bi-archive" /> Archivieren
        </ActionSheetButton>
        <ActionSheetDivider />
        <ActionSheetButton>
          <i class="bi-x-lg" /> Abbrechen
        </ActionSheetButton>
      </template>
    </ActionSheet>

    <ActionSheet v-model:show="showDeleteSheet">
      <template #title>
        <i class="bi-trash" />Termin Löschen
      </template>

      Möchtest du diesen Termin wirklich löschen?<br>
      Dieser Vorgang kann nicht rückgängig gemacht werden.

      <template #buttons>
        <ActionSheetButton danger @click="deleteEvent">
          <i class="bi-trash" /> Löschen
        </ActionSheetButton>
        <ActionSheetDivider />
        <ActionSheetButton>
          <i class="bi-x-lg" /> Abbrechen
        </ActionSheetButton>
      </template>
    </ActionSheet>
  </Page>
</template>

<script lang="ts" setup>
import SettingsList from '@/components/SettingsList.vue'
import { useEvents } from '@/stores/events'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import Event from '@/model/event'
import SettingsListOption from '@/components/SettingsListOption.vue'
import SettingsListDivider from '@/components/SettingsListDivider.vue'
import SettingsListLink from '@/components/SettingsListLink.vue'
import CenteredCard from '@/components/CenteredCard.vue'
import ActionSheet from '@/components/ActionSheet.vue'
import ActionSheetButton from '@/components/ActionSheetButton.vue'
import ActionSheetDivider from '@/components/ActionSheetDivider.vue'
import { back } from '@/router'
import EventColor from '@/components/EventColor.vue'
import { useToast } from '@/utilities/toast'

const route = useRoute()
// const users = useUsers()

const eventStore = useEvents()

const event = ref<Event>()
;(async () => {
  event.value = await eventStore.getById(route.params.id as string)
})()

const wholeDay = computed(() => event.value?.wholeDay)
const multipleDays = computed(() => {
  if (!event.value) return

  const start = new Date(event.value.startDate)
  const end = new Date(event.value.endDate)

  return start.getDate() !== end.getDate() ||
    start.getMonth() !== end.getMonth() ||
    start.getFullYear() !== end.getFullYear()
})

const dateString = computed(() => {
  if (!event.value) return

  const start = new Date(event.value.startDate)
  const end = new Date(event.value.endDate)

  let str = ''

  const sameDay = start.getDate() === end.getDate() && start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()
  const sameYear = start.getFullYear() === end.getFullYear()
  const showYear = start.getFullYear() !== new Date().getFullYear()

  str += start.toLocaleString('de', { weekday: 'long' }) + ', '
  str += start.toLocaleString('de', { day: '2-digit' }) + '. '
  str += start.toLocaleString('de', { month: 'long' })
  if (showYear) str += ' ' + start.toLocaleString('de', { year: 'numeric' })
  if (!wholeDay.value) str += ' um ' + start.toLocaleString('de', { hour: '2-digit', minute: '2-digit' })

  if (!sameDay || !wholeDay.value) {
    str += ' - '
    if (!sameDay) {
      str += end.toLocaleString('de', { weekday: 'long' }) + ', '
      str += end.toLocaleString('de', { day: '2-digit' }) + '. '
      str += end.toLocaleString('de', { month: 'long' })
      if (!sameYear) str += ' ' + end.toLocaleString('de', { year: 'numeric' })
    }
    if (!wholeDay.value) {
      if (!sameDay) str += ' um '
      str += end.toLocaleString('de', { hour: '2-digit', minute: '2-digit' })
    }
  }

  return str
})

// const neededUsers = computed(() => {
//   return event.value?.neededUsers?.map(username => users.getUserByUsername(username)) ?? []
// })

// const neededEquipment = computed(() => {
//   return event.value?.neededEquipment ?? []
// })

const toast = useToast()

const showArchiveSheet = ref(false)
function archive () {
  if (!event.value) return

  event.value.setHidden(true)
  toast.show('Termin archiviert')
  back()
}
async function recover () {
  if (!event.value) return

  await event.value.setHidden(false)
  toast.show('Termin wiederhergestellt')
}
const showDeleteSheet = ref(false)
async function deleteEvent () {
  if (!event.value?.id) return

  await eventStore.delete(event.value.id)
  toast.show('Termin gelöscht')
  back()
}
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.event-date {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  text-align: center;
}

.event-color {
  font-size: 1.3rem;
}
</style>
