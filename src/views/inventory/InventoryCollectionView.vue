<template>
  <NotFoundView v-if="!collection" />
  <Page v-else>
    <template #btns>
      <Btn
        :to="{
          name: 'inventory-collection-archive',
          params: {
            id: collection?.id
          },
          query: {
            back: $route.fullPath
          }
        }"
        aria-label="Archiv"
      >
        <i class="bi-archive" />
      </Btn>
      <Btn
        :to="{
          name: 'inventory-edit',
          params: {
            id: collection?.id
          }
        }"
        aria-label="Bearbeiten"
      >
        <i class="bi-pencil-square" />
      </Btn>
      <Btn
        :to="{
          name: 'inventory-item-create',
          query: {
            collection: collection?.id,
            back: $route.fullPath
          }
        }"
        aria-label="Neuer Gegenstand"
      >
        <i class="bi-plus-lg" />
      </Btn>
    </template>

    <template v-if="collection">
      <InfoCard>
        <template #title>
          <GlowDiv inline class="collection-icon">
            <i class="bi-collection" v-if="!collection.icon" />
            {{ collection.icon }}
          </GlowDiv>{{ collection.name }}
        </template>
        <template #desc>
          {{ items.length }} Gegestände
          <i class="bi-dot" />
          {{ archivedItemsLength }}
          {{
            archivedItemsLength === 1
              ? 'archivierter Gegenstand'
              : 'archivierte Gegenstände'
          }}
        </template>

        <span v-if="collection.description" class="prewrap">
          {{ collection.description }}
        </span>
        <i class="text-secondary" v-else>Keine Beschreibung</i>
      </InfoCard>

      <SettingsList>
        <SettingsListLink
          :to="{
            name: 'inventory-edit',
            params: {
              id: collection?.id
            }
          }"
        >
          <i class="bi-pencil-square" />Bearbeiten
        </SettingsListLink>

        <SettingsListLink
          :to="{
            name: 'inventory-history',
            params: {
              id: collection?.id
            }
          }"
        >
          <i class="bi-clock-history" />Verlauf
        </SettingsListLink>

        <SettingsListDivider />

        <SettingsListLink
          v-if="!collection.isHidden"
          isButton
          :arrow="false"
          danger
          @click="showArchiveSheet = true"
        >
          <i class="bi-archive" />Archivieren
        </SettingsListLink>
        <template v-else>
          <SettingsListLink
            isButton
            :arrow="false"
            @click="collection.setHidden(false)"
          >
            <i class="bi-arrow-counterclockwise" />Wiederherstellen
          </SettingsListLink>

          <SettingsListLink
            isButton
            :arrow="false"
            danger
            @click="showDeleteSheet = true"
          >
            <i class="bi-trash" />Löschen
          </SettingsListLink>
        </template>

        <SettingsListDivider />
        <SettingsListItem>
          <InputField
            class="w-stretch"
            v-model="query"
            placeholder="Suchen"
          />
        </SettingsListItem>
      </SettingsList>

      <CollectionItemList :collection="collection" :items="items" />

      <ActionSheet v-model:show="showArchiveSheet">
        <template #title>
          <i class="bi-archive" />Archivieren
        </template>

        <p>
          Bist du sicher, dass du die Kollektion <b>{{ collection.name }}</b> archivieren möchtest?
        </p>

        <p>
          Du kannst die Kollektion jederzeit wiederherstellen.
        </p>

        <template #buttons>
          <ActionSheetButton>
            <i class="bi-x-lg" />Abbrechen
          </ActionSheetButton>
          <ActionSheetButton
            danger
            @click="collection.setHidden(true)"
          >
            <i class="bi-archive" />Archivieren
          </ActionSheetButton>
        </template>
      </ActionSheet>

      <ActionSheet v-model:show="showDeleteSheet">
        <template #title>
          <i class="bi-trash" />Löschen
        </template>

        <p>
          Bist du sicher, dass du die Kollektion <b>{{ collection.name }}</b> löschen möchtest?
          Alle Gegenstände in dieser Kollektion werden nicht gelöscht, sondern in die Kollektion <b>Ohne Kollektion</b> verschoben.
        </p>

        <p>
          Diese Aktion kann nicht rückgängig gemacht werden.
        </p>

        <template #buttons>
          <ActionSheetButton>
            <i class="bi-x-lg" />Abbrechen
          </ActionSheetButton>
          <ActionSheetButton
            danger
            @click="deleteCollection()"
          >
            <i class="bi-trash" />Löschen
          </ActionSheetButton>
        </template>
      </ActionSheet>
    </template>
  </Page>
</template>

<script setup lang="ts">
import CollectionItemList from '@/components/CollectionItemList.vue'
import GlowDiv from '@/components/GlowDiv.vue'
import InfoCard from '@/components/InfoCard.vue'
import { useInventory } from '@/stores/inventory'
import { computed, watchEffect, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NotFoundView from '../NotFoundView.vue'
import SettingsList from '@/components/SettingsList.vue'
import SettingsListLink from '@/components/SettingsListLink.vue'
import SettingsListDivider from '@/components/SettingsListDivider.vue'
import ActionSheet from '@/components/ActionSheet.vue'
import ActionSheetButton from '@/components/ActionSheetButton.vue'
import InputField from '@/components/InputField.vue'
import SettingsListItem from '@/components/SettingsListItem.vue'
import { search } from '@/utilities/search'
import { useLocations } from '@/stores/locations'

const route = useRoute()
const router = useRouter()
const inventory = useInventory()
const locations = useLocations()

const query = ref('')
const collection = computed(() => inventory.getCollectionById(route.params.id as string))

const items = computed(() => {
  const items = inventory.getItemsByCollectionId(route.params.id as string).filter(x => !x.isHidden)

  if (query.value) {
    return search(query.value, items, (item) => `${item.name} ${item.description} ${item.locationId
      ? (() => {
        const loc = locations.getLocationById(item.locationId)
        return loc ? loc.name + ' ' + loc.description : ''
      })()
      : ''} ${item.fields.map(x => x.value).join(' ')}`)
  }

  return items
})
const archivedItemsLength = computed(() => inventory.getItemsByCollectionId(route.params.id as string).filter(x => x.isHidden).length)

watchEffect(() => {
  if (!collection.value) return
  document.title = `${collection.value.icon ? collection.value.icon + ' ' : ''}${collection.value.name}`
})

const showArchiveSheet = ref(false)
const showDeleteSheet = ref(false)

function deleteCollection () {
  inventory.deleteCollection(collection.value?.id as string)
  router.replace({
    name: 'inventory'
  })
}
</script>

<style scoped lang="scss">
@use '../../scss' as r;

.collection-icon {
  width: 2rem;
}

.collection-page {
  &__items {
    overflow: auto;
    width: stretch;

    &__table {
      border-collapse: collapse;
      min-width: stretch;

      &__row {
        display: table-row;
        color: inherit;
        text-decoration: none;

        &::before {
          content: none;
        }
      }

      th, td {
        padding: .5rem;
        border-bottom: 1px solid r.$bg-stroke;
        text-align: left;

        &:first-child {
          width: 1rem;
        }
      }
    }
  }
}
</style>
