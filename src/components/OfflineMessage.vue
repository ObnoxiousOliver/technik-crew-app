<template>
  <div class="offline-message">
    <i class="bi-wifi-off" />
    Sie sind im Offline-Modus.
    <template v-if="notLoaded">
      Nicht geladene Inhalte können nicht angezeigt werden.
    </template>
    <template v-if="notSupported">
      Nicht alle Funktionen sind verfügbar.
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  notLoaded?: boolean
  notSupported?: boolean
}>()
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.offline-message {
  @include r.box;
  display: flex;
  align-items: center;
  padding: 1rem;
  color: r.$text-secondary;
  gap: 1rem;
}
</style>
