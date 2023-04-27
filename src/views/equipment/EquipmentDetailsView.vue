<template>
  <NotFoundView v-if="!equipment" />

  <Page v-else padBottom>
    <CenteredCard>
      <template #icon>
        <i :class="typeInfo[equipment?.type ?? 'other']?.icon ?? typeInfo.other.icon" />
      </template>
      <template #title>
        <span v-if="(equipment?.amount ?? 1) > 1" class="equipment-details__amount">
          {{ equipment?.amount }}x
        </span>{{ equipment?.name }}
      </template>

      <LocationDisplay :id="equipment?.location" />
      <template v-if="!equipment?.location">
        Kein Standort angegeben
      </template>
    </CenteredCard>

    <SettingsList>
      <SettingsListOption>
        <i class="bi-card-text" />Beschreibung
        <template #desc>
          <span class="prewrap">
            {{ equipment?.description || 'Keine Beschreibung' }}
          </span>
        </template>
      </SettingsListOption>
      <SettingsListOption>
        <i class="bi-geo-alt" />Standort
        <template #desc>
          <LocationDisplay :id="equipment?.location" />

          <template v-if="!equipment?.location">
            Kein Standort angegeben
          </template>
        </template>
      </SettingsListOption>
      <SettingsListOption>
        <i class="bi-tag" />Typ
        <template #desc>
          <i :class="typeInfo[equipment?.type ?? 'other']?.icon ?? typeInfo.other.icon" />
          {{ typeInfo[equipment?.type ?? 'other']?.name ?? typeInfo.other.name }}
        </template>
      </SettingsListOption>
      <SettingsListOption>
        <i class="bi-ui-radios-grid" />Anzahl
        <template #desc>
          {{ equipment?.amount ?? 1 }}x
        </template>
      </SettingsListOption>
      <SettingsListOption>
        <i class="bi-qr-code-scan" />
        QR- oder Barcode
        <template #desc>
          {{ equipment?.code ?? 'Kein Wert angegeben' }}
        </template>
      </SettingsListOption>
      <!-- <canvas
        ref="qrcodeCanvas"
        class="equipment-details__qrcode"
        v-show="equipment?.code"
      /> -->

      <SettingsListDivider>
        Aktionen
      </SettingsListDivider>

      <SettingsListLink
        :to="{
          name: 'equipment-edit-location',
          params: { id: equipment.id },
          query: { back: route.fullPath }
        }"
      >
        <i class="bi-geo-alt" /><template v-if="equipment?.group">Gruppen </template>Standort
        <template v-if="equipment?.location">
          ändern
        </template>
        <template v-else>
          hinzufügen
        </template>
      </SettingsListLink>

      <SettingsListLink
        :to="{
          name: 'equipment-edit',
          params: {
            id: equipment.id,
            field: 'code'
          }
        }"
      >
        <i class="bi-qr-code-scan" />QR- oder Barcode
        <template v-if="equipment?.location">
          ändern
        </template>
        <template v-else>
          hinzufügen
        </template>
      </SettingsListLink>

      <SettingsListDivider v-if="(equipment?.amount ?? 1) > 1" />

      <SettingsListLink
        :to="{
          name: 'equipment-edit',
          params: {
            id: equipment.id,
            field: 'amount'
          }
        }"
      >
        <i class="bi-ui-radios-grid" />Anzahl ändern
      </SettingsListLink>

      <template v-if="(equipment?.amount ?? 1) > 1">
        <SettingsListLink
          :to="{
            name: 'equipment-split',
            params: {
              id: equipment.id,
            }
          }"
        >
          <i class="bi-vr" />Anzahl teilen
        </SettingsListLink>
      </template>

      <SettingsListDivider />

      <SettingsListLink
        :to="{
          name: 'equipment-edit',
          params: {
            id: equipment.id
          }
        }"
      >
        <i class="bi-pencil-square" />Bearbeiten
      </SettingsListLink>

      <SettingsListLink
        :to="{
          name: 'equipment-history',
          params: {
            id: equipment.id
          }
        }"
      >
        <i class="bi-clock-history" />Verlauf anzeigen
      </SettingsListLink>

      <SettingsListDivider>
        Anmerkungen
      </SettingsListDivider>
    </SettingsList>

    <CommentBox
      v-model="newNote"
      @send="addNote"
      @addFile="addFile"
      @addImage="addImage"

      class="equipment-details__comment-box"
    />

    <Spinner v-if="loading" />

    <TransitionGroup v-else tag="div" name="equipment-details__note">
      <EquipmentNote
        v-for="id in sortedNotes"
        :key="id"
        :note="notes[id]"
        @options="noteOptions = id"
      />
    </TransitionGroup>

    <span v-if="sortedNotes.length === 0" class="text-secondary">
      Keine Anmerkungen vorhanden
    </span>

    <ActionSheet v-model:show="showNoteOptionsSheet">
      <template #buttons>
        <ActionSheetButton
          :to="{
            name: 'equipment-note',
            params: {
              id: equipment.id,
              noteId: noteOptions
            }
          }"
        >
          <i class="bi-pencil" />Anmerkung bearbeiten
        </ActionSheetButton>
        <ActionSheetButton @click="deleteNote" class="danger">
          <i class="bi-trash" />Anmerkung löschen
        </ActionSheetButton>
      </template>
    </ActionSheet>
  </Page>
