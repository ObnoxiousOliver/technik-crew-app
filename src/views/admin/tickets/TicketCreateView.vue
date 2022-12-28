<template>
  <Page>
    <template #title>
      Neues Ticket
    </template>

    <form @submit.prevent="submit" class="form">
      <div class="form__inline-group">
        <CodeInput class="create-ticket__code-input" v-model="code" />
        <Btn class="btn--square" type="button" @click="setRandomCode">
          <i class="bi-arrow-counterclockwise" />
        </Btn>
      </div>
      <div v-if="codeError" class="form__error">
        {{ codeError }}
      </div>
      <FloatingLabelInput label="Benutzername" v-model="username" />
      <div v-if="usernameError" class="form__error">
        {{ usernameError }}
      </div>
      <div class="form__group">
        <FloatingLabelInput label="Vorname" v-model="firstname" />
        <FloatingLabelInput label="Nachname" v-model="lastname" />
      </div>
      <div v-if="nameError" class="form__error">
        {{ nameError }}
      </div>
      <Dropdown id="gender" v-model="gender">
        <option value="">Geschlecht auswählen</option>
        <option value="non-binary">divers</option>
        <option value="male">männlich</option>
        <option value="female">weiblich</option>
      </Dropdown>
      <div v-if="genderError" class="form__error">
        {{ genderError }}
      </div>
      <div class="form__inline-group">
        <label for="preferLastname" class="form__label">
          Nur Nachname anzeigen:
        </label>
        <Toggle id="preferLastname" v-model="preferLastname" />
      </div>
      <div class="form__inline-group">
        <div class="form__label">
          Anzeigename:
        </div>
        <Username
          :firstname="firstname"
          :lastname="lastname"
          :gender="gender"
          :preferLastname="preferLastname"
        />
      </div>

      <Btn class="form__submit" @click="submit">Ticket erstellen</Btn>
    </form>
  </Page>
</template>

<script lang="ts" setup>
import FloatingLabelInput from '@/components/FloatingLabelInput.vue'
import CodeInput from '@/components/CodeInput.vue'
import { Ticket } from '@/model/ticket'
import { createTicket, encryptTicket } from '@/utilities/auth'
import { doc, getDoc, getFirestore } from '@firebase/firestore'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const db = getFirestore()
const router = useRouter()

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
    console.log(num, nums[i - 1])
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

const codeError = ref('')
const usernameError = ref('')
const nameError = ref('')
const genderError = ref('')
async function submit () {
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
    usernameError.value = ''
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

  if (formInvalid) return

  await createTicket(code.value, new Ticket({
    username: username.value.trim(),
    firstname: firstname.value.trim(),
    lastname: lastname.value.trim(),
    gender: gender.value,
    prefer_lastname: preferLastname.value
  }))
  router.push('/admin/tickets')
}
</script>

<style lang="scss" scoped>
.create-ticket {
  &__form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__code-input {
    font-size: 1rem;
    text-align: left;
    padding: .875rem .5rem .875rem 1.5rem;
    letter-spacing: .5em;
    text-indent: 0;
  }
}
</style>
