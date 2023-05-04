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

      <!-- <h3>Berechtigungen</h3>
      <FormContainer notAForm>
        <FormGroup inline v-for="(permission, id) in permissionInfo" :key="id">
          <label :for="id">
            <b v-if="permissions[id] !== actualPermissions[id]">{{ permission.name }}</b>
            <span v-else>{{ permission.name }}</span>
          </label>
          <span v-if="permissions[Permission.IsAdmin] && !currentUser.permissions[Permission.IsAdmin]">
            <span v-if="permissions[id] || permissions[Permission.IsAdmin]">Ja</span>
            <span v-else>Nein</span>
          </span>

          <Toggle
            :id="id"
            v-else
            :modelValue="permissions[id] || permissions[Permission.IsAdmin]"
            @update:modelValue="setPermission(id, $event)"
          />
        </FormGroup>
        <FormGroup inline v-if="permissionChanged">
          <Btn @click="confirmPermissionChanges">
            Speichern
          </Btn>
          <Btn @click="updateUser">
            Zurücksetzen
          </Btn>
        </FormGroup>
      </FormContainer> -->

      <!-- <h3>Aktionen</h3> -->

      <!-- <FormContainer notAForm>
        <Btn @click="showResetEmailSheet = true">Passwort zurücksetzen E-Mail senden</Btn>
        <Btn @click="showDeleteUserSheet = true">Benutzer löschen</Btn>
        <FormInfo :show="emailSent" type="success">
          <i class="bi-check" /> E-Mail wurde erfolgreich gesendet
        </FormInfo>
      </FormContainer> -->

      <SettingsList>
        <SettingsListDivider>Berechtigungen</SettingsListDivider>
        <SettingsListOption
          v-for="(permission, id) in permissionInfo"
          :key="id"
          :for="id"
        >
          <b v-if="permissions[id] !== actualPermissions[id]">{{ permission.name }}</b>
          <span v-else>{{ permission.name }}</span>

          <!-- <template #desc>
            {{ permissionInfo[id].description }}
          </template> -->

          <template #input>
            <span v-if="permissions[Permission.IsAdmin] && !currentUser.permissions[Permission.IsAdmin]">
              <span v-if="permissions[id] || permissions[Permission.IsAdmin]">Ja</span>
              <span v-else>Nein</span>
            </span>
            <Toggle
              :id="id"
              v-else
              :modelValue="permissions[id] || permissions[Permission.IsAdmin]"
              @update:modelValue="setPermission(id, $event)"
            />
          </template>
        </SettingsListOption>
        <div v-if="permissionChanged">
          <SettingsListDivider />
          <SettingsListLink isButton :arrow="false" @click="confirmPermissionChanges">
            Speichern
          </SettingsListLink>
          <SettingsListLink isButton :arrow="false" @click="updateUser">
            Zurücksetzen
          </SettingsListLink>
        </div>

        <SettingsListDivider>Aktionen</SettingsListDivider>
        <SettingsListLink :arrow="false" isButton @click="showResetEmailSheet = true">
          <i class="bi-send" /> Passwort zurücksetzen E-Mail senden
        </SettingsListLink>
        <SettingsListLink
          :arrow="false"
          isButton
          danger
          @click="showDeleteUserSheet = true"
        >
          <i class="bi-person-slash" /> Benutzer löschen
        </SettingsListLink>
      </SettingsList>

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
            <i class="bi-person-slash" /><b>{{ user?.username }}</b> löschen
          </ActionSheetButton>
          <ActionSheetButton class="danger">
            <i class="bi-x-lg" />Abbrechen
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
            <i class="bi-send" />E-Mail an <b>{{ email }}</b> senden
          </ActionSheetButton>
          <ActionSheetButton class="danger">
            <i class="bi-x-lg" />Abbrechen
          </ActionSheetButton>
        </template>
      </ActionSheet>

      <ActionSheet v-model:show="showMakeAdminSheet">
        <template #title>
          Zum Admin machen
        </template>

        Möchtest du wirklich <b>{{ user?.username }}</b> zum Admin machen?

        <template #buttons>
          <ActionSheetButton @click="permissions[Permission.IsAdmin] = true">
            <i class="bi-person-gear" /> <b>{{ user?.username }}</b> zum Admin machen
          </ActionSheetButton>
          <ActionSheetButton class="danger">
            <i class="bi-x-lg" />Abbrechen
          </ActionSheetButton>
        </template>
      </ActionSheet>
    </div>
  </Page>
</template>

<script lang="ts" setup>
import FloatingLabelInput from '@/components/FloatingLabelInput.vue'
import SettingsList from '@/components/SettingsList.vue'
import SettingsListLink from '@/components/SettingsListLink.vue'
import SettingsListDivider from '@/components/SettingsListDivider.vue'
import SettingsListOption from '@/components/SettingsListOption.vue'
import { Permission, permissionInfo as _permissionInfo, PermissionsDB } from '@/model/permissions'
import { User } from '@/model/user'
import { back } from '@/router'
import { useUser } from '@/stores/user'
import { deleteUser } from '@/utilities/admin'
import { getAuth, sendPasswordResetEmail } from '@firebase/auth'
import { doc, getDoc, getFirestore } from '@firebase/firestore'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const db = getFirestore()
const route = useRoute()

const currentUser = useUser()

const user = ref<User>()
const email = ref<string>()
const permissions = ref<PermissionsDB>({})
const actualPermissions = ref<PermissionsDB>({})
const permissionChanged = computed(() => {
  return JSON.stringify(permissions.value) !== JSON.stringify(actualPermissions.value)
})

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
  actualPermissions.value = await user.value?.getPermissions()
}

const showMakeAdminSheet = ref(false)
function setPermission (id: Permission, value: boolean) {
  if (id === Permission.IsAdmin) {
    if (currentUser.permissions.is_admin && value) {
      showMakeAdminSheet.value = true
    }
    return
  } else if (id === Permission.IsAdmin && !value) {
    permissions.value[id] = value
    return
  } else if (permissions.value[Permission.IsAdmin]) return

  permissions.value[id] = value
}
async function confirmPermissionChanges () {
  if (!permissionChanged.value) return
  await user.value?.setPermissions(permissions.value)
  actualPermissions.value = await user.value?.getPermissions()
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
async function sendResetEmail () {
  if (!email.value) return
  sendPasswordResetEmail(getAuth(), email.value)
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
