<template>
  <RouterLink :to="to" ref="root" class="nav-btn">
    <i :class="`nav-btn__icon bi-${icon}`" />
  </RouterLink>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

defineProps({
  icon: String,
  to: [Object, String]
})

const root = ref<HTMLElement>()

defineExpose({
  root
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
