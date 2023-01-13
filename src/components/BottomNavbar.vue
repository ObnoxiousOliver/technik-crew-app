<template>
  <nav
    ref="nav"
    class="bottom-nav"
    :style="{
      '--active': active,
      '--total': buttons.length,
      '--width': width + 'px'
    }"
  >
    <BottomNavBtn
      v-for="(btn, i) in buttons"
      :key="btn.to"
      :icon="btn.icon"
      :to="btn.to"
      @click="click(i)"
    />
    <div class="bottom-nav__filled-icons__mask" />
    <div class="bottom-nav__filled-icons">
      <div
        class="bottom-nav__filled-icons__icon"
        v-for="btn in buttons"
        :key="btn.to"
      >
        <i :class="`bi-${btn.icon}-fill`"></i>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import BottomNavBtn from './BottomNavBtn.vue'

const props = defineProps({
  buttons: Array
})

const route = useRoute()
onBeforeRouteUpdate(() => {
  active.value = props.buttons?.findIndex(btn => btn.to.name === route.name)
})

const active = ref(0)
active.value = props.buttons?.findIndex(btn => btn.to.name === route.name)
function click (index: number) {
  active.value = index
}

const nav = ref<HTMLElement>()
const width = ref(0)
onMounted(() => {
  const observer = new ResizeObserver(() => {
    width.value = nav.value?.getBoundingClientRect().width ?? 0
  })

  observer.observe(nav.value)

  onBeforeUnmount(() => {
    observer.disconnect()
  })
})
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.bottom-nav {
  z-index: 100;
  position: fixed;
  inset: auto 1rem 1rem;
  display: flex;
  overflow: hidden;
  height: 3rem;
  border-radius: r.$radius;
  background: rgba(r.$bg-secondary, 0.8);
  backdrop-filter: blur(1rem);
  max-width: 20rem;
  margin: 0 auto;

  &__filled-icons {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    color: r.$bg-primary;
    pointer-events: none;
    clip-path: inset(
      0
      calc(((var(--width) / var(--total) - 2.2rem) / 2) + var(--width) / var(--total) * (var(--total) - var(--active) - 1))
      0
      calc(((var(--width) / var(--total) - 2.2rem) / 2) + var(--width) / var(--total) * var(--active))
    );

    transition: clip-path .5s cubic-bezier(0.19, 1, 0.22, 1);

    &__icon {
      position: relative;
      flex: 1 1 auto;
      text-align: center;
    }

    &__mask {
      position: absolute;
      height: 100%;
      width: calc(100% / var(--total));

      transform: translateX(calc(var(--active, 0) * 100%));

      transition: transform .5s cubic-bezier(0.19, 1, 0.22, 1);

      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 2.2rem;
        height: 2.2rem;
        transform: translate(-50%, -50%);
        background: r.$text-primary;
        border-radius: r.$radius;
      }
    }
  }
}
</style>
