<template>
  <Page>
    <EquipmentBadge :equipment="equipment" />

    <h3>Beschreibung</h3>

    <div class="equipment-details__description">
      {{ equipment?.description }}
    </div>

    <h3>Anmerkungen</h3>
    <Textbox
      class="equipment-details__text-box"
      placeholder="Anmerkung hinzufügen"
      v-model="newNote"
      @keydown.ctrl.enter="addNote"
    >
      <template #buttons>
        <Btn
          :disabled="newNote.length === 0"
          class="btn--square"
          @click="addNote"
        >
          <i class="bi-send"></i>
        </Btn>
      </template>
    </Textbox>

    <Spinner v-if="loading" />

    <TransitionGroup v-else tag="div" name="equipment-details__note">
      <EquipmentNote
        v-for="item in notes"
        :key="item.id"
        :note="item.note"
        @options="noteOptions = item"
      />
    </TransitionGroup>

    <ActionSheet v-model:show="showNoteOptionsSheet">
      <template #buttons>
        <ActionSheetButton>
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
import EquipmentBadge from '../components/EquipmentBadge.vue'
import EquipmentNote from '../components/EquipmentNote.vue'
import { Equipment, NoteDB } from '@/model/equipment'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const equipment = ref<Equipment>()
const notes = ref<{
  id: string
  note: NoteDB
}[]>([])

const newNote = ref('')
const noteOptions = ref(null)
const showNoteOptionsSheet = computed({
  get: () => noteOptions.value !== null,
  set: value => {
    if (!value) {
      noteOptions.value = null
    }
  }
})

const loading = ref(true)
onMounted(async () => {
  await update()

  loading.value = false
})

async function update () {
  equipment.value = await Equipment.get(route.params.id, null, true)
  const _notes = await equipment.value?.getNotes()
  notes.value = Object.keys(_notes).map(id => ({
    id,
    note: _notes[id]
  })).sort((a, b) => b.note.date - a.note.date)
}

async function addNote () {
  await equipment.value?.addNote(newNote.value.trim())
  newNote.value = ''
  await update()
}

async function deleteNote () {
  await equipment.value?.removeNote(noteOptions.value.id)
  noteOptions.value = null
  await update()
}
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.equipment-details {
  &__text-box {
    margin-bottom: 2rem;
  }

  &__description {
    white-space: pre-wrap;
    word-break: break-word;
    user-select: text;
    line-height: 1.5;
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
