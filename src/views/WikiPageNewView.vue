<template>
  <Page>
    <template #title>
      Neue Seite
    </template>

    <FormContainer @submit.prevent="submit" :disabled="submitting">
      <FormGroup inline>
        <EmojiPicker v-model="icon" />
        <FloatingLabelInput label="Titel" v-model="title" />
      </FormGroup>
      <Btn type="submit">
        Seite erstellen
      </Btn>
    </FormContainer>
  </Page>
</template>

<script lang="ts" setup>
import EmojiPicker from '@/components/EmojiPicker.vue'
import FloatingLabelInput from '@/components/FloatingLabelInput.vue'
import { WikiPage } from '@/model/wiki'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const title = ref('')
const icon = ref('')

const submitting = ref(false)
async function submit () {
  submitting.value = true

  const page = await WikiPage.create({
    title: title.value,
    icon: 'bi-' + icon.value
  })

  router.push({
    name: 'wiki-page',
    params: { id: page.id }
  })
}
</script>
