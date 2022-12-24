<template>
  <Page>
    <template #title>
      Guten morgen, <Username :user="ticketStore.currentTicket" :full="true" />!
    </template>
    <form @submit.prevent="submit" class="sign-up-email__form">
      <div>
        <p>
          <i class="text-secondary">
            <span v-if="12 <= timeOfDay && timeOfDay < 13">(ich weiß, ich weiß es ist Mittag)</span>
            <span v-if="13 <= timeOfDay && timeOfDay < 17">(ich weiß, ich weiß es ist Nachmittag)</span>
            <span v-if="17 <= timeOfDay && timeOfDay < 20">(ich weiß, ich weiß es ist Abend)</span>
            <span v-if="20 <= timeOfDay && timeOfDay < 24">(ich weiß, ich weiß es ist Nacht)</span>
            <span v-if="0 <= timeOfDay && timeOfDay < 6">(ich weiß, ich weiß es ist Nacht)</span>
          </i>
        </p>
        <p>
          Also {{ ticketStore.currentTicket?.firstname }}, ich werde dich auf dem Weg zu deinem ganz eigenen Profil führen. <br>
          Die erste Hürde: Deine E-Mail</p>
        <p>Auf die E-Mail, die du angibst, solltest du Zugriff haben. Und nein, keine Sorge, wir werden dich <b>NICHT</b> mit einem Newsletter zu müllen. Die E-Mail dient nur für dein Profilmanagement.</p>
      </div>
      <div class="sign-up-email__error">
        {{ errorMsg }}
      </div>
      <FloatingLabelInput
        type="email"
        autocomplete="email"
        v-model="email"
        required
        label="E-Mail"
      />
      <Btn type="submit">
        Weiter
      </Btn>
    </form>
  </Page>
</template>

<script lang="ts" setup>
import { useTicket } from '@/stores/ticket'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import FloatingLabelInput from '@/components/FloatingLabelInput.vue'
import { getAuth, signInWithEmailAndPassword, signOut } from '@firebase/auth'

const router = useRouter()

const ticketStore = useTicket()
const timeOfDay = ref(0)

const errorMsg = ref(null)

onMounted(() => {
  if (!ticketStore.currentTicket) {
    router.replace('/sign-up/code')
  }

  timeOfDay.value = new Date().getHours()
})

const email = computed({
  get: () => ticketStore.email,
  set: (val) => { ticketStore.email = val }
})
async function submit () {
  try {
    // Will always catch
    await signInWithEmailAndPassword(getAuth(), email.value, '/')
    // When it didn't catch, something went very wrong!
    console.error('Something went very wrong!')
    await signOut()
  } catch (err) {
    if (err.code === 'auth/wrong-password') {
      errorMsg.value = 'Diese E-Mail wird bereits verwendet'
      return
    }
    router.push('/sign-up/password')
  }
}
</script>

<style lang="scss" scoped>
@use '../../../scss' as r;

.sign-up-email {
  &__form {
    display: flex;
    flex-flow: column nowrap;
    gap: 1rem;
  }

  &__error {
    color: r.$danger;
  }
}
</style>
