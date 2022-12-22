<template>
  <Page>
    <template #title>
      <i class="bi-gear" />Einstellungen
    </template>

    <SettingsList>
      <SettingsListItem to="/settings/profile">Profil</SettingsListItem>
      <SettingsListItem to="/reset-password">Passwort zurücksetzen</SettingsListItem>
      <SettingsListItem
        :arrow="false"
        isButton
        danger
        @click="logout"
      >
        Abmelden
      </SettingsListItem>
    </SettingsList>
  </Page>
</template>

<script lang="ts" setup>
import { getAuth, signOut } from '@firebase/auth'
import { useRouter } from 'vue-router'
import SettingsList from '../../components/SettingsList.vue'
import SettingsListItem from '../../components/SettingsListItem.vue'

const auth = getAuth()
const router = useRouter()

async function logout () {
  try {
    await signOut(auth)
    router.push('/login')
  } catch (e) {
    console.error(e)
  }
}
</script>
