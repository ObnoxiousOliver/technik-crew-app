<template>
  <NotFoundView v-if="!item" />
  <Page v-else>
    <template #title>
      <template v-if="item && !splitFirstEmojiFromString(item.name ?? '')"><i class="bi-box" /></template>{{ item?.name }}
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
        <SettingsListDivider>
          Zusätzliche Felder
        </SettingsListDivider>

        <SettingsListItem>
          <ItemFieldsList
            v-if="collection?.fields"
            :fieldTemplate="collection?.fields"
            v-model:fields="fields"
          />
        </SettingsListItem>

        <SettingsListDivider />
      </SettingsList>

      <Btn type="submit">
        Bestätigen
      </Btn>
    </FormContainer>
  </Page>
</template>

<script lang="ts" setup>
import DropdownSelection from '@/components/DropdownSelection.vue'
import FormContainer from '@/components/FormContainer.vue'
import FormGroup from '@/components/FormGroup.vue'
import FormInfo from '@/components/FormInfo.vue'
import InputField from '@/components/InputField.vue'
import SettingsList from '@/components/SettingsList.vue'
import SettingsListDivider from '@/components/SettingsListDivider.vue'
import SettingsListItem from '@/components/SettingsListItem.vue'
import { useInventory } from '@/stores/inventory'
import { splitFirstEmojiFromString } from '@/utilities/getFirstEmojiOfString'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { FieldTypes, FieldValue } from '@/model/inventory/collectionField'
import { back } from '@/router'
import ItemFieldsList from '@/components/ItemFieldsList.vue'
import TextBox from '@/components/TextBox.vue'
import NotFoundView from '../NotFoundView.vue'

const inventory = useInventory()
const route = useRoute()

const item = ref(inventory.getItemById(route.params.itemId as string))
const collection = computed(() => {
  if (item.value?.collectionId) {
    return inventory.getCollectionById(item.value.collectionId)
  }
  return null
})

const collectionId = ref(item.value?.collectionId ?? '')

const name = ref(item.value?.name ?? '')
const description = ref(item.value?.description ?? '')
const fields = ref<FieldValue<FieldTypes>[]>(JSON.parse(JSON.stringify(item.value?.fields ?? [])))

const nameErr = ref<string | null>(null)
const submitting = ref(false)

async function submit () {
  if (!item.value) return
  if (!name.value) {
    nameErr.value = 'Bitte gib einen Namen ein'
    return
  }

  submitting.value = true

  item.value?.set({
    name: name.value,
    description: description.value,
    fields: fields.value
  })

  back()
}
</script>
