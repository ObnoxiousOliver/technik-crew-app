<template>
  <Page>
    <template #title>
      Einstellungen
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
import SettingsList from '../components/SettingsList.vue'
import SettingsListItem from '../components/SettingsListItem.vue'

function logout () {
  // TODO: Implement logout functionality
}
</script>
