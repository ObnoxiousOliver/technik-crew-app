<template>
  <Page>
    <template #title>
      Benutzer verwalten
    </template>

    <!-- List of Users -->
    <ul>
      <li v-for="user in users" :key="user.username">
        <RouterLink :to="'/admin/users/' + user.username">
          <Username :user="user" :full="true" /> ({{ user.username }})
        </RouterLink>
      </li>
    </ul>
  </Page>
</template>

<script lang="ts" setup>
import { User } from '@/model/user'
import { collection, getDocs, getFirestore, query } from '@firebase/firestore'
import { onMounted, ref } from 'vue'

const db = getFirestore()

const users = ref<User[]>([])

async function updateUsers () {
  const querySnapshot = await getDocs(query(collection(db, 'users')))
  users.value = querySnapshot.docs.map((doc) => new User(doc.data()))
}

onMounted(() => {
  updateUsers()
})
</script>
