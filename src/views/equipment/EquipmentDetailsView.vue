<template>
  <NotFoundView v-if="!equipment" />

  <Page v-else padBottom :drop="onDrop">
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
      @removeFile="removeFile"

      :sending="sending"
      :compressing="compressing"
      :attachments="attachments"

      class="equipment-details__comment-box"
    />

    <Spinner v-if="loading && sortedNotes.length <= 0" />

    <TransitionGroup v-else tag="div" name="equipment-details__note">
      <EquipmentNote
        v-for="id in sortedNotes"
        :key="id"
        :note="notes[id]"
        @options="noteOptions = id"
        @open="open"
      />
    </TransitionGroup>

    <span v-if="sortedNotes.length === 0" class="text-secondary">
      Keine Anmerkungen vorhanden
    </span>

    <ActionSheet v-model:show="showNoteOptionsSheet">
      <template #buttons>
        <!-- <ActionSheetButton
          :to="{
            name: 'equipment-note',
            params: {
              id: equipment.id,
              noteId: noteOptions
            }
          }"
        >
          <i class="bi-pencil" />Anmerkung bearbeiten
        </ActionSheetButton> -->
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
import { computed, onBeforeUnmount, ref, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import CenteredCard from '@/components/CenteredCard.vue'
import { useEquipment } from '@/stores/equipment'
import { useFileDialog, watchOnce } from '@vueuse/core'
import { compress } from '@/utilities/compress'
import { createId } from '@/utilities/id'
import { useToast } from '@/utilities/toast'
// import QrCreator from 'qr-creator'

const typeInfo = EquipmentTypeInfo

const route = useRoute()
const eqStore = useEquipment()

const equipment = computed(() => eqStore.findByID(route.params.id as string))
const notes = computed(() => eqStore.notes[route.params.id as string] ?? {})
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

const loading = computed(() => eqStore.notesLoading)
let unsubscribe: (() => void) | undefined
watchEffect(async () => {
  unsubscribe?.()
  if (equipment.value) {
    if (equipment.value?.name) document.title = equipment.value?.name

    unsubscribe = await eqStore.subscribeNotes(equipment.value)
  }
})

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

const dropedFiles = ref<File[]>([])
function onDrop (files: File[] | null) {
  if (!files) return
  dropedFiles.value = files
}

const attachments = ref<File[]>([])
const maxFilesize = 10 * 1024 * 1024 // 10 MB
const compressing = ref<{
  done: number
  total: number
  files: string[]
} | null>(null)
watch([imageDialog.files, fileDialog.files, dropedFiles], async () => {
  async function computeFile (file: File, filename: string) {
    // Replace all non-alphanumeric characters with underscores
    // and append a random string to the filename to prevent duplicates
    if (attachments.value.find(f => f.name === filename)) return

    try {
      file = await compress(file)
    } catch (err) {
      console.error(err)
      useToast().show('Fehler beim Komprimieren der Datei: ' + file.name)
      return
    }

    file = new File([file], filename, {
      type: file.type
    })

    return file
  }

  const files: File[] = []
  if (fileDialog.files.value) {
    for (let i = 0; i < fileDialog.files.value.length; i++) {
      const file = fileDialog.files.value.item(i)
      file && files.push(file)
    }
  }

  if (imageDialog.files.value) {
    for (let i = 0; i < imageDialog.files.value.length; i++) {
      const file = imageDialog.files.value.item(i)
      file && files.push(file)
    }
  }

  dropedFiles.value.forEach(file => files.push(file))

  const attachmentSize = [...attachments.value]
    .reduce((acc, file) => acc + file.size, 0)

  const newAttachments: File[] = []

  const filenames = files.map(file => {
    const extention = file.name.split('.').pop()?.toLowerCase()
    const filename = file.name.split('.').slice(0, -1).join('.').replace(/[^a-zA-Z0-9_-]/g, '_')
    return `${filename}-${createId(4)}.${extention}`
  })
  for (let i = 0; i < files.length; i++) {
    compressing.value = {
      done: i,
      total: files.length,
      files: filenames
    }

    const file = await computeFile(files[i], filenames[i])
    if (!file) continue

    if (attachmentSize + file.size < maxFilesize) {
      newAttachments.push(file)
    } else {
      useToast().show('⚠️Das Limit von 10 MB wurde erreicht.')
      break
    }
  }
  compressing.value = null

  attachments.value.push(...newAttachments)

  fileDialog.reset()
  imageDialog.reset()
  if (dropedFiles.value.length > 0) {
    dropedFiles.value = []
  }
}, { deep: true })

async function addFile () {
  if (!equipment.value) return
  fileDialog.open()
}

async function addImage () {
  if (!equipment.value) return
  imageDialog.open()
}

async function removeFile (filename: string) {
  attachments.value = attachments.value.filter(f => f.name !== filename)
}

const sending = ref(false)
async function addNote () {
  // Wait for compression to finish
  sending.value = true

  if (compressing.value) {
    await new Promise<void>(resolve => {
      watchOnce(compressing, (val) => {
        if (!val) resolve()
      })
    })
  }

  const msg = newNote.value.trim()
  const attach = attachments.value.filter(f => f.size > 0)
  attachments.value = []
  newNote.value = ''

  await equipment.value?.addNote(msg, attach)
  sending.value = false
}

async function deleteNote () {
  if (!noteOptions.value) return
  await equipment.value?.removeNote(noteOptions.value)
  noteOptions.value = null
}

function open (url: string) {
  window.open(url, '_blank')
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
