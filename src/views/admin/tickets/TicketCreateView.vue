<template>
  <Page>
    <template #title>
      Neues Ticket
    </template>

    <FormContainer :disabled="submitting" @submit.prevent="submit" class="form">
      <div class="create-ticket__code-container">
        <CodeInput
          class="create-ticket__code-input"
          autocomplete="off"
          v-model="code"
        />
        <Btn class="create-ticket__code-generate-btn" type="button" @click="setRandomCode">
          <i class="bi-arrow-counterclockwise" />
        </Btn>
      </div>
      <FormInfo :show="codeError">{{ codeError }}</FormInfo>

      <FloatingLabelInput
        label="vorname.nachname oder Lehrerkürzel"
        autocomplete="off"
        autocapitalize="none"
        v-model="username"
      />
      <FormInfo :show="usernameError">{{ usernameError }}</FormInfo>

      <FormGroup>
        <FloatingLabelInput
          label="Vorname"
          autocomplete="off"
          v-model="firstname"
        />
        <FloatingLabelInput
          label="Nachname"
          autocomplete="off"
          v-model="lastname"
        />
      </FormGroup>
      <FormInfo :show="nameError">{{ nameError }}</FormInfo>

      <Dropdown
        id="gender"
        v-model="gender"
      >
        <option value="">Geschlecht auswählen</option>
        <option value="non-binary">divers</option>
        <option value="male">männlich</option>
        <option value="female">weiblich</option>
      </Dropdown>
      <FormInfo :show="genderError">{{ genderError }}</FormInfo>

      <FormGroup inline>
        <label for="preferLastname">
          Nur Nachname anzeigen:
        </label>
        <Toggle id="preferLastname" v-model="preferLastname" />
      </FormGroup>

      <FormGroup inline>
        <label>
          Anzeigename:
        </label>
        <Username
          :firstname="firstname"
          :lastname="lastname"
          :gender="gender"
          :preferLastname="preferLastname"
        />
      </FormGroup>

      <Btn type="submit">Ticket erstellen</Btn>
    </FormContainer>
  </Page>
</template>

<script lang="ts" setup>
import FloatingLabelInput from '@/components/FloatingLabelInput.vue'
import CodeInput from '@/components/CodeInput.vue'
import { Ticket } from '@/model/ticket'
import { encryptTicket } from '@/utilities/auth'
import { createTicket } from '@/utilities/admin'
import { doc, getDoc, getFirestore } from '@firebase/firestore'
import { ref } from 'vue'
import { back } from '@/router'

const db = getFirestore()

const code = ref('')
const username = ref('')
const firstname = ref('')
const lastname = ref('')
const gender = ref('')
const preferLastname = ref(false)

function generateCode () {
  const nums = new Array(6).fill(0)
  nums.forEach((_, i) => {
    let num = Math.floor(Math.random() * 10)
    while (nums[i - 1] === num) {
      num = Math.floor(Math.random() * 10)
    }
    nums[i] = num
  })
  return nums.join('')
}

setRandomCode()
async function setRandomCode () {
  let _code = generateCode()
  while (await checkCode(_code)) {
    _code = generateCode()
  }
  code.value = _code
}
async function checkCode (code) {
  return (await getDoc(doc(db, 'tickets', encryptTicket(code)))).exists()
}
async function checkUsername (username) {
  return (await getDoc(doc(db, 'users', username))).exists()
}

const codeError = ref('')
const usernameError = ref('')
const nameError = ref('')
const genderError = ref('')
const submitting = ref(false)
async function submit () {
  submitting.value = true
  let formInvalid = false

  if (code.value.length !== 6) {
    codeError.value = 'Der Code muss 6 Zeichen lang sein'
    formInvalid = true
  } else if (await checkCode(code.value)) {
    codeError.value = 'Dieser Code ist bereits vergeben'
    formInvalid = true
  } else {
    codeError.value = ''
  }

  if (!username.value.trim()) {
    usernameError.value = 'Der Benutzername darf nicht leer sein'
    formInvalid = true
  } else {
    const forbiddenChars = Array.from(username.value.trim())
      .filter((val) => !'abcdefghijklmnopqrstuvwxyz.'.includes(val))
      .filter((val, i, arr) => arr.indexOf(val) === i)

    if (forbiddenChars.length > 0) {
      usernameError.value = `Der Benutzername enthält ungültige Zeichen: ${forbiddenChars.join(', ')}; (erlaubt: a-z, .)`
      formInvalid = true
    } else if (await checkUsername(username.value)) {
      usernameError.value = 'Dieser Benutzername ist bereits vergeben'
      formInvalid = true
    } else {
      usernameError.value = ''
    }
  }

  if (!firstname.value.trim() || !lastname.value.trim()) {
    nameError.value = 'Vor- und Nachname dürfen nicht leer sein'
    formInvalid = true
  } else {
    nameError.value = ''
  }

  if (gender.value === '') {
    genderError.value = 'Bitte wähle ein Geschlecht aus'
    formInvalid = true
  } else {
    genderError.value = ''
  }

  if (formInvalid) {
    submitting.value = false
    return
  }

  await createTicket(code.value, new Ticket({
    username: username.value.trim(),
    firstname: firstname.value.trim(),
    lastname: lastname.value.trim(),
    gender: gender.value,
    prefer_lastname: preferLastname.value
  }))
  submitting.value = false
  back()
}
</script>

<style lang="scss" scoped>
.create-ticket {
  &__code-container {
    display: flex;
  }

  &__code-input {
    flex: 1 1 auto;
    text-align: left;
    padding-left: 1.5rem;
    letter-spacing: .5em;
    text-indent: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  &__code-generate-btn {
    padding: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    width: 5rem;
  }
}
</style>
