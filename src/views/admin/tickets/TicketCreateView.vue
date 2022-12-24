<template>
  <Page>
    <template #title>
      Neues Ticket
    </template>

    <FloatingLabelInput label="Code" v-model="code" /><Btn @click="setRandomCode">Generate</Btn><br>
    <FloatingLabelInput label="Userame" v-model="username" /><br>
    <FloatingLabelInput label="Vorname" v-model="firstname" /><br>
    <FloatingLabelInput label="Nachname" v-model="lastname" /><br>
    Geschlecht: <Dropdown v-model="gender">
      <option value="male">männlich</option>
      <option value="female">weiblich</option>
      <option value="non-binary">divers</option>
    </Dropdown>
    Nur Nachname anzeigen:<br>
    <Toggle v-model="preferLastname" />
    <br>
    <Username
      :firstname="firstname"
      :lastname="lastname"
      :gender="gender"
      :preferLastname="preferLastname" />

    <Btn @click="submit">Ticket erstellen</Btn>
  </Page>
</template>

<script lang="ts" setup>
import FloatingLabelInput from '@/components/FloatingLabelInput.vue'
import { Ticket } from '@/model/ticket'
import { Gender } from '@/model/user'
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
const gender = ref(Gender.NonBinary)
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

async function submit () {
  await createTicket(code.value, new Ticket({
    username: username.value,
    firstname: firstname.value,
    lastname: lastname.value,
    gender: gender.value,
    prefer_lastname: preferLastname.value
  }))
  router.push('/admin/tickets')
}
</script>
