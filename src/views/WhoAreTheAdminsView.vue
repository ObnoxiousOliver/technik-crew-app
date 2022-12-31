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

    <ul v-if="admins.length" class="admin-list">
      <li class="admin-list-item" v-for="admin in admins" :key="admin.username">
        -=« <span><Username :user="admin" :full="true" /></span> »=-
      </li>
    </ul>
    <Spinner v-else />
  </Page>
</template>

<script lang="ts" setup>
import { User } from '@/model/user'
import { collection, getDocs, getFirestore, query, where } from '@firebase/firestore'
import { onMounted, ref } from 'vue'

const db = getFirestore()

const admins = ref([] as User[])
onMounted(async () => {
  (await getDocs(
    query(
      collection(db, 'users'),
      where('is_admin', '==', true)
    )
  )).docs.map(admin => admins.value.push(new User(admin.data())))

  admins.value.sort((a, b) => a.lastname.localeCompare(b.lastname))
})
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.admin-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.admin-list-item {
  display: flex;
  margin: 1rem 0;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: r.$text-secondary;

  span {
    color: r.$text-primary;
    text-transform: uppercase;
    font-size: 1.5rem;
  }
}
</style>
