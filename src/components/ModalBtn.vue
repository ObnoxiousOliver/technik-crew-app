<template>
  <Btn small>
    <i v-if="icon" :class="icon + ' btn__icon'" /><slot />
  </Btn>
</template>

<script lang="ts" setup>
defineProps<{
  icon?: string
}>()
</script>
