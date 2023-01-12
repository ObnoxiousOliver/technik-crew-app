<template>
  <RouterView class="router" v-slot="{ Component }">
      <template v-if="Component">
        <Transition :name="route.meta.transitionName">
          <component :is="Component"></component>
        </Transition>
      </template>
  </RouterView>
  <div id="layer"></div>
</template>

<script lang="ts" setup>
import { deleteUser, getAuth, onAuthStateChanged } from '@firebase/auth'
import { doc, getDoc, getFirestore } from '@firebase/firestore'
import { createPinia } from 'pinia'
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { setStore, signOut } from './utilities/auth'

const route = useRoute()
const router = useRouter()

const db = getFirestore()
const auth = getAuth()

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (!user && route.meta.requireAuth) {
      router.push({
        path: '/login',
        query: { redirect: route.fullPath }
      })
    }
    if (user) {
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

  inset: 0 0 env(keyboard-inset-height, 0) 0;

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

$transition: .5s cubic-bezier(0.19, 1, 0.22, 1);
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
</style>
