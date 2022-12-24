<template>
  <Page>
    <template #title>
      <i class="bi-ticket-perforated" />Tickets
    </template>

    <RouterLink to="/admin/tickets/create">
      Ticket erstellen
    </RouterLink>

    <ul>
      <li v-for="(ticket, id) in tickets" :key="id">
        <RouterLink :to="'/admin/tickets/' + id">
          {{ ticket.username }} ({{ id }})
        </RouterLink>
      </li>
    </ul>
    <h3>Eingelöste Tickets</h3>
    <ul>
      <li v-for="(ticket, id) in invalidTickets" :key="id">
        {{ ticket.username }} ({{ id }})
      </li>
    </ul>
  </Page>
</template>

<script lang="ts" setup>
import { TicketDB } from '@/model/ticket'
import { collection, getDocs, getFirestore } from '@firebase/firestore'
import { onMounted, ref } from 'vue'

const db = getFirestore()
const tickets = ref({} as { [key: string]: TicketDB })
const invalidTickets = ref({} as { [key: string]: TicketDB })

onMounted(async () => {
  const snapshot = await getDocs(collection(db, 'tickets'))

  snapshot.forEach((doc) => {
    if (doc.data().invalid) {
      invalidTickets.value[atob(doc.id)] = doc.data()
    } else {
      tickets.value[atob(doc.id)] = doc.data()
    }
  })
})
</script>
