<template>
  <Page>
    <template #title>
      Ticket: {{ ticket?.username }} ({{ $route.params.code }})
    </template>

    Username: {{ ticket?.username }}<br>
    Vorname: {{ ticket?.firstname }}<br>
    Nachname: {{ ticket?.lastname }}<br>
    Geschlecht: {{ {
      'male': 'männlich',
      'female': 'weiblich',
      'non-binary': 'divers'
    }[ticket?.gender] }}<br>
    Nur Nachname anzeigen: {{ ticket?.prefer_lastname ? 'Ja' : 'Nein' }}<br>

    Anzeige name: <Username
      :firstname="ticket?.firstname"
      :lastname="ticket?.lastname"
      :gender="ticket?.gender"
      :preferLastname="ticket?.prefer_lastname"
    /><br>

    <Btn @click="invalidateTicket">Ticket entwerten</Btn>
  </Page>
</template>

<script lang="ts" setup>
import { TicketDB } from '@/model/ticket'
import { encryptTicket } from '@/utilities/auth'
import { doc, getDoc, getFirestore, setDoc } from '@firebase/firestore'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const db = getFirestore()

const ticket = ref(null as null | TicketDB)

onMounted(async () => {
  ticket.value = (await getDoc(doc(db, 'tickets', encryptTicket(route.params.code)))).data()
})

async function invalidateTicket () {
  if (!ticket.value) return

  await setDoc(doc(db, 'tickets', encryptTicket(route.params.code)), {
    username: ticket.value.username,
    invalid: true
  })
}
</script>
