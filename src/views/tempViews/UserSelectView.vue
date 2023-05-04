<template>
  <Page>
    <template #title>
      <i class="bi-person" /> Benutzer auswählen
    </template>

    <template #btns>
      <Btn @click="setData">
        <i class="bi-check-lg" />
      </Btn>
    </template>

    <SettingsList>
      <SettingsListLink
        isButton
        v-for="user in users.users"
        :key="user.username"
        :arrow="false"
        @click="selectedUsers[user.username] = !selectedUsers[user.username] ?? true"
      >
        <input type="checkbox" v-model="selectedUsers[user.username]">
        <Username :user="user" />
      </SettingsListLink>
    </SettingsList>

    {{ selectedUsers }}
  </Page>
</template>

<script lang="ts" setup>
import SettingsList from '@/components/SettingsList.vue'
import SettingsListLink from '@/components/SettingsListLink.vue'
import { useTemp } from '@/stores/temp'
import { useUsers } from '@/stores/users'
import { ref } from 'vue'

const users = useUsers()
const temp = useTemp()

const selectedUsers = ref({})
;(temp.getDataFromTempRoute() ?? []).forEach((user: string) => {
  selectedUsers.value[user] = true
})

function setData () {
  temp.setDataFromTempRoute(
    Object.keys(selectedUsers.value).filter((user) => selectedUsers.value[user])
  )
}
</script>
