<template>
  <Component
    :is="to ? 'router-link' : 'button'"
    v-wave="!disabled"

    :tabindex="disabled ? -1 : undefined"
    :aria-label="props.ariaLabel"
    :disabled="disabled"
    :aria-disabled="disabled"

    :class="['btn', {
      'btn--is-link': !!to,
      'btn--danger': danger,
      'btn--square': square,
      'btn--transparent': transparent,
      'btn--small': small,
      'btn--chip': chip,
      'btn--disabled': disabled,
      'btn--accent': accent
    }]"
    :to="to"
    :type="to ? undefined : (type ?? 'button')"
    ref="btnEl"
  >
    <div class="btn__content">
      <i class="btn__chip-x bi-x-lg" v-if="chip" />
      <slot />
    </div>
  </Component>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { RouteLocationRaw } from 'vue-router'

const props = defineProps<{
  to?: RouteLocationRaw,
  type?: string,
  ariaLabel?: string,
  danger?: boolean,
  square?: boolean,
  transparent?: boolean,
  small?: boolean,
  chip?: boolean,
  disabled?: boolean,
  accent?: boolean,
}>()

// Check for accessibility
const btnEl = ref<HTMLButtonElement | HTMLAnchorElement | null>(null)
// onMounted(() => {
//   if (!btnEl.value) return

//   if (!btnEl.value.textContent && !props['aria-label']) {
//     // console.warn('AppButton: Button is not accessible. Make sure to set a label.', btnEl.value)
//   }
// })
</script>

<style lang="scss" scoped>
@use '../scss' as r;

:where(.btn__content) {
  flex: 1;

  & > :deep(i.btn__icon) {
    margin-right: .5rem;
  }
}

:where(.btn) {
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: stretch;
  border: none;
  font: inherit;
  color: inherit;
  text-align: center;

  padding: .875rem 2rem;
  font-weight: 600;

  @include r.box;
  cursor: pointer;

  transition: background-color .2s, box-shadow .2s, opacity .2s;

  &:focus-visible {
    outline: none;
    box-shadow: r.$focus;
  }

  &.btn--disabled {
    pointer-events: none;
    cursor: default;
    opacity: 0.5;
  }

  &:hover:not(:disabled) {
    background: lighten(r.$bg-secondary, 5);
  }

  &.btn--square {
    @include r.btnSquare;

    &.btn--small {
      @include r.btnSquare(2rem);
    }
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
    color: lighten(r.$danger, 5);

    &:not(.btn--transparent) {
      background: rgba(r.$danger, .1);
      &:hover:not(:disabled) {
        background: rgba(r.$danger, .2);
      }
    }

    &:focus-visible {
      box-shadow: r.$focus-danger;
    }
  }
  &.btn--accent {
    background: rgba(r.$accent, .05);
    color: r.$accent;
    &:hover:not(:disabled) {
      background: rgba(r.$accent, .1);
    }
  }
}
</style>
