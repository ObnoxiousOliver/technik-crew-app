<template>
  <component
    :is="to ? 'router-link' : 'button'"
    v-wave
    :class="['btn', {
      'btn--is-link': !!to,
      'btn--danger': danger,
      'btn--square': square,
      'btn--transparent': transparent,
      'btn--small': small,
      'btn--chip': chip
    }]"
    :to="to"
    :type="to ? undefined : (type ?? 'button')"
    ref="btnEl"
  >
    <i class="btn__chip-x bi-x-lg" v-if="chip" />
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { RouteLocationRaw } from 'vue-router'

const props = defineProps<{
  to?: RouteLocationRaw,
  type?: string,
  'aria-label'?: string,
  danger?: boolean,
  square?: boolean,
  transparent?: boolean,
  small?: boolean,
  chip?: boolean
}>()

// Check for accessibility
const btnEl = ref<HTMLButtonElement | HTMLAnchorElement | null>(null)
onMounted(() => {
  if (!btnEl.value) return

  if (!btnEl.value.textContent && !props['aria-label']) {
    console.warn('AppButton: Button is not accessible. Make sure to set a label.', btnEl.value)
  }
})
</script>

<style lang="scss" scoped>
@use '../scss' as r;

:where(.btn) {
  all: unset;
  display: inline-block;
  border: none;
  font: inherit;
  color: inherit;
  text-align: center;

  padding: .875rem 2rem;
  font-weight: 600;

  background: r.$bg-secondary;
  border-radius: r.$radius;
  cursor: pointer;

  transition: background-color .2s, box-shadow .2s, opacity .2s;

  & > :deep(i.btn__icon) {
    margin-right: .25rem;
  }

  &:focus-visible {
    outline: none;
    box-shadow: r.$focus;
  }

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }

  &:hover:not(:disabled) {
    background: lighten(r.$bg-secondary, 5);
  }

  &.btn--is-link {
    display: inline-grid;
    place-items: center;
  }

  &.btn--square {
    @include r.btnSquare;
  }

  &.btn--transparent {
    @include r.btnTransparent;
  }

  &.btn--small {
    @include r.btnSmall;
  }

  &.btn--chip {
    @include r.btnChip;

    .btn__chip-x {
      margin-right: .25rem;
    }
  }

  &.btn--danger {
    background: rgba(r.$danger, .1);
    color: lighten(r.$danger, 5);
    &:hover:not(:disabled) {
      background: rgba(r.$danger, .2);
    }

    &:focus-visible {
      box-shadow: r.$focus-danger;
    }
  }
}
</style>
