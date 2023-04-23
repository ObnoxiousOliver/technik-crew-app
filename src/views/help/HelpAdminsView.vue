<template>
  <Page>
    <template #title>
      <i class="bi-person-gear" />Wer sind die Admins?
    </template>

    <p>
      Hast du ein Problem mit der App?
      Willst du etwas vorschlagen oder kritisieren?
      Dann kannst du dich an einen der Admins wenden.
      Wir sind zwar nicht allwissende Götter,
      aber wir sind kennen uns mit der App aus
      und können dir mit machen Problemen helfen.
    </p>

    <p>
      Wende dich einfach an einen der Admins.
      Wenn du uns in der Schule siehst,
      kannst du uns gerne nerven
      oder du kannst uns auf WhatsApp
      oder Discord anschreiben.
    </p>

    <ul v-if="users.admins.length" class="admin-list">
      <li class="admin-list__item" v-for="admin in users.admins" :key="admin.username">
        <i class="bi-person" />
        <Username :user="admin" :full="true" />
      </li>
    </ul>
    <Spinner v-else />
  </Page>
</template>

<script lang="ts" setup>
import { useUsers } from '@/stores/users'

const users = useUsers()
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.admin-list {
  list-style: none;
  padding: 0;
  margin: 0;

  &__item {
    @include r.box;
    padding: 2rem 1rem;
    font-size: 1.5rem;
    font-weight: 600;

    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    gap: 0.5rem;
    margin: 1rem 0;
  }
}
</style>
