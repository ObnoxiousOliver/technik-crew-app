<template>
  <div class="titlebar" v-if="platform === 'windows'">
    <div class="titlebar__content">
      Technik Crew
    </div>

    <Btn @click="router.push({
      name: 'settings'
    })" class="titlebar__button">
      <i class="bi-gear" />
    </Btn>
  </div>

  <Transition name="sidebar">
    <aside
      v-if="showNavigation && bp.mode === 'desktop'"
      class="sidebar"
    >
      <RouterView
        name="navbar"
        class="sidebar-router"
        v-slot="{ Component }"
      >
        <template v-if="Component">
          <Transition :name="route.meta.transitionName">
            <component :is="Component" />
          </Transition>
        </template>
        <DesktopSidebar v-else/>
      </RouterView>
    </aside>
  </Transition>

  <div class="window-content">
    <RouterView
      :class="['router', {
        'router--has-navbar': showNavigation && bp.mode === 'mobile',
        'router--has-sidebar': showNavigation && bp.mode === 'desktop',
      }]"
      v-slot="{ Component }"
    >
      <template v-if="Component">
        <Transition :name="route.meta.transitionName">
          <component :is="Component" />
        </Transition>
      </template>
    </RouterView>
  </div>

  <!-- Mobile Navbar -->
  <Transition name="mobile-navbar-mask">
    <div v-if="showNavigation && bp.mode === 'mobile'" class="mobile-navbar-mask" />
  </Transition>
  <Transition name="navbar">
    <MobileNavbar v-if="showNavigation && bp.mode === 'mobile'" :buttons="[
      { to: 'wiki', icon: 'compass' },
      { to: 'events', icon: 'calendar2-week' },
      { to: 'dashboard', icon: 'house-door' },
      { to: 'equipment', icon: 'speaker' },
      { to: 'settings', icon: 'gear' },
    ]" />
  </Transition>

  <div id="layer" />
</template>

<script lang="ts" setup>
import MobileNavbar from '../components/BottomNavbar.vue'
import DesktopSidebar from '../components/DesktopSidebar.vue'
import { useBreakpoint } from '../utilities/breakpoint'
import { computed, ref } from 'vue'
import { Capacitor } from '@capacitor/core'
import { Keyboard } from '@capacitor/keyboard'
import { useRoute, useRouter } from 'vue-router'
import { getPlatform } from '@/utilities/platform'

const route = useRoute()
const router = useRouter()
const bp = useBreakpoint()

const platform = getPlatform()

const showNavigation = computed(() => ['dashboard', 'wiki', 'events', 'equipment', 'settings'].includes(route.meta.root))
const keyboardOpen = ref(false)

if (Capacitor.getPlatform() !== 'web') {
  Keyboard.addListener('keyboardWillShow', () => {
    keyboardOpen.value = true
  })
  Keyboard.addListener('keyboardWillHide', () => {
    keyboardOpen.value = false
  })
}

function updateZoomLevel () {
  if (platform === 'windows') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const zoomFactor = (window.electron as any).getZoomFactor()
    document.documentElement.style.setProperty('--zf', zoomFactor)
    document.documentElement.style.setProperty('--titlebar-height', 40 / zoomFactor + 'px')
  }
}
window.addEventListener('resize', updateZoomLevel)
updateZoomLevel()
</script>

<style lang="scss">
@use '../scss' as r;

@import url('https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
*, ::before, ::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

body {
  background: r.$bg-primary;
  color: r.$text-primary;
  font-family: Rubik, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  user-select: none;
  overflow: hidden;
}

#app {
  position: fixed;
  inset: var(--titlebar-height, 0) 0 0;
  inset: var(--titlebar-height, 0) 0 env(keyboard-inset-height, 0) 0;

  display: flex;
  margin: 0 auto;
}

#layer {
  position: absolute;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
}

.scroller-padding {
  padding: 0 1.5rem 1rem;
  scroll-padding: 0 1.5rem 1rem;
  scroll-behavior: smooth;
}

