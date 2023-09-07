<template>
  <!-- <div class="titlebar" v-if="platform === 'windows'">
    <div class="titlebar__content">
      Technik Crew
    </div>

    <Btn @click="router.push({
      name: 'settings'
    })" class="titlebar__button">
      <i class="bi-gear" />
    </Btn>
  </div> -->

  <Transition name="sidebar">
    <aside
      v-if="showNavigation && bp.mode === 'desktop'"
      class="sidebar"
    >
      <!-- <RouterView
        name="navbar"
        class="sidebar-router"
        v-slot="{ Component }"
      > -->
      <!-- <template v-if="Component">
          <Transition :name="route.meta.transitionName">
            <component :is="Component" />
          </Transition>
        </template> -->
      <DesktopSidebar />
      <!-- </RouterView> -->
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
        <Transition :name="route.meta.transitionName as (string | undefined)">
          <Component :is="Component" />
        </Transition>
      </template>
    </RouterView>
  </div>

  <!-- Mobile Navbar -->
  <Transition name="mobile-navbar-mask">
    <div v-if="showNavigation && bp.mode === 'mobile'" class="mobile-navbar-mask" />
  </Transition>
  <Transition name="navbar">
    <MobileNavbar
      v-if="showNavigation && bp.mode === 'mobile'"
      :buttons="[
        { to: 'wiki', icon: 'compass' },
        { to: 'events', icon: 'calendar2-week' },
        { to: 'dashboard', icon: 'house-door' },
        { to: 'inventory', icon: 'box-seam' },
        { to: 'settings', icon: 'gear' },
      ]"
    />
  </Transition>

  <div id="layer" />

  <div class="toasts">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="toast"
    >
      {{ toast.msg }}
    </div>
  </div>

  <Teleport to="body">
    <Transition name="network-indicator">
      <div v-if="showNetworkIndicator" class="network-indicator">
        <template v-if="isOffline">
          <i class="bi-wifi-off" />App ist im Offline-Modus
          <RouterLink :to="{ name: 'help-offline', query: { back: route.fullPath } }">
            Mehr Infos <i class="bi-arrow-right" />
          </RouterLink>
        </template>
        <template v-else>
          <i class="bi-wifi" />Wieder online
        </template>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import MobileNavbar from '../components/BottomNavbar.vue'
import DesktopSidebar from '../components/DesktopSidebar.vue'
import { useBreakpoint } from '../utilities/breakpoint'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from '@/utilities/toast'
import { createId } from '@/utilities/id'
import { useOffline } from '@/utilities/offline'

const route = useRoute()

const isOffline = useOffline()
const _showNetworkIndicator = ref(false)
const showNetworkIndicator = computed(() => {
  if (route.meta.root === 'login') return false
  return _showNetworkIndicator.value
})

watch(isOffline, (offline) => {
  _showNetworkIndicator.value = offline

  if (offline) {
    document.documentElement.classList.add('offline')
  } else {
    document.documentElement.classList.remove('offline')
  }
}, { immediate: true, flush: 'post' })

const bp = useBreakpoint()

const showNavigation = computed(() => ['dashboard', 'wiki', 'events', 'inventory', 'settings'].includes(route.meta.root as string))

const toasts = ref<{
  id: string
  msg: string
}[]>([])
onBeforeUnmount(useToast().onShow((msg) => {
  toasts.value.push({
    id: createId(),
    msg
  })
  setTimeout(() => {
    toasts.value.shift()
  }, 3000)
}))
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
  overflow: hidden;
  user-select: none;
}

input,
textarea,
[contenteditable] {
  user-select: text;
}

$offlineIndicatorOutDelay: 1s;
$offlineIndicatorOutDuration: 3s;

#app {
  position: fixed;
  inset: var(--titlebar-height, 0) 0 0;
  inset: var(--titlebar-height, 0) 0 env(keyboard-inset-height, 0) 0;

  display: flex;
  margin: 0 auto;

  transition: top $offlineIndicatorOutDuration $offlineIndicatorOutDelay cubic-bezier(0.19, 1, 0.22, 1);

  .offline & {
    top: 1.5rem;
    transition: .5s cubic-bezier(0.19, 1, 0.22, 1);
  }
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

.mobile ::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.network-indicator {
  position: relative;
  z-index: 9999;
  text-align: center;
  height: 1.5rem;
  line-height: 1.5rem;
  font-size: .8rem;
  box-shadow: r.$bg-stroke 0 -1px 0 inset;
  color: r.$success;

  .offline & {
    color: r.$danger;
  }

  a {
    text-decoration: none;
  }

  & > i:first-child {
    margin-right: .5rem;
  }

  &-enter-active {
    transition: .5s cubic-bezier(0.19, 1, 0.22, 1);
  }

  &-leave-active {
    transition: $offlineIndicatorOutDuration $offlineIndicatorOutDelay cubic-bezier(0.19, 1, 0.22, 1);
  }

  &-enter-from, &-leave-to {
    transform: translateY(-100%);
  }
}

.window-content {
  flex: 1;
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

.toasts {
  z-index: 999;
  position: absolute;
  bottom: 5rem;
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  flex-direction: column;
  gap: .5rem;
  align-items: center;
  pointer-events: none;

  .toast {
    padding: .5rem 1rem;
    border-radius: .5rem;
    background: r.$bg-secondary;
    box-shadow: #000a 0 0 1rem;
    color: r.$text-primary;
    max-width: 20rem;
    text-align: center;
    pointer-events: auto;

    &-enter-active,
    &-leave-active {
      transition: $transition;
    }

    &-enter-from,
    &-leave-to {
      opacity: 0;
      transform: translateY(1rem);
    }
  }
}

.mobile-navbar-mask {
  z-index: 99;
  position: fixed;
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
