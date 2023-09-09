<template>
  <div
    class="home-sidebar"
    :style="{
      '--active': active,
      '--amount': dev.flags.useInventory ? 6 : 5
    }"
  >
    <h2>
      <UsernameDisplay :user="userStore.user" full />
    </h2>

    <div class="home-sidebar__list-container">
      <ul class="home-sidebar__list">
        <li>
          <DesktopSidebarBtn :to="{ name: 'dashboard' }">
            <i class="bi bi-house" />
            Dashboard
          </DesktopSidebarBtn>
        </li>

        <li>
          <DesktopSidebarBtn :to="{ name: 'equipment' }">
            <i class="bi bi-speaker" />
            Equipment
          </DesktopSidebarBtn>
        </li>

        <li v-if="dev.flags.useInventory">
          <DesktopSidebarBtn :to="{ name: 'inventory' }">
            <i class="bi bi-box-seam" />
            Inventar
          </DesktopSidebarBtn>
        </li>

        <li>
          <DesktopSidebarBtn :to="{ name: 'events' }">
            <i class="bi bi-calendar-week" />
            Termine
          </DesktopSidebarBtn>
        </li>

        <li>
          <DesktopSidebarBtn :to="{ name: 'wiki' }">
            <i class="bi bi-compass" />
            Wiki
          </DesktopSidebarBtn>
        </li>

        <li>
          <DesktopSidebarBtn :to="{ name: 'settings' }">
            <i class="bi bi-gear" />
            Einstellungen
          </DesktopSidebarBtn>
        </li>
        <div :class="['home-sidebar__page-indicator', upDown]" />
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DesktopSidebarBtn from '@/components/DesktopSidebarBtn.vue'
import { useUser } from '@/stores/user'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import UsernameDisplay from './UsernameDisplay.vue'
import { useDev } from '@/stores/developer'

const userStore = useUser()

const dev = useDev()

const route = useRoute()
watch(route, setActiveButton)

const active = ref(0)
const upDown = ref('down')
setActiveButton()

function setActiveButton () {
  const prev = active.value
  active.value = ['dashboard', 'equipment', 'inventory', 'events', 'wiki', 'settings'].indexOf(route.meta.root as string ?? 'dashboard')
  if (prev < active.value) {
    upDown.value = 'down'
  } else if (prev > active.value) {
    upDown.value = 'up'
  }
}
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.home-sidebar {
  padding: 0 1.5rem;

  &__page-indicator {
    position: absolute;
    top: calc(var(--active) * 3rem + 1rem);
    bottom: calc((var(--amount) - 1 - var(--active)) * 3rem + 1rem);
    left: .1rem;
    width: .2rem;
    border-radius: .1rem;
    background: r.$accent;

    &.up {
      transition: top .5s cubic-bezier(0.19, 1, 0.22, 1), bottom .5s .1s cubic-bezier(0.19, 1, 0.22, 1);
    }

    &.down {
      transition: bottom .5s cubic-bezier(0.19, 1, 0.22, 1), top .5s .1s cubic-bezier(0.19, 1, 0.22, 1);
    }
  }

  h2 {
    margin: 0;
    padding: 1.5rem 0;
    font-size: 1rem;
    font-weight: 600;
    text-transform: uppercase;

    display: flex;
  }

  &__list-container {
    position: relative;
    margin: 0 -1rem;
  }

  &__list {
    list-style-type: none;
    padding: 0;
  }
}
</style>
