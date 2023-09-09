<template>
  <NotFoundView v-if="!item" />
  <Page v-else>
    <template #btns>
      <Btn
        :to="{
          name: 'inventory-item-edit',
          params: {
            itemId: item?.id
          }
        }"
        aria-label="Bearbeiten"
      >
        <i class="bi-pencil-square" />
      </Btn>
    </template>

    <template v-if="item">
      <CenteredCard>
        <template #icon>
          <GlowDiv v-if="splitFirstEmojiFromString(item.name)?.[0]">
            {{ splitFirstEmojiFromString(item.name)?.[0] }}
          </GlowDiv>

          <template v-else>
            <i class="bi-box" />
          </template>
        </template>

        <template #title>
          {{ splitFirstEmojiFromString(item.name)?.[1] ?? item.name }}
        </template>

        <GlowDiv v-if="collection?.icon" inline>{{ collection?.icon }}</GlowDiv>
        <template v-else><i class="bi-collection" /></template>
        {{ collection?.name }}

        <br><br>

        <template v-if="location">{{ location?.name }}</template>
        <template v-else><i>Kein Standort angegeben</i></template>

        <!-- {{ location?.name }} -->
      </CenteredCard>

      <SettingsList>
        <SettingsListOption>
          <i class="bi-card-text" />
          Beschreibung

          <template #desc>
            <template v-if="item.description">{{ item.description }}</template>
            <template v-else><i>Keine Beschreibung</i></template>
          </template>
        </SettingsListOption>

        <SettingsListOption>
          <i class="bi-collection" />
          Kollektion

          <template #desc>
            <template v-if="collection">
              <template v-if="collection?.icon">{{ collection?.icon }}</template>
              {{ collection?.name }}
            </template>
            <template v-else><i>Keine Kollektion</i></template>
          </template>
        </SettingsListOption>

        <SettingsListDivider />
        <SettingsListOption>
          <i class="bi-geo-alt" />
          Standort
          <template #desc>
            <template v-if="location">{{ location.name }}</template>
            <template v-else><i>Kein Standort</i></template>
          </template>
        </SettingsListOption>
        <SettingsListLink :to="selectLocation.route">
          <i :class="location ? 'bi-pencil-square' : 'bi-plus-lg'" />
          <template v-if="location">Standort ändern</template>
          <template v-else>Standort hinzufügen</template>
        </SettingsListLink>

        <SettingsListDivider />

        <SettingsListOption>
          <i class="bi-qr-code-scan" />
          QR- oder Barcode
          <template #desc>
            <template v-if="item.code">{{ item.code }}</template>
            <template v-else><i>Kein QR- oder Barcode</i></template>
          </template>
        </SettingsListOption>

        <SettingsListLink :to="scanCode.route">
          <i class="bi-upc-scan" />
          QR- oder Barcode
          <template v-if="item.code">andern</template>
          <template v-else>scannen</template>
        </SettingsListLink>
        <SettingsListLink @click="showCodeSheet = true" is-button>
          <i class="bi-pencil-square" />
          Code manuell eingeben
        </SettingsListLink>

        <SettingsListDivider />

        <SettingsListLink
          :to="{
            name: 'inventory-item-edit',
            params: {
              itemId: item?.id
            }
          }"
        >
          <i class="bi-pencil-square" />
          Bearbeiten
        </SettingsListLink>

        <SettingsListLink
          :to="{
            name: 'inventory-item-history',
            params: {
              itemId: item.id
            }
          }"
        >
          <i class="bi-clock-history" />
          Verlauf anzeigen
        </SettingsListLink>

        <SettingsListDivider>Zusätzliche Felder</SettingsListDivider>

        <SettingsListLink
          v-if="unassignedFields.length > 0"
          :to="{
            name: 'inventory-item-unassigned',
            params: {
              itemId: item.id
            }
          }"
        >
          <i class="bi-question-square" />
          <template v-if="unassignedFields.length === 1">
            1 nicht zugewiesenes Feld
          </template>
          <template v-else>
            {{ unassignedFields.length }} nicht zugewiesene Felder
          </template>
        </SettingsListLink>

        <SettingsListItem>
          <ItemFieldsList
            :field-template="collection?.fields ?? []"
            :fields="item.fields"
            readonly
          />
        </SettingsListItem>
      </SettingsList>
    </template>

    <ActionSheet v-model:show="showCodeSheet">
      <template #title>
        Code manuell eingeben
      </template>

      <InputField
        dark
        class="w-stretch"
        v-model="codeInput"
        placeholder="Kein Code"
        label="Code"
      />

      <template #buttons>
        <ActionSheetButton @click="item?.setCode(codeInput.length > 0 ? codeInput : null)">
          <i class="bi-check-lg" />Bestätigen
        </ActionSheetButton>
        <ActionSheetButton>
          <i class="bi-x-lg" />Abbrechen
        </ActionSheetButton>
      </template>
    </ActionSheet>
  </Page>
</template>

<script setup lang="ts">
import ActionSheet from '@/components/ActionSheet.vue'
import ActionSheetButton from '@/components/ActionSheetButton.vue'
import CenteredCard from '@/components/CenteredCard.vue'
import GlowDiv from '@/components/GlowDiv.vue'
import InputField from '@/components/InputField.vue'
import SettingsList from '@/components/SettingsList.vue'
import SettingsListDivider from '@/components/SettingsListDivider.vue'
import SettingsListLink from '@/components/SettingsListLink.vue'
import SettingsListOption from '@/components/SettingsListOption.vue'
import { useInventory } from '@/stores/inventory'
import { useLocations } from '@/stores/locations'
import { splitFirstEmojiFromString } from '@/utilities/getFirstEmojiOfString'
import { computed, ref, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { ScanCodePreset, SelectLocationPreset } from '../tempViews/presets'
import { useTemp } from '@/stores/temp'
import { Location } from '@/model/location'
import { CollectionItem } from '@/model/inventory/collectionItem'
import SettingsListItem from '@/components/SettingsListItem.vue'
import ItemFieldsList from '@/components/ItemFieldsList.vue'
import NotFoundView from '../NotFoundView.vue'

const route = useRoute()
const inventory = useInventory()
const locStore = useLocations()
const temp = useTemp()

const showCodeSheet = ref(false)

const selectLocation = temp.tempRoute(SelectLocationPreset('inventory-item-edit-location'))
const scanCode = temp.tempRoute(ScanCodePreset('inventory-item-edit-code'))

const item = computed(() => inventory.getItemById(route.params.itemId as string))
const collection = computed(() => {
  if (item.value?.collectionId) {
    return inventory.getCollectionById(item.value.collectionId)
  }
  return null
})

watchEffect(() => {
  if (!item.value || !collection.value) return
  document.title = `${collection.value.icon ? collection.value.icon + ' ' : ''}${collection.value.name} > ${item.value.name}`
})

const tempLocation = selectLocation.getData() as Location | null | undefined
if (tempLocation !== undefined) {
  item.value?.setLocation(tempLocation ? tempLocation.id : null)
}

const location = computed(() => {
  if (item.value?.locationId) {
    return locStore.getLocationById(item.value.locationId)
  }
  return null
})

const tempCode = scanCode.getData() as string | null
if (tempCode) {
  item.value?.setCode(tempCode)
}

const codeInput = ref<string>(item.value?.code ?? '')
watch(showCodeSheet, () => {
  if (showCodeSheet.value) {
    codeInput.value = item.value?.code ?? ''
  }
})

const unassignedFields = computed(() => {
  if (!item.value || !collection.value) return []
  return CollectionItem.getUnassignedFields(item.value, collection.value)
})
</script>
