<template>
  <RouterView :class="['router', {
    'router--has-navbar': showNavbar,
  }]" v-slot="{ Component }">
      <template v-if="Component">
        <Transition :name="route.meta.transitionName">
          <component :is="Component"></component>
        </Transition>
      </template>
  </RouterView>

  <Transition name="mask">
    <div v-if="showNavbar" class="mask" />
  </Transition>
  <Transition name="navbar">
    <Navbar v-if="showNavbar" :buttons="[
      { to: 'wiki', icon: 'compass' },
      { to: 'events', icon: 'calendar-week' },
      { to: 'dashboard', icon: 'house-door' },
      { to: 'equipment', icon: 'speaker' },
      { to: 'settings', icon: 'gear' },
    ]" />
  </Transition>

  <div id="layer"></div>
</template>

<script lang="ts" setup>
import Navbar from './components/BottomNavbar.vue'
import { deleteUser, getAuth, onAuthStateChanged } from '@firebase/auth'
import { doc, getDoc, getFirestore } from '@firebase/firestore'
import { createPinia } from 'pinia'
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { setStore, signOut } from './utilities/auth'

const route = useRoute()
const router = useRouter()

const showNavbar = computed(() => ['dashboard', 'wiki', 'events', 'equipment', 'settings'].includes(route.meta.root))

const db = getFirestore()
const auth = getAuth()

const keyboardOpen = ref(false)

if (Capacitor.getPlatform() !== 'web') {
  Keyboard.addListener('keyboardWillShow', () => {
    keyboardOpen.value = true
  })
  Keyboard.addListener('keyboardWillHide', () => {
    keyboardOpen.value = false
  })
}

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      localStorage.removeItem('last_auth')
      localStorage.removeItem('last_user')

      if (route.meta.requiresAuth) {
        router.replace({
          path: '/login',
          query: { redirect: route.fullPath }
        })
      }
    }
    if (user) {
      localStorage.setItem('last_auth', 'true')
      setStore()
      if (!(await getDoc(doc(db, 'usernames', user.uid))).exists()) {
        router.push('/')
        // Delete user if user doesn't exist in database
        await deleteUser(user).catch(err => console.error(err))
        console.log('[Auth]', 'Deleted user', user.uid)
        await signOut()
      }
    }
  })
})

const pinia = createPinia()

watch(pinia.state, () => {
  localStorage.setItem('store', pinia.state.value)
})
</script>

<style lang="scss">
@use './scss' as r;

@import url('https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
*, ::before, ::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

:root, body {
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

  // inset: 0 0 env(keyboard-inset-height, 0) 0;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  overflow: hidden;
  max-width: 30rem;
  margin: 0 auto;
}

#layer {
  position: absolute;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
}

p {
  margin-bottom: 1rem;
  line-height: 1.5;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  margin: 1.5rem 0 1rem;
}

.text-secondary {
  color: r.$text-secondary;
}

:focus {
  outline: none;
}

:focus-visible {
  outline: r.$accent solid 2px;
}

.danger {
  color: r.$danger;
}
.success {
  color: r.$success;
}

.table {
  width: 100%;
  word-break: break-word;
  hyphens: auto;

  td:not(:first-child), th:not(:first-child) {
    text-align: right;
  }

  tr:not(:last-child):not(:first-child) {
    td, th {
      padding: .5rem 0;
    }
  }

  tr:first-child {
    th, td {
      padding-bottom: .5rem;
    }
  }

  tr:last-child {
    th, td {
      padding-top: .5rem;
    }
  }
}

a {
  position: relative;
  color: r.$accent;
  transition: .2s;

  &:hover {
    color: lighten(r.$accent, 30);
  }

  &::before {
    content: '';
    position: absolute;
    inset: -.5rem;
    border-radius: r.$radius;
    transition: .2s;
    pointer-events: none;
  }

  &:focus-visible {
    color: r.$accent !important;
    outline: none;

    &::before {
      box-shadow: r.$focus;
    }
  }
}

.scroller-padding {
  padding: 0 1.5rem 1rem;
  scroll-padding: 0 1.5rem 1rem;
  scroll-behavior: smooth;
}

.router {
  &--has-navbar {
    .scroller-padding {
      padding-bottom: 5rem;
      scroll-padding-bottom: 5rem;
    }
  }
}

$transition: .5s cubic-bezier(0.19, 1, 0.22, 1);
.mask {
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
</style>
