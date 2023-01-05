<template>
  <Page>
    <template #title>
      <i class="bi-person" />Profil
    </template>

    <UserBadge :user="userStore.user" :email="email" />

    <SettingsList>
      <SettingsListOption for="preferLastname">
        Nur Nachname anzeigen
        <template #desc>
          Dein Anzeigename: <Username :user="userStore.user" />
        </template>
        <template #input>
          <Toggle id="preferLastname" v-model="preferLastname" />
        </template>
      </SettingsListOption>
      <SettingsListDivider />
      <SettingsListLink to="/settings/profile/edit">
        <i class="bi-pen" />Profil bearbeiten
      </SettingsListLink>
      <SettingsListLink to="/settings/profile/email">
        <i class="bi-at" /> E-Mail Adresse ändern
      </SettingsListLink>
      <SettingsListLink to="/reset-password">
        <i class="bi-key" />Passwort ändern
      </SettingsListLink>
    </SettingsList>
  </Page>
</template>

<script lang="ts" setup>
import SettingsList from '@/components/SettingsList.vue'
import SettingsListLink from '@/components/SettingsListLink.vue'
import SettingsListOption from '@/components/SettingsListOption.vue'
import SettingsListDivider from '@/components/SettingsListDivider.vue'
import UserBadge from '@/components/UserBadge.vue'
import { useUser } from '@/stores/user'
import { ref, watch } from 'vue'
import { getAuth } from '@firebase/auth'

const userStore = useUser()
const email = ref(getAuth().currentUser?.email)

const preferLastname = ref(false)
watch(preferLastname, async (newValue) => {
  if (!userStore.user) return

  userStore.user.prefer_lastname = newValue
  await userStore.user?.setUserDB()
})
</script>
