<template>
  <Page>
    <template #title>
      Neue Seite
    </template>

    <p
      ref="p"
      class="rainbow-text"
      :style="{
        '--progress': progress,
      }"
    >
      Gib einen Titel ein und schreibe ein oder mehrere Emoji an den Anfang.
      Das Emoji wird als Icon für die Seite verwendet{{ icon ? ': ' + icon : '.' }}
    </p>

    <FormContainer @submit.prevent="submit" :disabled="submitting">
      <FloatingLabelInput label="Titel" v-model="title" />
      <Btn type="submit">
        Seite erstellen
      </Btn>
    </FormContainer>
  </Page>
</template>

<script lang="ts" setup>
import FloatingLabelInput from '@/components/FloatingLabelInput.vue'
import FormContainer from '@/components/FormContainer.vue'
import { WikiPage } from '@/model/wiki'
import { splitFirstEmojiFromString } from '@/utilities/getFirstEmojiOfString'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const p = ref<HTMLElement | null>(null)
const progress = ref(0)
const time = ref(0)
onMounted(() => {
  const interval = setInterval(() => {
    if (!p.value) return

    // Give every letter in p a rainbow color
    const letters = p.value?.innerText.split('') ?? []
    // generate a rainbow of colors
    p.value.innerHTML = letters.map((letter) => {
      const span = document.createElement('span')
      span.innerText = letter
      return span.outerHTML
    }).join('')
    const colors = Array.from({ length: letters.length }, (_, i) => {
      const hue = i / letters.length * 360 * 2.5 + time.value / 20
      return (a: number) => `hsl(${hue}, 100%, ${50 + 50 * (1 - a)}%)`
    })
    p.value?.querySelectorAll('span').forEach((span, i) => {
      span.style.color = colors[i](progress.value)
    })
    time.value += 100
    progress.value = Math.min((time.value / 50000) ** 2, 1)
  }, 100)

  onBeforeUnmount(() => {
    clearInterval(interval)
  })
})

const title = ref('')
const icon = computed(() => splitFirstEmojiFromString(title.value)?.[0] ?? '')

const submitting = ref(false)
async function submit () {
  submitting.value = true

  const emojiTitle = splitFirstEmojiFromString(title.value)
  const page = await WikiPage.create({
    title: emojiTitle?.[1] ?? title.value,
    icon: emojiTitle?.[0] ?? null
  })

  router.push({
    name: 'wiki-page',
    params: { id: page.id }
  })
}
</script>

<style lang="scss" scoped>
</style>
