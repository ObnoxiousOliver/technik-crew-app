<template>
  <Page>
    <template #title>
      <i class="bi-code-slash" />Entwickler Einstellungen
    </template>

    <InfoCard>
      <template #title>
        <i class="bi-info-circle" />Entwicklermodus
      </template>
      <template #desc>
        Entwicklermodus ist nur für Entwickler gedacht.
        Wenn du nicht weißt, was du hier suchst, solltest
        du den Entwicklermodus deaktivieren.
      </template>
    </InfoCard>

    <SettingsList>
      <SettingsListOption for="toggleDevMode">
        <i class="bi-code-slash" />Entwicklermodus
        <template #input>
          <Toggle id="toggleDevMode" v-model="devModeEnabled" />
        </template>
      </SettingsListOption>
    </SettingsList>

    <ActionSheet v-model:show="showConfirmDevModeDisable">
      <template #title>
        Entwicklermodus deaktivieren?
      </template>

      Wenn du den Entwicklermodus deaktivierst,
      werden alle Entwicklerfunktionen deaktiviert.
      Du kannst den Entwicklermodus jederzeit wieder
      aktivieren, indem du 10 mal auf die App-Version
      klickst.

      <template #buttons>
        <ActionSheetButton danger @click="devMode.set(false)">
          <i class="bi-box-arrow-left" />Entwicklermodus deaktivieren
        </ActionSheetButton>
        <ActionSheetDivider />
        <ActionSheetButton>
          <i class="bi-x-lg" />Abbrechen
        </ActionSheetButton>
      </template>
    </ActionSheet>
  </Page>
</template>

<script setup lang="ts">
import { back } from '@/router'
import { useDevMode } from '@/utilities/developer'
import { ref, toRef, watch } from 'vue'
import SettingsList from '@/components/SettingsList.vue'
import SettingsListOption from '@/components/SettingsListOption.vue'

const devMode = useDevMode()
watch(toRef(devMode, 'enabled'), (enabled) => {
  if (!enabled) {
    back()
  }
})

const devModeEnabled = ref(devMode.enabled)
const showConfirmDevModeDisable = ref(false)
watch(devModeEnabled, (enabled) => {
  devModeEnabled.value = true
  if (!enabled) {
    showConfirmDevModeDisable.value = true
  }
})
</script>
