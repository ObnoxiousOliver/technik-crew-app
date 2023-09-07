<template>
  <li
    :class="['settings-list-item', {
      'settings-list-item--padding': props.padding
    }]"
  >
    <slot />
  </li>
</template>

<script lang="ts" setup>
const props = defineProps<{
  padding?: boolean
}>()
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.settings-list-item {
  padding: 0 1.5rem;

  &--padding {
    padding: 1rem 1.5rem;
  }
}
</style>
