<template>
  <page>
    <router-view class="router" v-slot="{ Component }">
      <transition name="router">
        <component :is="Component" />
      </transition>
    </router-view>
  </page>
</template>
