<template>
  <SettingsList>
    <SettingsListLink
      v-for="location in locations"
      :key="location.id"
      :isButton="dontRedirect"
      :to="{
        name: 'location-details',
        params: {
          id: location.id
        }
      }"
    >
      {{ location.name }}
    </SettingsListLink>
  </SettingsList>
</template>

<script lang="ts" setup>
import SettingsList from '@/components/SettingsList.vue'
import SettingsListLink from '@/components/SettingsListLink.vue'

defineProps<{
  locations: Location[],
  dontRedirect?: boolean
}>()
</script>
