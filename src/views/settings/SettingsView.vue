<template>
  <Page>
    <template #title>
      <i class="bi-gear" />Einstellungen
    </template>

    <Btn transparent class="settings__version" @click="versionClick">
      App Version: {{ version }}
    </Btn>

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

      <SettingsListDivider>
        Info
      </SettingsListDivider>

      <SettingsListLink
        :arrow="'link'"
        :to="{ name: 'help' }"
      >
        <i class="bi-question-lg" />Hilfe und Support
      </SettingsListLink>

      <SettingsListLink
        :arrow="'link'"
        :to="{
          name: 'help-admins',
          query: {
            back: router.currentRoute.value.fullPath
          }
        }"
      >
        <i class="bi-person-gear" />Wer sind die Admins?
      </SettingsListLink>

      <template v-if="devMode.enabled">
        <SettingsListDivider />

        <SettingsListLink :to="{ name: 'dev-settings'} ">
          <i class="bi-code-slash" />Entwickler Einstellungen
        </SettingsListLink>
      </template>

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
import SettingsListDivider from '../../components/SettingsListDivider.vue'
import { computed } from 'vue'
import { Permission } from '@/model/permissions'
import { useDevMode } from '@/utilities/developer'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../../../package.json')

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

const devMode = useDevMode()

let clicks = 0
let timeout: number
function versionClick () {
  if (devMode.enabled) {
    clicks = 0
    return
  }

  clicks++
  if (clicks >= 10) {
    devMode.set(true)
    clicks = 0
  }
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    clicks = 0
  }, 1000)
}
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.settings {
  &__version {
    display: block;
    width: stretch;
    text-align: left;
    margin: -1.5rem -1.5rem .5rem;
    border-radius: 0;
    padding: .5rem 1.5rem;
    font-size: 0.8rem;
    font-weight: normal;
    color: r.$text-secondary;
  }
}
</style>
