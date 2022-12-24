<template>
  <Page>
    <template #title>
      Wer sind die Admins?
    </template>

    <p>
      Die Admins sind die Leute, die die App betreiben und die Regeln festlegen.
      Wenn du Fragen hast oder Probleme mit der App hast, kannst du dich an die Admins wenden.
    </p>

    <p>
      Die Admins sind:
    </p>

    <ul>
      <li v-for="admin in admins" :key="admin.username">
        <Username :user="admin" :full="true" />
      </li>
    </ul>
  </Page>
</template>

<script lang="ts" setup>
import { User } from '@/model/user'
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from '@firebase/firestore'
import { onMounted, ref } from 'vue'

const db = getFirestore()

const admins = ref([] as User[])
onMounted(async () => {
  const adminUsernames = (await getDoc(doc(db, 'users', 'admins'))).data().admins
  adminUsernames.forEach((admin: string) => {
    getDocs(query(collection(db, 'users'), where('username', '==', admin)))
      .then((querySnapshot) => {
        admins.value.push(new User(querySnapshot.docs[0].data()))
        admins.value.sort((a, b) => a.username.localeCompare(b.username))
      })
  })
})
</script>
