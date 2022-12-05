<template>
  <RouterView class="router" v-slot="{ Component }">
      <template v-if="Component">
        <Transition name="router">
          <component :is="Component"></component>
        </Transition>
      </template>
  </RouterView>
</template>

<script lang="ts" setup>
import { getAuth, onAuthStateChanged } from '@firebase/auth'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  onAuthStateChanged(getAuth(), (user) => {
    if (!user && route.meta.requireAuth) {
      router.push({
        path: '/login',
        query: { redirect: route.fullPath }
      })
    }
  })
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

body {
  background: r.$bg-primary;
  color: r.$text-primary;
  font-family: Rubik, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  user-select: none;
}

p {
  margin-bottom: 1rem;
}

:focus {
  outline: none;
}

:focus-visible {
  outline: r.$accent solid 2px;
}

a {
  color: r.$accent;
  transition: .2s;

  &:hover {
    color: lighten(r.$accent, 30);
  }
}

.router {
  &-enter-active {

  }
}
</style>
