<template>
  <Page>
    <template #title>
      <i class="bi-code-slash" />Entwickler Einstellungen
    </template>

    <InfoCard>
      <template #title>
        <span class="danger">
          <i class="bi-exclamation-triangle" />Entwicklermodus
        </span>
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
        <span class="text-secondary text-small desktop-only">
          <code>STRG</code>+<code>SHIFT</code>+<code>D</code>
        </span>
        <template #input>
          <ToggleSwitch id="toggleDevMode" v-model="devModeEnabled" />
        </template>
      </SettingsListOption>

      <SettingsListDivider />

      <SettingsListOption for="forceOfflineMode">
        <i class="bi-wifi-off" />Offline Modus erzwingen
        <span class="text-secondary text-small desktop-only">
          <code>STRG</code>+<code>F9</code>
        </span>
        <template #desc>
          Im Offline Modus sind einige Funktionen deaktiviert,
          aber du kannst weiterhin geladenen Inhalt aus dem Cache sehen.
        </template>
        <template #input>
          <ToggleSwitch id="forceOfflineMode" v-model="offlineMode" />
        </template>
      </SettingsListOption>

      <SettingsListOption for="showEquipmentPage">
        <i class="bi-speaker" /> Alte Equipment Seite anzeigen
        <template #desc>
          Zeigt die alte Equipment Seite an, die vor der
          Version 1.1.0 verwendet wurde.
        </template>
        <template #input>
          <ToggleSwitch id="showEquipmentPage" v-model="showEquipmentPageFlag" />
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
        <ActionSheetButton danger @click="devMode.enabled = false">
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
import { useDev } from '@/stores/developer'
import { computed, ref, toRef, watch } from 'vue'
import SettingsList from '@/components/SettingsList.vue'
import SettingsListOption from '@/components/SettingsListOption.vue'
import SettingsListDivider from '@/components/SettingsListDivider.vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import ActionSheet from '@/components/ActionSheet.vue'
import ActionSheetButton from '@/components/ActionSheetButton.vue'
import ActionSheetDivider from '@/components/ActionSheetDivider.vue'
import InfoCard from '@/components/InfoCard.vue'

const devMode = useDev()
watch(toRef(devMode, 'enabled'), (enabled) => {
  if (!enabled) {
    back()
  }
})

const offlineMode = computed({
  get: () => devMode.flags.forceOfflineMode ?? false,
  set: (value) => {
    devMode.flags.forceOfflineMode = value
  }
})

const showEquipmentPageFlag = computed({
  get: () => devMode.flags.showEquipmentPage ?? false,
  set: (value) => {
    devMode.flags.showEquipmentPage = value
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
