<template>
  <Page>
    <template #title>
      Neue Seite
    </template>

    <p ref="p" class="rainbow-text" :style="{
      '--progress': progress,
    }">
      Gib einen Titel ein und schreibe ein Emoji an erster Stelle.
      Das Emoji wird als Icon für die Seite verwendet{{ icon ? ': ' + icon : '.' }}
    </p>

    <FormContainer @submit.prevent="submit" :disabled="submitting">
      <FormGroup inline>
        <FloatingLabelInput label="Titel" v-model="title" />
      </FormGroup>
      <Btn type="submit">
        Seite erstellen
      </Btn>
    </FormContainer>
  </Page>
</template>

<script lang="ts" setup>
import FloatingLabelInput from '@/components/FloatingLabelInput.vue'
import { WikiPage } from '@/model/wiki'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const p = ref<HTMLElement | null>(null)
const progress = ref(0)
const time = ref(0)
onMounted(() => {
  const interval = setInterval(() => {
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
      return (a) => `hsl(${hue}, 100%, ${50 + 50 * (1 - a)}%)`
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
const icon = computed(() => {
  const match = title.value.match(/\p{Emoji_Presentation}/gu)
  console.log(match)

  if (match && title.value.trim().indexOf(match[0]) === 0) {
    return match[0]
  }
  return null
})

const submitting = ref(false)
async function submit () {
  submitting.value = true

  const page = await WikiPage.create({
    title: title.value.replace(icon.value, '').trim(),
    icon: icon.value
  })

  router.push({
    name: 'wiki-page',
    params: { id: page.id }
  })
}
</script>

<style lang="scss" scoped>
</style>
