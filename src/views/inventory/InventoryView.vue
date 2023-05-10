<template>
  <UserPage
    :add-btn="!selectionMode"
    :search="!selectionMode"
  >
    <template #title>
      <i class="bi-box-seam" /> Inventar
    </template>

    <template #btns>
      <template v-if="selectionMode">
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
      </template>
    </template>

    <SettingsList>
      <SettingsListOption for="selectAll">
        <template #desc>
          {{ Object.values(selected).filter(x=>x).length }} ausgewählt
        </template>

        <template #input>
          <InputCheckbox id="selectAll" v-model="allSelected" />
        </template>
      </SettingsListOption>
    </SettingsList>

    <CollectionList
      :collections="(inventory.collections as Collection[])"
      v-model:selectionMode="selectionMode"
      v-model:selected="selected"
    />

    <ActionSheet v-model:show="showArchiveSheet">
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
    </ActionSheet>
  </UserPage>
</template>

<script setup lang="ts">
import ActionSheet from '@/components/ActionSheet.vue'
import ActionSheetButton from '@/components/ActionSheetButton.vue'
import ActionSheetDivider from '@/components/ActionSheetDivider.vue'
import CollectionList from '@/components/CollectionList.vue'
import InputCheckbox from '@/components/InputCheckbox.vue'
import SettingsList from '@/components/SettingsList.vue'
import SettingsListOption from '@/components/SettingsListOption.vue'
import UserPage from '@/layout/UserPage.vue'
import { Collection } from '@/model/inventory/collection'
import { useInventory } from '@/stores/inventory'
import { computed, ref } from 'vue'

const inventory = useInventory()

const selectionMode = ref(false)
const selected = ref<Record<string, boolean>>({})

const allSelected = computed({
  get: () => inventory.collections.every(x => x.id && (selected.value[x.id] ?? false)),
  set: (v) => inventory.collections.forEach(x => x.id && (selected.value[x.id] = v))
})

const showArchiveSheet = ref(false)
function archive () {
  console.log('archive')
}
</script>
