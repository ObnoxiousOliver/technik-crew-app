<template>
  <Page :navigation="false">
    <RouterView class="router" v-slot="{ Component }">
      <template v-if="Component">
        <Transition name="router">
          <component :is="Component"></component>
        </Transition>
      </template>
    </RouterView>

    <Navbar>
      <NavBtn to="/wiki" icon="compass" />
      <NavBtn to="/events" icon="calendar-week" />
      <NavBtn to="/dashboard" icon="house-door" />
      <NavBtn to="/equipment" icon="speaker" />
      <NavBtn to="/settings" icon="gear" />
    </Navbar>
  </Page>
</template>

<script lang="ts" setup>
import Navbar from '../components/BottomNavbar.vue'
import NavBtn from '../components/BottomNavBtn.vue'
</script>
