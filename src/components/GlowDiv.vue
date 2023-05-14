<template>
  <div
    class="glow"
    ref="root"
    :style="{
      '--glow-spread': `${spread ?? 1}`,
      '--glow-opacity': `${opacity ?? .5}`
    }"
  >
    <div class="glow__glow" ref="glow" v-html="html" />
    <div class="glow__glow" ref="glow" v-html="html" />
    <div class="glow__glow" ref="glow" v-html="html" />
    <div class="glow__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

defineProps<{
  spread?: number
  opacity?: number
}>()

const root = ref<HTMLElement>()
const html = ref('')

function update () {
  if (!root.value) return
  const clone = root.value.cloneNode(true) as HTMLElement
  clone.querySelectorAll('.glow__glow').forEach((el) => {
    el.remove()
  })
  html.value = clone.innerHTML
}

onMounted(() => {
  if (!root.value) return

  const observer = new MutationObserver(update)

  observer.observe(root.value, {
    childList: true,
    subtree: true,
    attributeFilter: ['class']
  })
  update()

  onBeforeUnmount(() => {
    observer.disconnect()
  })
})
</script>

<style lang="scss" scoped>
.glow {
  position: relative;

  &__glow {
    position: absolute;
    inset: 0;
    pointer-events: none;
    mix-blend-mode: screen;

    @for $i from 1 through 3 {
      &:nth-child(#{$i}) {
        filter: blur(calc(#{$i * $i / 4}rem * var(--glow-spread)));
        opacity: calc(#{($i * 1 / 3)} * var(--glow-opacity));
      }
    }
  }

  &__content {
    position: relative;
    z-index: 1;
  }
}
</style>
