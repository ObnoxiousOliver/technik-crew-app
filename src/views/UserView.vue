<template>
  <page>
    <RouterView class="router" v-slot="{ Component }">
      <template v-if="Component">
        <Transition name="router">
          <component :is="Component"></component>
        </Transition>
      </template>
    </RouterView>
  </page>
</template>
