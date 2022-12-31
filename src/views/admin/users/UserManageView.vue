<template>
  <Page>
    <template #title>
      <Username v-if="user" :user="user" :full="true" />
      <span v-else>{{ route.params.username.replace('.', ' ') }}</span>
    </template>

    <Spinner v-if="loading" />
    <div v-else>
      <table class="table">
        <tr>
          <td>Benutzername</td>
          <td>{{ user?.username }}</td>
        </tr>
        <tr>
          <td>E-Mail</td>
          <td>{{ email }}</td>
        </tr>
        <tr>
          <td>Vorname</td>
          <td>{{ user?.firstname }}</td>
        </tr>
        <tr>
          <td>Nachname</td>
          <td>{{ user?.lastname }}</td>
        </tr>
        <tr>
          <td>Geschlecht</td>
          <td>{{ {
            'male': 'männlich',
            'female': 'weiblich',
            'non-binary': 'divers'
          }[user?.gender] }}</td>
        </tr>
      </table>

      <h3>Berechtigungen</h3>
      <table class="table">
        <tr v-for="(permission, id) in permissionInfo" :key="id">
          <td>{{ permission.name }}</td>
          <td>
            <span v-if="permissions[id]">Ja</span>
            <span v-else>Nein</span>
          </td>
        </tr>
      </table>

      <FormContainer notAForm>
        <Btn @click="showResetEmailSheet = true">Passwort zurücksetzen E-Mail senden</Btn>
        <Btn @click="showDeleteUserSheet = true">Benutzer löschen</Btn>
        <FormInfo :show="emailSent" type="success">
          <i class="bi-check" /> E-Mail wurde erfolgreich gesendet
        </FormInfo>
      </FormContainer>

      <ActionSheet v-model:show="showDeleteUserSheet">
        <template #title>
          {{ user?.username }} löschen
        </template>

        <p>
          Möchtest du wirklich den Benutzer <b>{{ user?.username }}</b> löschen?
        </p>
        <p>
          Dieser Vorgang kann nicht rückgängig gemacht werden. Alle Daten des Benutzers werden unwiderruflich gelöscht.
        </p>
        <p>
          Um den Benutzer zu löschen, bestätige bitte den Benutzernamen:
        </p>

        <FloatingLabelInput
          label="Benutzername bestätigen"
          class="dark delete-user-input"
          v-model="deleteUserInput"
        />

        <template #buttons>
          <ActionSheetButton
            @click="_deleteUser"
            :disabled="user?.username !== deleteUserInput"
            class="danger"
          >
            <i class="bi-person-slash"/><b>{{ user?.username }}</b> löschen
          </ActionSheetButton>
          <ActionSheetButton class="danger">
            <i class="bi-x-lg"/>Abbrechen
          </ActionSheetButton>
        </template>
      </ActionSheet>

      <ActionSheet v-model:show="showResetEmailSheet">
        <template #title>
          Passwort zurücksetzen E-Mail senden
        </template>

        Möchtest du wirklich eine E-Mail zum Zurücksetzen des Passworts an <b>{{ email }}</b> senden?

        <template #buttons>
          <ActionSheetButton @click="sendResetEmail">
            <i class="bi-send"/>E-Mail an <b>{{ email }}</b> senden
          </ActionSheetButton>
          <ActionSheetButton class="danger">
            <i class="bi-x-lg"/>Abbrechen
          </ActionSheetButton>
        </template>
      </ActionSheet>
    </div>
  </Page>
</template>

<script lang="ts" setup>
import FloatingLabelInput from '@/components/FloatingLabelInput.vue'
import { permissionInfo as _permissionInfo, PermissionsDB } from '@/model/permissions'
import { User } from '@/model/user'
import { back } from '@/router'
import { deleteUser } from '@/utilities/admin'
import { getAuth, sendPasswordResetEmail } from '@firebase/auth'
import { doc, getDoc, getFirestore } from '@firebase/firestore'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const db = getFirestore()
const route = useRoute()

const user = ref<User>()
const email = ref<string>()
const permissions = ref<PermissionsDB>({})

const permissionInfo = _permissionInfo

const loading = ref(true)

onMounted(async () => {
  await updateUser()
  loading.value = false
})
async function updateUser () {
  user.value = new User((await getDoc(doc(db, 'users', route.params.username))).data())
  email.value = await user.value?.getEmail()
  permissions.value = await user.value?.getPermissions()
}

const showDeleteUserSheet = ref(false)
const deleteUserInput = ref('')
async function _deleteUser () {
  if (!user.value) return
  if (user.value.username !== deleteUserInput.value) return
  await deleteUser(user.value)
  back()
}

const showResetEmailSheet = ref(false)
const emailSent = ref(false)
async function sendResetEmail () {
  emailSent.value = false
  if (!email.value) return
  sendPasswordResetEmail(getAuth(), email.value)
  emailSent.value = true
}
</script>

<style lang="scss" scoped>
.table {
  margin-bottom: 2rem;
}

.delete-user-input {
  // margin-top: 1rem;
  width: 100%;
}
</style>
