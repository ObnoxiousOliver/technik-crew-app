<template>
  <UserPage
    add-btn
    search
    :add-btn-to="{
      name: 'inventory-create'
    }"
  >
    <template #title>
      <i class="bi-box-seam" />Inventar
    </template>

    <template #btns>
      <!-- <template v-if="selectionMode">
        <Btn @click="showArchiveSheet = true" aria-label="Archivieren">
          <i class="bi-archive" />
        </Btn>
        <Btn
          @click="selectionMode = false"
          aria-label="Selektion abbrechen"
        >
          <i class="bi-x-lg" />
        </Btn>
      </template>
      <template v-else>
        <Btn aria-label="Filter">
          <i class="bi-funnel" />
        </Btn>
      </template> -->
    </template>

    <!-- <SettingsList>
      <SettingsListOption v-if="selectionMode" for="selectAll">
        <template #desc>
          {{ Object.values(selected).filter(x=>x).length }} ausgewählt
        </template>

        <template #input>
          <InputCheckbox id="selectAll" v-model="allSelected" />
        </template>
      </SettingsListOption>
      <SettingsListOption v-else>
        <template #desc>
          {{ inventory.collections.length }} Sammlungen
        </template>
      </SettingsListOption>
    </SettingsList> -->

    <InfoCard danger>
      <template #title>
        <i class="bi-exclamation-triangle" />
        Experimentell
      </template>

      <template #desc>
        Diese Seite ist noch nicht fertig und wird noch überarbeitet.
      </template>
    </InfoCard>

    <CollectionList
      :collections="(inventory.collections as Collection[])"
    />
    <!-- v-model:selectionMode="selectionMode"
      v-model:selected="selected" -->

    <!-- <ActionSheet v-model:show="showArchiveSheet">
      <template #title>
        <i class="bi-archive" /> Archivieren
      </template>

      Ausgewählte Sammlungen:
      <br>
      <br>
      <ul class="bullet-list">
        <li
          v-for="id in Object.keys(selected).filter(x => selected[x])"
          :key="id"
        >
          {{ inventory.collections.find(x => x.id === id)?.icon }}
          {{ inventory.collections.find(x => x.id === id)?.name }}
        </li>
      </ul>
      <br>
      Willst du die ausgewählten Sammlungen wirklich archivieren?<br>
      <br>
      Du kannst sie später wiederherstellen.

      <template #buttons>
        <ActionSheetButton danger @click="archive">
          <i class="bi-archive" /> Archivieren
        </ActionSheetButton>
        <ActionSheetDivider />
        <ActionSheetButton>
          <i class="bi-x-lg" /> Abbrechen
        </ActionSheetButton>
      </template>
    </ActionSheet> -->
  </UserPage>
</template>

<script setup lang="ts">
import CollectionList from '@/components/CollectionList.vue'
import InfoCard from '@/components/InfoCard.vue'
import UserPage from '@/layout/UserPage.vue'
import { Collection } from '@/model/inventory/collection'
import { useInventory } from '@/stores/inventory'

const inventory = useInventory()

// const selectionMode = ref(false)
// const selected = ref<Record<string, boolean>>({})

// const allSelected = computed({
//   get: () => inventory.collections.every(x => x.id && (selected.value[x.id] ?? false)),
//   set: (v) => inventory.collections.forEach(x => x.id && (selected.value[x.id] = v))
// })
</script>
