<template>
  <Page>
    <template #title>
      Neuer Termin
    </template>

    <template #btns>
      <!-- Reset -->
      <Btn @click="showResetSheet = true" aria-label="Zurücksetzen">
        <i class="bi-arrow-counterclockwise" />
      </Btn>
    </template>

    <FormContainer @submit.prevent="submit" :disabled="submitting">
      <FormGroup inline>
        <SelectColor v-model="color" />
        <input
          class="events-add__name"
          placeholder="Unbenannter Termin..."
          v-model="name"
        />
      </FormGroup>
      <FormInfo :show="nameErr">
        {{ nameErr }}
      </FormInfo>

      <FormGroup class="space-top" inline>
        <label for="oneday">
          Eintägig
        </label>
        <ToggleSwitch id="oneday" v-model="oneday" />
      </FormGroup>
      <FormGroup inline>
        <label for="wholeday">
          Ganztägig
        </label>
        <ToggleSwitch id="wholeday" v-model="wholeday" />
      </FormGroup>
      <FormGroup>
        <FormGroup inline>
          <label class="events-add__datetime-label no-grow">
            <template v-if="oneday">
              Am
            </template>
            <template v-else>
              Vom
            </template>
          </label>
          <DateTimeSelect class="fill-width" :disabledTime="wholeday" v-model="start" />
        </FormGroup>
        <FormGroup inline>
          <label class="events-add__datetime-label no-grow">bis</label>
          <DateTimeSelect
            class="fill-width"
            :disabled="oneday"
            :disabledTime="wholeday"
            v-model="end"
          />
        </FormGroup>

        <p class="events-add__datetime-info">
          Der Termin findet
          <template v-if="isOneday">
            am <b>{{ start.toLocaleDateString('de-DE', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) }}</b>

            <template v-if="!wholeday">
              von <b>{{ start.toLocaleTimeString('de-DE', {
                hour: '2-digit',
                minute: '2-digit'
              }) }}</b>
              bis <b>{{ end.toLocaleTimeString('de-DE', {
                hour: '2-digit',
                minute: '2-digit'
              }) }}</b>
            </template>
          </template>
          <template v-else>
            von
            <b>{{ start.toLocaleDateString('de-DE', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) }}</b>

            <template v-if="!wholeday">
              um <b>{{ start.toLocaleTimeString('de-DE', {
                hour: '2-digit',
                minute: '2-digit'
              }) }}</b>
            </template>

            bis zum
            <b>{{ end.toLocaleDateString('de-DE', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) }}</b>

            <template v-if="!wholeday">
              um <b>{{ end.toLocaleTimeString('de-DE', {
                hour: '2-digit',
                minute: '2-digit'
              }) }}</b>
            </template>
          </template>
          statt.
        </p>
      </FormGroup>

      <TextBox
        label="Beschreibung"
        v-model="description"
        placeholder="Keine Beschreibung"
      />

      <!-- <div>
        <Btn
          chip
          v-for="user in neededUsers"
          :key="user"
          @click="neededUsers.splice(neededUsers.indexOf(user), 1)"
        >
          <Username :user="users.users[user]" />
        </Btn>
      </div> -->

      <Btn type="submit">Bestätigen</Btn>
    </FormContainer>

    <ActionSheet v-model:show="showResetSheet">
      <template #title>
        Zurücksetzen
      </template>

      Möchtest du wirklich alle Eingaben zurücksetzen?

      <template #buttons>
        <ActionSheetButton @click="reset">
          <i class="bi-arrow-counterclockwise" /> Zurücksetzen
        </ActionSheetButton>
        <ActionSheetButton>
          <i class="bi-x-lg" /> Abbrechen
        </ActionSheetButton>
      </template>
    </ActionSheet>

    <!-- {{neededUsers}}
    <RouterLink
      @click="temp.setData('events-add-select-users', neededUsers)"
      :to="{ name: 'events-add-select-users' }">
      Benutzer
    </RouterLink> -->
  </Page>
</template>

<script lang="ts" setup>
import TextBox from '@/components/TextBox.vue'
import SelectColor from '@/components/SelectColor.vue'
import DateTimeSelect from '@/components/DateTimeSelect.vue'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useEvents } from '@/stores/events'
import { EventColors } from '@/model/event'
import { back } from '@/router'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import ActionSheet from '@/components/ActionSheet.vue'
import ActionSheetButton from '@/components/ActionSheetButton.vue'
import FormContainer from '@/components/FormContainer.vue'
import FormGroup from '@/components/FormGroup.vue'
import FormInfo from '@/components/FormInfo.vue'

const events = useEvents()
const color = ref<EventColors>('gray')
const name = ref('')
const description = ref('')

