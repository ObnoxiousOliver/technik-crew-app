<template>
  <router-view class="router" v-slot="{ Component }">
    <transition name="router">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script lang="ts" setup>

</script>

<style lang="scss">
.router {

  &-enter-active {

  }
}
</style>
