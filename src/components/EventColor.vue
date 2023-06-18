<template>
  <div :class="['event-color', 'event-color--' + color]" />
</template>

<script setup lang="ts">
import { EventColors } from '@/model/event'

defineProps<{
  color: EventColors
}>()
</script>

<style scoped lang="scss">
@use '../scss' as r;

.event-color {
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
  vertical-align: -.1em;
  border-radius: 50%;
  background: currentColor;
  border: 1px solid rgba(r.$text-primary, 0.2);

  &--gray { color: r.$col-gray; }
  &--red { color: r.$col-red; }
  &--orange { color: r.$col-orange; }
  &--yellow { color: r.$col-yellow; }
  &--green { color: r.$col-green; }
  &--cyan { color: r.$col-cyan; }
  &--blue { color: r.$col-blue; }
  &--purple { color: r.$col-purple; }
  &--pink { color: r.$col-pink; }
}
</style>
