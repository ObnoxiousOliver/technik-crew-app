<template>
  <FormContainer class="event-edit-form" @submit.prevent="submit" :disabled="disabled">
    <FormGroup inline>
      <SelectColor v-model="color" />
      <input
        class="events-edit-form__name"
        placeholder="Unbenannter Termin..."
        v-model="name"
      />
    </FormGroup>
    <!-- <FormInfo :show="nameErr">
      {{ nameErr }}
    </FormInfo> -->

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
        <label class="events-edit-form__datetime-label no-grow">
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
        <label class="events-edit-form__datetime-label no-grow">bis</label>
        <DateTimeSelect
          class="fill-width"
          :disabled="oneday"
          :disabledTime="wholeday"
          v-model="end"
        />
      </FormGroup>
    </FormGroup>

    <TextBox
      label="Beschreibung"
      v-model="description"
      placeholder="Keine Beschreibung"
    />

    <Btn type="submit">Bestätigen</Btn>

    <FormInfo :show="props.err">
      {{ props.err }}
    </FormInfo>
  </FormContainer>
</template>

<script lang="ts" setup>
import { EventColors, EventDB } from '@/model/event'
import FormContainer from './FormContainer.vue'
import FormGroup from './FormGroup.vue'
import FormInfo from './FormInfo.vue'
import ToggleSwitch from './ToggleSwitch.vue'
import { onMounted, ref, watch } from 'vue'
import DateTimeSelect from './DateTimeSelect.vue'
import SelectColor from './SelectColor.vue'
import TextBox from './TextBox.vue'

const props = defineProps<{
  event: Partial<EventDB>,
  err?: string,
  disabled?: boolean
}>()
const emit = defineEmits(['submit', 'update:event'])

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

function update () {
  console.log('update')
  color.value = props.event?.color ?? 'gray'
  name.value = props.event?.name ?? ''
  description.value = props.event?.description ?? ''
  wholeday.value = props.event?.wholeDay ?? true

  const s = props.event?.startDate
    ? new Date(props.event.startDate)
    : new Date()
  s.setSeconds(0, 0)
  start.value = s
  const e = props.event?.endDate
    ? new Date(props.event.endDate)
    : new Date(s.getTime() + 60 * 60 * 1000)
  e.setSeconds(0, 0)
  if (props.event.wholeDay && e.getHours() === 0 && e.getMinutes() === 0) {
    e.setHours(23, 59)
  }
  end.value = e

  if (props.event?.startDate && props.event?.endDate) {
    oneday.value = s.getDate() === e.getDate() &&
      s.getMonth() === e.getMonth() &&
      s.getFullYear() === e.getFullYear()
  }
}
onMounted(update)
defineExpose({ updateForm: update })

// const nameErr = ref('')
function submit () {
  // if (name.value.trim() === '') {
  //   nameErr.value = 'Bitte gib einen Namen ein.'
  // } else {
  //   nameErr.value = ''
  // }

  emit('submit', {
    color: color.value,
    name: name.value,
    description: description.value,
    wholeDay: wholeday.value,
    startDate: start.value.getTime(),
    endDate: ((oneday.value && wholeday.value) || wholeday.value) ? start.value.getTime() : end.value.getTime(),
    neededEquipment: props.event.neededEquipment,
    neededUsers: props.event.neededUsers
  } as Partial<EventDB>)
}

watch([color, name, description, wholeday, oneday, start, end], () => {
  if (props.disabled) return

  const event: Partial<EventDB> = {
    color: color.value,
    name: name.value,
    description: description.value,
    wholeDay: wholeday.value,
    startDate: start.value.getTime(),
    endDate: end.value.getTime()
  }

  if (oneday.value) {
    event.endDate = event.startDate
  }

  emit('update:event', event)
})
</script>

<style scoped lang="scss">
@use '../scss' as r;

.events-edit-form {
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
}
</style>
