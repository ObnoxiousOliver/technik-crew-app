<template>
  <Page>
    <template #title>
      <i class="bi-gear" />Einstellungen
    </template>

    <SettingsList>
      <SettingsListItem to="/settings/profile">
        <i class="bi-person" />Profil
      </SettingsListItem>
      <SettingsListItem to="/reset-password">
        <i class="bi-key" />Passwort zurücksetzen
      </SettingsListItem>
      <SettingsListItem to="/admin/tickets">
        <i class="bi-ticket-perforated" />Tickets</SettingsListItem>
      <SettingsListItem
        :arrow="false"
        isButton
        danger
        @click="logout"
      >
        <i class="bi-box-arrow-left" />Abmelden
      </SettingsListItem>
    </SettingsList>
  </Page>
</template>

<script lang="ts" setup>
import { signOut } from '@/utilities/auth'
import { useRouter } from 'vue-router'
import SettingsList from '../../components/SettingsList.vue'
import SettingsListItem from '../../components/SettingsListItem.vue'

const router = useRouter()

async function logout () {
  try {
    await signOut()
    router.push('/login')
  } catch (e) {
    console.error(e)
  }
}
</script>
