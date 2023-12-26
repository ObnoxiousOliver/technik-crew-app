<template>
  <Page>
    <template #title>
      <i class="bi-file-plus" />Neuen Gegenstand erstellen
    </template>

    <template #btns>
      <Btn
        @click="submit"
        aria-label="Bestätigen"
      >
        <i class="bi-check-lg" />
      </Btn>
    </template>

    <FormContainer @submit.prevent="submit" :disabled="submitting">
      <FormGroup>
        <p>Gegenstand wird erstellt in</p>
        <DropdownSelection v-model="collectionId">
          <option value="">Keine Sammlung</option>
          <option
            v-for="(collection, i) in inventory.collections"
            :key="collection.id ?? i"
            :value="collection.id"
          >
            {{ collection.icon }}
            {{ collection.name }}
          </option>
        </DropdownSelection>
      </FormGroup>

      <InputField label="Name" v-model="name" />
      <FormInfo :show="nameErr">
        {{ nameErr }}
      </FormInfo>

      <TextBox placeholder="Keine Beschreibung" label="Beschreibung" v-model="description" />

      <SettingsList>
        <SettingsListDivider />
        <SettingsListOption>
          <i class="bi-geo-alt" />
          Standort
          <template #desc>
            <template v-if="location">{{ location.name }}</template>
            <template v-else><i>Kein Standort</i></template>
          </template>

          <template #input>
            <Btn
              square
              transparent
              danger
              :disabled="!location"
              @click="location = null"
            >
              <i class="bi-trash" />
            </Btn>
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
            <template v-if="code">{{ code }}</template>
            <template v-else><i>Kein QR- oder Barcode</i></template>
          </template>
          <template #input>
            <Btn
              :disabled="!code"
              square
              danger
              transparent
              @click="code = null"
              aria-label="Code entfernen"
            >
              <i class="bi-trash" />
            </Btn>
          </template>
        </SettingsListOption>

        <SettingsListLink :to="scanCode.route">
          <i class="bi-upc-scan" />
          QR- oder Barcode
          <template v-if="code">andern</template>
          <template v-else>scannen</template>
        </SettingsListLink>
        <SettingsListLink @click="showCodeSheet = true" is-button>
          <i class="bi-pencil-square" />
          Code manuell eingeben
        </SettingsListLink>

        <SettingsListDivider>
          Zusätzliche Felder
        </SettingsListDivider>

        <SettingsListItem>
          <ItemFieldsList
            v-if="collection?.fields"
            :fieldTemplate="collection?.fields"
            v-model:fields="fields"
            :collection-id="collectionId ?? ''"
          />
        </SettingsListItem>

        <SettingsListDivider />
      </SettingsList>

      <Btn type="submit">
        Erstellen
      </Btn>
    </FormContainer>

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
        <ActionSheetButton @click="code = codeInput.length > 0 ? codeInput : null">
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
import DropdownSelection from '@/components/DropdownSelection.vue'
import FormContainer from '@/components/FormContainer.vue'
import FormGroup from '@/components/FormGroup.vue'
import SettingsList from '@/components/SettingsList.vue'
import SettingsListDivider from '@/components/SettingsListDivider.vue'
import TextBox from '@/components/TextBox.vue'
import { useInventory } from '@/stores/inventory'
import { useTemp } from '@/stores/temp'
import { ref, watch, watchEffect, computed } from 'vue'
import { useRoute } from 'vue-router'
import { SelectLocationPreset, ScanCodePreset } from '../tempViews/presets'
import { Location } from '@/model/location'
import { useLocations } from '@/stores/locations'
import FormInfo from '@/components/FormInfo.vue'
import router from '@/router'
import ActionSheet from '@/components/ActionSheet.vue'
import InputField from '@/components/InputField.vue'
import ActionSheetButton from '@/components/ActionSheetButton.vue'
import SettingsListOption from '@/components/SettingsListOption.vue'
import SettingsListLink from '@/components/SettingsListLink.vue'
import ItemFieldsList from '@/components/ItemFieldsList.vue'
import { FieldTypes, FieldValue } from '@/model/inventory/collectionField'
import SettingsListItem from '@/components/SettingsListItem.vue'

const route = useRoute()
const inventory = useInventory()
const temp = useTemp()

const showCodeSheet = ref(false)

const selectLocation = temp.tempRoute(SelectLocationPreset('inventory-item-create-location'))
const scanCode = temp.tempRoute(ScanCodePreset('inventory-item-create-code'))

const state = temp.getData('inventory-item-create') as {
  collectionId: string | null
  name: string
  description: string
  locationId: string | null,
  code: string | null,
  fields: FieldValue<FieldTypes>[]
} | null

const collectionId = ref<string>(route.query.collection as string ?? inventory.collections?.[0]?.id ?? '')
const collection = computed(() => inventory.getCollectionById(collectionId.value))

const name = ref(state?.name ?? '')
const description = ref(state?.description ?? '')

const tempLoc = selectLocation.getData() as Location | null
const location = ref<Location | null>(
  tempLoc === null
    ? null
    : tempLoc ?? (state?.locationId
      ? useLocations().getLocationById(state.locationId) ?? null
      : null)
)

const tempCode = scanCode.getData() as string | null
const code = ref<string | null>(tempCode ?? null)
const codeInput = ref<string>(code.value ?? '')
watch(showCodeSheet, () => {
  if (showCodeSheet.value) {
    codeInput.value = code.value ?? ''
  }
})

const fields = ref<FieldValue<FieldTypes>[]>(state?.fields ?? [])

watchEffect(() => {
  temp.setData('inventory-item-create', {
    collectionId: collectionId.value.length,
    name: name.value,
    description: description.value,
    locationId: location.value?.id,
    code: code.value,
    fields: fields.value
  })
})

const nameErr = ref<string | null>(null)
const submitting = ref(false)
async function submit () {
  if (!name.value) {
    nameErr.value = 'Bitte gib einen Namen ein'
    return
  }

  submitting.value = true

  const item = await inventory.createItem({
    collectionId: collectionId.value,
    name: name.value,
    description: description.value,
    locationId: location.value?.id,
    code: code.value,
    fields: fields.value
  })

  temp.deleteData('inventory-item-create')

  router.replace({
    name: 'inventory-item-details',
    params: {
      id: item.collectionId,
      itemId: item.id
    }
  })
}
</script>
