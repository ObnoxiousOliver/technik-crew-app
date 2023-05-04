<template>
  <Page>
    <template #title>
      <i class="bi-ticket-perforated" />Tickets
    </template>

    <template #btns>
      <Btn :to="{ name: 'ticket-create' }">
        <i class="bi-plus-lg" />
      </Btn>
    </template>

    <TicketBtn
      v-for="[id, ticket] in sortedTickets"
      :key="id"
      @click="showTicketId = id"
      :ticket="ticket"
      :code="id"
    />
    <SettingsList v-if="!fetching">
      <SettingsListDivider>
        Eingelöste Tickets
      </SettingsListDivider>
    </SettingsList>
    <TicketBtn
      v-for="[id, ticket] in sortedInvalidTickets"
      :key="id"
      @click="showTicketId = id"
      :ticket="ticket"
      :code="id"
    />

    <Spinner v-if="fetching" />

    <ActionSheet v-model:show="showTicketSheet">
      <template #title>
        {{ showTicketId }} ({{ showTicket?.username }})
      </template>

      <div v-if="showTicket?.invalid">
        Dieses Ticket wurde bereits eingelöst.
      </div>
      <table v-else class="table">
        <tbody>
          <tr>
            <td>Username</td>
            <td>{{ showTicket?.username }}</td>
          </tr>
          <tr>
            <td>Vorname</td>
            <td>{{ showTicket?.firstname }}</td>
          </tr>
          <tr>
            <td>Nachname</td>
            <td>{{ showTicket?.lastname }}</td>
          </tr>
          <tr>
            <td>Geschlecht</td>
            <td>
              {{ {
                'male': 'männlich',
                'female': 'weiblich',
                'non-binary': 'divers'
              }[showTicket?.gender ?? 'non-binary'] }}
            </td>
          </tr>
          <tr>
            <td>Nur Nachname anzeigen</td>
            <td>{{ showTicket?.prefer_lastname ? 'Ja' : 'Nein' }}</td>
          </tr>
          <tr>
            <td>Anzeigename</td>
            <td><Username :user="showTicket" /></td>
          </tr>
        </tbody>
      </table>

      <template #buttons>
        <ActionSheetButton v-if="!showTicket?.invalid" @click="_invalidateTicket">
          <i class="bi-file-x" />Ticket entwerten
        </ActionSheetButton>
        <ActionSheetButton class="danger" @click="_deleteTicket">
          <i class="bi-trash" />Ticket löschen
        </ActionSheetButton>
      </template>
    </ActionSheet>
  </Page>
</template>

<script lang="ts" setup>
import TicketBtn from '@/components/TicketBtn.vue'
import SettingsList from '@/components/SettingsList.vue'
import SettingsListDivider from '@/components/SettingsListDivider.vue'
import { TicketDB } from '@/model/ticket'
import { encryptTicket, invalidateTicket } from '@/utilities/auth'
import { collection, deleteDoc, doc, getDocs, getFirestore } from '@firebase/firestore'
import { computed, onMounted, ref } from 'vue'

const db = getFirestore()
const tickets = ref({} as { [key: string]: TicketDB })
const sortedTickets = computed(() => {
  return Object.entries(tickets.value).sort((a, b) => {
    return a[1].username.localeCompare(b[1].username)
  })
})
const invalidTickets = ref({} as { [key: string]: TicketDB })
const sortedInvalidTickets = computed(() => {
  return Object.entries(invalidTickets.value).sort((a, b) => {
    return a[1].username.localeCompare(b[1].username)
  })
})

const showTicketId = ref<string>()
const showTicketSheet = computed({
  get () {
    return showTicketId.value !== undefined
  },
  set (val) {
    if (!val) {
      showTicketId.value = undefined
    }
  }
})
const showTicket = computed(() => {
  if (!showTicketId.value) return
  return { ...(tickets.value), ...invalidTickets.value }[showTicketId.value]
})

function _invalidateTicket () {
  if (!showTicketId.value) return
  if (!showTicket.value) return
  invalidateTicket(showTicketId.value, showTicket.value.username)
  showTicketId.value = undefined
  updateTickets()
}

async function _deleteTicket () {
  if (!showTicketId.value) return
  await deleteDoc(doc(db, 'tickets', encryptTicket(showTicketId.value)))
  showTicketId.value = undefined
  await updateTickets()
}

const fetching = ref(true)
onMounted(async () => {
  await updateTickets()
  fetching.value = false
})

async function updateTickets () {
  const snapshot = await getDocs(collection(db, 'tickets'))

  tickets.value = {}
  invalidTickets.value = {}

  snapshot.forEach((doc) => {
    if (doc.data().invalid) {
      invalidTickets.value[atob(doc.id)] = doc.data() as TicketDB
    } else {
      tickets.value[atob(doc.id)] = doc.data() as TicketDB
    }
  })
}
</script>