const wholeday = ref(true)
watch(wholeday, () => {
  if (!wholeday.value) {
    oneday.value = false
  }
})
const oneday = ref(true)
watch(oneday, () => {
  if (oneday.value) {
    wholeday.value = true
  }
})
const isOneday = computed(() => {
  if (oneday.value) return true

  const s = new Date(start.value)
  const e = new Date(end.value)

  s.setHours(0, 0, 0, 0)
  e.setHours(0, 0, 0, 0)

  return s.getTime() === e.getTime()
})

const _start = new Date()
_start.setSeconds(0, 0)
const start = ref<Date>(_start)

const _end = new Date()
_end.setHours(_end.getHours() + 1)
_end.setSeconds(0, 0)
const end = ref<Date>(_end)

watch(end, () => {
  if (end.value.getSeconds() !== 0 || end.value.getMilliseconds() !== 0) {
    end.value.setSeconds(0, 0)
  }

  if (oneday.value) return

  const s = new Date(start.value)
  const e = new Date(end.value)
  if (wholeday.value) {
    s.setHours(0, 0, 0, 0)
    e.setHours(0, 0, 0, 0)
  } else {
    s.setSeconds(0, 0)
    e.setSeconds(0, 0)
  }

  // if end is before start, set start to end
  if (s.getTime() > e.getTime()) {
    const d = new Date(start.value)
    d.setFullYear(
      e.getFullYear(),
      e.getMonth(),
      e.getDate())

    // if not wholeday, set start to end - 1h
    if (!wholeday.value) {
      d.setHours(e.getHours() - 1, e.getMinutes())
    }

    start.value = d
  }
})

watch([start, wholeday, oneday], () => {
  if (start.value.getSeconds() !== 0 || start.value.getMilliseconds() !== 0) {
    start.value.setSeconds(0, 0)
  }

  if (oneday.value) return

  const s = new Date(start.value)
  const e = new Date(end.value)
  if (wholeday.value) {
    s.setHours(0, 0, 0, 0)
    e.setHours(0, 0, 0, 0)
  } else {
    s.setSeconds(0)
    e.setSeconds(0)
  }

  // if end is before start, set end to start
  if (s.getTime() > e.getTime()) {
    const d = new Date(end.value)
    d.setFullYear(
      s.getFullYear(),
      s.getMonth(),
      s.getDate())

    // if not wholeday, set end to start + 1h
    if (!wholeday.value) {
      d.setHours(s.getHours() + 1, s.getMinutes())
    }

    end.value = d
  }
})

const nameErr = ref('')

const submitting = ref(false)
async function submit () {
  if (name.value.trim() === '') {
    nameErr.value = 'Bitte gib einen Namen ein.'
    return
  } else {
    nameErr.value = ''
  }

  submitting.value = true

  let endDate = end.value.getTime()
  if (wholeday.value) {
    if (start.value.toLocaleDateString('en-US') === end.value.toLocaleDateString('en-US')) {
      endDate = null
    }
  } else {
    if (start.value.getTime() === end.value.getTime()) {
      endDate = null
    }
  }

  events.create({
    color: color.value,
    name: name.value,
    description: description.value,
    startDate: start.value.getTime(),
    endDate,
    wholeDay: wholeday.value
  })

  localStorage.removeItem('event_add_state')

  back()
}

// Save state in local storage to restore it on reload
watch([
  name, color, description,
  start, end, wholeday, oneday
], () => {
  localStorage.setItem('event_add_state', JSON.stringify({
    name: name.value,
    color: color.value,
    description: description.value,
    start: start.value.getTime(),
    end: end.value.getTime(),
    wholeday: wholeday.value,
    oneday: oneday.value
  }))
})
// Restore state from local storage
onBeforeMount(() => {
  const state = localStorage.getItem('event_add_state')
  if (state) {
    const s = JSON.parse(state)
    name.value = s.name
    color.value = s.color
    description.value = s.description
    wholeday.value = s.wholeday
    oneday.value = s.oneday
    start.value = new Date(s.start)
    end.value = new Date(s.end)
  }
})

// Reset
const showResetSheet = ref(false)
function reset () {
  name.value = ''
  color.value = 'gray'
  description.value = ''
  wholeday.value = true
  oneday.value = true
  start.value = new Date()
  const e = new Date()
  e.setHours(e.getHours() + 1)
  end.value = e
}
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.events-add {
  &__name {
    // @include r.box;
    background: none;
    border: none;
    font: inherit;
    color: inherit;
    width: 100%;
    height: 3rem;
    font-size: 1.5rem;
    // border-radius: r.$radius;
    // padding: 0 1rem;
    // margin-left: -1rem;

    transition: .2s;

    &:focus-visible {
      outline: none;
      // box-shadow: r.$focus;
      box-shadow: r.$accent 0 -.05rem 0 inset, rgba(r.$accent, 0.1) 0 .4rem 0;
    }

    &::placeholder {
      color: r.$text-secondary;
    }
  }

  &__datetime-label {
    width: 2rem;
  }

  &__datetime-group {
    margin-top: 1rem;
  }

  &__datetime-info {
    margin: 1rem 0;
    font-size: .8rem;
  }
}

</style>
