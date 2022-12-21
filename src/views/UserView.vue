<template>
  <Page :navigation="false">
    <RouterView class="router" v-slot="{ Component }">
      <template v-if="Component">
        <Transition name="router">
          <KeepAlive>
            <component :is="Component"></component>
          </KeepAlive>
        </Transition>
      </template>
    </RouterView>

    <div class="mask" />
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

<style lang="scss" scoped>
@use '../scss' as r;

.mask {
  z-index: 99;
  position: absolute;
  inset: auto 0 0;
  height: 5rem;
  background: linear-gradient(transparent, rgba(r.$bg-primary, 0.3), rgba(r.$bg-primary, 0.66), rgba(r.$bg-primary, 0.9), r.$bg-primary);
  pointer-events: none;
}
</style>
