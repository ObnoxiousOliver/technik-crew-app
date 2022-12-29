<template>
  <Page>
    <template #title>
      <Username :user="user" :full="true" />
    </template>
    <table class="table">
      <tr>
        <td>Benutzername</td>
        <td>{{ user?.username }}</td>
      </tr>
      <tr>
        <td>E-Mail</td>
        <td>{{ email }}</td>
      </tr>
    </table>

    <Btn>Benutzerdaten löschen</Btn>
    <p>
      Es wird nicht der Benutzer gelöscht, sondern nur die Daten, die mit dem Benutzer verknüpft sind.<br>
      Der Benutzer muss im serverseitigen Authentifizierungssystem gelöscht werden.<br>
      Der Benutzer kann sich nicht mehr einloggen.
    </p>
  </Page>
</template>

<script lang="ts" setup>
import { User } from '@/model/user'
import { collection, getDocs, getFirestore, query, where } from '@firebase/firestore'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const db = getFirestore()
const route = useRoute()

const user = ref<User>()
const email = ref<string>()
watch(user, async (user) => {
  email.value = await user?.getEmail()
})

async function updateUser () {
  user.value = new User((await getDocs(
    query(
      collection(db, 'users'),
      where('username', '==', route.params.username)
    )
  )).docs[0].data())
}

onMounted(() => {
  updateUser()
})
</script>
