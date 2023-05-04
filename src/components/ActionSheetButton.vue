<template>
  <Component
    :is="to ? 'router-link' : 'button'"
    :to="to"
    v-wave
    :class="['action-sheet-btn', {
      'action-sheet-btn--danger': danger,
      'action-sheet-btn--disabled': disabled
    }]"
  >
    <slot />
  </Component>
</template>

<script lang="ts" setup>
import { RouteLocationRaw } from 'vue-router'

defineProps<{
  danger?: boolean,
  disabled?: boolean,
  to?: RouteLocationRaw
}>()
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.action-sheet-btn {
  background: none;
  border: none;
  font: inherit;
  color: inherit;

  display: block;
  padding: 1rem 1.5rem;
  width: 100%;
  text-decoration: none;
  text-align: left;

  &:disabled {
    opacity: 0.5;
  }

  :deep(i) {
    margin-right: 1rem;
  }

  &.danger, &--danger {
    color: r.$danger;
  }

  &.disabled, &--disabled {
    opacity: 0.5;
  }
}
</style>
