<template>
  <button @click="click" class="nav-btn">
    <i :class="`nav-btn__icon bi-${icon}`" />
  </button>
</template>

<script lang="ts" setup>
import { getLastPageOfRoot } from '@/router'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const props = defineProps({
  icon: String,
  to: String
})

function click () {
  if (route.meta.root === props.to) {
    router.replace({ name: props.to })
  } else {
    router.push(getLastPageOfRoot(props.to))
  }
}
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.nav-btn {
  width: 0;
  flex: 1 1 auto;
  position: relative;
  font: inherit;
  border: none;
  background: none;
  color: inherit;
}
</style>
