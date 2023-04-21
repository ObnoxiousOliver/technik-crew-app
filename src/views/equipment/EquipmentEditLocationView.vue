<template>
  <Page opaqueTitlebar>
    <template #title>
      <i class="bi-geo-alt" />Standort ändern
    </template>

    <p v-if="equipment?.group">
      <i class="bi-info-circle" /> Das Equipment gehört einer Gruppe an. Der Standort wird für alle
      Equipmentteile der Gruppe gesetzt.
    </p>

    <LocationsList :locations="locStore.locations" search hasNoLocationOption @click="(loc) => {
      equipment?.setLocation(loc?.id ?? null)
      back()
    }" />
  </Page>
</template>

<script lang="ts" setup>
import LocationsList from '@/components/LocationsList.vue'
import { useEquipment } from '@/stores/equipment'
import { useLocations } from '@/stores/locations'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { back } from '@/router'

const route = useRoute()

const eqStore = useEquipment()
const locStore = useLocations()

const equipment = computed(() => eqStore.findByID(route.params.id))
document.title = (equipment.value?.name ?? 'Equipment') + ' - Standort ändern'
</script>
