<template>
  <RouterLink class="nav-btn">
    <i :class="`nav-btn__icon bi-${props.icon}`" />
  </RouterLink>
</template>

<script lang="ts" setup>
const props = defineProps({
  icon: String
})
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.nav-btn {
  width: 0;
  flex: 1 1 auto;
  position: relative;
  display: grid;
  place-items: center;
  color: inherit;
}
</style>
