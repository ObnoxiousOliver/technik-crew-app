<template>
  <Page>
    <template #title>
      <i class="bi-pencil-square" />Profil bearbeiten
    </template>

    <FormContainer @submit.prevent="submit" :disabled="submitting">
      <FormGroup>
        <FloatingLabelInput label="Vorname" v-model="firstname"/>
        <FloatingLabelInput label="Nachname" v-model="lastname" />
      </FormGroup>
      <FormInfo :show="nameError">
        {{ nameError }}
      </FormInfo>
      <Dropdown v-model="gender">
        <option :value="Gender.Male">
          männlich
        </option>
        <option :value="Gender.Female">
          weiblich
        </option>
        <option :value="Gender.NonBinary">
          divers
        </option>
      </Dropdown>
      <FormGroup inline>
        <label for="preferLastname">
          Nur Nachname anzeigen
        </label>
        <Toggle id="preferLastname" v-model="preferLastname" />
      </FormGroup>
      <Btn type="submit">
        Speichern
      </Btn>
    </FormContainer>
  </Page>
</template>

<script lang="ts" setup>
import FloatingLabelInput from '@/components/FloatingLabelInput.vue'
import { Gender } from '@/model/user'
import { useUser } from '@/stores/user'
import { ref } from 'vue'
import { back } from '@/router'

const userStore = useUser()

const firstname = ref(userStore.user?.firstname)
const lastname = ref(userStore.user?.lastname)
const gender = ref(userStore.user?.gender)
const preferLastname = ref(userStore.user?.prefer_lastname)

const submitting = ref(false)
const nameError = ref('')
async function submit () {
  if (!userStore.user) return

  if (firstname.value === '' || lastname.value === '') {
    nameError.value = 'Vor- und Nachname müssen ausgefüllt sein'
    return
  } else {
    nameError.value = ''
  }

  submitting.value = true
  userStore.user.firstname = firstname.value
  userStore.user.lastname = lastname.value
  userStore.user.gender = gender.value
  userStore.user.prefer_lastname = preferLastname.value
  await userStore.user?.setUserDB()
  back()
}
</script>