</template>

<script lang="ts" setup>
import CommentBox from '@/components/CommentBox.vue'
import SettingsList from '@/components/SettingsList.vue'
import SettingsListLink from '@/components/SettingsListLink.vue'
import SettingsListDivider from '@/components/SettingsListDivider.vue'
import SettingsListOption from '@/components/SettingsListOption.vue'
import EquipmentNote from '../../components/EquipmentNote.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { EquipmentTypeInfo, NoteDB } from '@/model/equipment'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import CenteredCard from '@/components/CenteredCard.vue'
import { useEquipment } from '@/stores/equipment'
import { useFileDialog } from '@vueuse/core'
// import QrCreator from 'qr-creator'

const typeInfo = EquipmentTypeInfo

const route = useRoute()
const eqStore = useEquipment()

const equipment = computed(() => eqStore.findByID(route.params.id as string))
const notes = ref<Record<string, NoteDB>>({})
const sortedNotes = computed(() => {
  const ids = Object.keys(notes.value)
  ids.sort((a, b) => {
    const noteA: NoteDB = notes.value[a]
    const noteB: NoteDB = notes.value[b]
    return noteB.date - noteA.date
  })
  return ids
})

// const qrcodeCanvas = ref(null)
// watch(() => [qrcodeCanvas.value, equipment.value?.code], () => {
//   if (!qrcodeCanvas.value) return
//   if (!equipment.value) return
//   if (!equipment.value.code) return

//   QrCreator.render({
//     text: equipment.value.code,
//     radius: 0
//   }, qrcodeCanvas.value)
// }, { immediate: true })

const loading = ref(true)
let unsubscribe: (() => void) | undefined
watch(equipment, () => {
  unsubscribe?.()
  notes.value = {}

  if (equipment.value) {
    if (equipment.value?.name) document.title = equipment.value?.name

    unsubscribe = eqStore.subscribeNotes(equipment.value, (note) => {
      loading.value = false
      notes.value = note
    })
  }
}, { immediate: true })

onBeforeUnmount(() => {
  unsubscribe?.()
})

const newNote = ref('')
const noteOptions = ref<string | null>(null)
const showNoteOptionsSheet = computed({
  get: () => noteOptions.value !== null,
  set: value => {
    if (!value) {
      noteOptions.value = null
    }
  }
})

const imageDialog = useFileDialog({
  accept: 'image/*',
  multiple: true
})

const fileDialog = useFileDialog({
  accept: '*',
  multiple: true
})

async function addFile () {
  if (!equipment.value) return
  fileDialog.open()
}

async function addImage () {
  if (!equipment.value) return
  imageDialog.open()
}

async function addNote () {
  await equipment.value?.addNote(newNote.value.trim())
  newNote.value = ''
}

async function deleteNote () {
  if (!noteOptions.value) return
  await equipment.value?.removeNote(noteOptions.value)
  noteOptions.value = null
}
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.equipment-details {
  &__comment-box {
    margin-top: 1rem;
    margin-bottom: 2rem;
  }

  &__amount {
    display: inline-block;
    font-size: .5em;
    vertical-align: .4em;
    margin-right: .3rem;
    color: r.$text-secondary;
  }

  &__description {
    white-space: pre-wrap;
    word-break: break-word;
    user-select: text;
    line-height: 1.5;
    margin-bottom: 1rem;
  }

  &__qrcode {
    background: white;
    padding: 1rem;
    width: 200px;
    height: 200px;
  }

  &__note {
    &-enter-active {
      transition: .5s .1s cubic-bezier(0.19, 1, 0.22, 1), margin .2s;
      clip-path: inset(0);
    }
    &-leave-active {
      transition: .5s cubic-bezier(0.19, 1, 0.22, 1);
      clip-path: inset(0);
    }

    &-enter-from {
      opacity: 0;
      transform: translateY(-100%);
      clip-path: inset(100% 0 0 0);
      margin-bottom: -3.6rem;
    }
    &-leave-to {
      opacity: 0;
      transform: translateY(-100%);
      clip-path: inset(100% 0 0 0);
      margin-bottom: calc(-1 * var(--height) - 1rem);
    }
  }
}
</style>