@media (hover: hover) {
  ::-webkit-scrollbar {
    width: 1rem;
    height: 1rem;
  }
  ::-webkit-scrollbar-thumb {
    background: r.$text-secondary;
    border-radius: .5rem;
    border: transparent solid .45rem;
    background-clip: padding-box;
  }
}

.window-content {
  flex: 1 1 auto;
  position: relative;
  overflow: hidden;
  margin: 0 auto;
  max-width: 100rem;
}

.router {
  &--has-navbar {
    .scroller-padding {
      padding-bottom: 5rem;
      scroll-padding-bottom: 5rem;
    }
  }
}
</style>

<style lang="scss" scoped>
@use '../scss' as r;

$transition: .5s cubic-bezier(0.19, 1, 0.22, 1);
.titlebar {
  position: fixed;
  z-index: 9999;
  inset: 0 calc((46px * 3 - 1px) / var(--zf, 1)) auto 0;
  height: var(--titlebar-height);
  font-size: calc(1rem / var(--zf, 1));
  -webkit-app-region: drag;

  display: flex;
  align-items: center;

  &__content {
    flex: 1 1 auto;
    padding: 0 1rem;
  }

  &__button {
    width: calc(30px / var(--zf, 1));
    height: calc(30px / var(--zf, 1));

    padding: 0 !important;
    border-radius: .75em !important;
    font-size: .8em !important;
    background: none;

    -webkit-app-region: no-drag;
    cursor: pointer;
  }
}

.sidebar {
  width: 16rem;
  background: r.$bg-secondary;
  box-shadow: r.$bg-secondary calc(-1 * var(--titlebar-height)) 0 0 var(--titlebar-height);

  &-enter-active,
  &-leave-active {
    transition: $transition;
  }

  &-enter-from,
  &-leave-to {
    transform: translateX(-100%);
    margin-right: -16rem;
  }
}

.mobile-navbar-mask {
  z-index: 99;
  position: absolute;
  inset: auto 0 0;
  height: 5rem;
  background: linear-gradient(transparent, rgba(r.$bg-primary, 0.3), rgba(r.$bg-primary, 0.66), rgba(r.$bg-primary, 0.9), r.$bg-primary);
  pointer-events: none;

  &-enter-active,
  &-leave-active {
    transition: $transition;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
}
.navbar {
  &-enter-active,
  &-leave-active {
    transition: $transition;
  }

  &-enter-from,
  &-leave-to {
    transform: translateY(5rem);
  }
}

.slide-left {
  &-enter-active {
    z-index: 1;
    transition: $transition;
  }
  &-enter-from {
    transform: translateX(100%);
  }
  &-leave-active {
    transition: $transition;
  }
  &-leave-to {
    transform: translateX(-20%);
  }
}
.slide-right {
  &-leave-active {
    z-index: 1;
    transition: $transition;
  }
  &-leave-to {
    transform: translateX(100%);
  }
  &-enter-active {
    transition: $transition;
  }
  &-enter-from {
    transform: translateX(-20%);
  }
}

.linear-slide-left {
  &-enter-active {
    z-index: 1;
    transition: $transition;
  }
  &-enter-from {
    transform: translateX(100%);
  }
  &-leave-active {
    transition: $transition;
  }
  &-leave-to {
    transform: translateX(-100%);
  }
}
.linear-slide-right {
  &-enter-active {
    z-index: 1;
    transition: $transition;
  }
  &-enter-from {
    transform: translateX(-100%);
  }
  &-leave-active {
    transition: $transition;
  }
  &-leave-to {
    transform: translateX(100%);
  }
}

.desktop-root-slide {
  &-enter-active {
    transition: $transition;
  }
  &-leave-active {
    transition: $transition;
  }

  &-enter-from {
    opacity: 0;
    transform: translateY(10%);
  }
  &-leave-to {
    opacity: 0;
  }
}
</style>
