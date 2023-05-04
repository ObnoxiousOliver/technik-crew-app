<template>
  <Page>
    <template #title>
      <i class="bi-person-badge" />Benutzer verwalten
    </template>

    <!-- List of Users -->
    <Spinner v-if="!users.length" />
    <UserBadgeBtn
      v-for="user in users"
      :key="user.username"
      :user="user"
      @click="router.push('/admin/users/' + user.username)"
    />
  </Page>
</template>

<script lang="ts" setup>
import UserBadgeBtn from '@/components/UserBadgeBtn.vue'
import { User } from '@/model/user'
import { collection, getDocs, getFirestore, query } from '@firebase/firestore'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const db = getFirestore()
const router = useRouter()

const users = ref<User[]>([])

async function updateUsers () {
  const querySnapshot = await getDocs(query(collection(db, 'users')))
  users.value = querySnapshot.docs
    .map((doc) => new User(doc.data()))
    .sort((a, b) => {
      if (a.is_admin && !b.is_admin) return -1
      return a.lastname.localeCompare(b.lastname)
    })
}

onMounted(() => {
  updateUsers()
})
</script>
