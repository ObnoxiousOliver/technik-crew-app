<template>
  <Page>
    <template #title>
      <i class="bi-gear" />Einstellungen
    </template>

    <SettingsList>
      <SettingsListLink to="/settings/profile">
        <i class="bi-person" />Mein Profil
      </SettingsListLink>

      <SettingsListDivider v-if="manageTickets || manageUsers">
        Admin
      </SettingsListDivider>

      <SettingsListLink to="/admin/tickets" v-if="manageTickets">
        <i class="bi-ticket-perforated" />Tickets
      </SettingsListLink>
      <SettingsListLink to="/admin/users" v-if="manageUsers">
        <i class="bi-person-badge" />Benutzer verwalten
      </SettingsListLink>

      <SettingsListDivider />

      <SettingsListLink
        :arrow="false"
        isButton
        danger
        @click="logout"
      >
        <i class="bi-box-arrow-left" />Abmelden
      </SettingsListLink>
    </SettingsList>
  </Page>
</template>

<script lang="ts" setup>
import { useUser } from '@/stores/user'
import { signOut } from '@/utilities/auth'
import { useRouter } from 'vue-router'
import SettingsList from '../../components/SettingsList.vue'
import SettingsListLink from '../../components/SettingsListLink.vue'
import SettingsListOption from '../../components/SettingsListOption.vue'
import SettingsListDivider from '../../components/SettingsListDivider.vue'
import { computed } from 'vue'
import { Permission } from '@/model/permissions'

const router = useRouter()
const user = useUser()
const manageTickets = computed(() => user.permissions[Permission.IsAdmin] || user.permissions[Permission.ManageTickets])
const manageUsers = computed(() => user.permissions[Permission.IsAdmin] || user.permissions[Permission.ManageUsers])

async function logout () {
  try {
    router.push('/login')
    await signOut()
  } catch (e) {
    console.error(e)
  }
}
</script>
