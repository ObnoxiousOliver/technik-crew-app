<template>
  <AppLayout />
</template>

<script lang="ts" setup>
import AppLayout from './layout/AppLayout.vue'
import { getAuth, onAuthStateChanged } from '@firebase/auth'
import { doc, getDoc, getFirestore } from '@firebase/firestore'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { setStore, signOut } from './utilities/auth'
import { useUsers } from './stores/users'

useUsers()
const route = useRoute()
const router = useRouter()

const db = getFirestore()
const auth = getAuth()

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
        // await deleteUser(user).catch(err => console.error(err))
        // console.log('[Auth]', 'Deleted user', user.uid)
        await signOut()
      }
    }
  })
})

</script>

<style lang="scss">
@use './scss' as r;

@import url('https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

// * {
//   outline: red solid 1px;
// }

p {
  margin-bottom: 1rem;
  line-height: 1.5;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  margin: 1.5rem 0 1rem;
}

code {
  @include r.box;
  border-radius: .5rem;
  font-family: 'Rubik Mono One', monospace;
  padding: .2rem .5rem;
  margin: 0 .2rem;
}

.desktop-only {
  .mobile & {
    display: none;
  }
}

.text-transform-normal {
  text-transform: none;
}

.text-secondary {
  color: r.$text-secondary;
}

.text-small {
  font-size: .8em;
}

.text-center {
  text-align: center;
}

.user-select {
  user-select: text;
}

.prewrap {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.nowrap {
  white-space: nowrap;
}

.w-stretch {
  width: stretch;
}

.bullet-list {
  padding-inline-start: 1rem;
  // margin: 1rem 0;
  line-height: 1.5;

  li {
    // margin: .5rem 0;
  }
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

.emoji {
  display: inline-flex;
  font-style: normal;
  height: 1em;
  width: 1em;
  justify-content: center;
  align-items: center;
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

:where(a:not(.btn)) {
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
</style>
