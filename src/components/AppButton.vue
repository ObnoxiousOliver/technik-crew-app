<template>
  <button v-wave class="btn">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
@use '../scss' as r;

.btn {
  position: relative;
  display: inline-block;
  border: none;
  font: inherit;
  color: inherit;

  padding: .875rem 2rem;
  font-weight: 600;

  background: r.$bg-secondary;
  border-radius: r.$radius;
  cursor: pointer;

  transition: background-color .2s, box-shadow .2s, opacity .2s;

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

  &--square {
    padding: 0;
    width: 3.125rem;
    height: 3.125rem;
  }
}
</style>
