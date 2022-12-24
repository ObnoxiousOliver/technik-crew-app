<template>
  <input class="input">
</template>

<style lang="scss" scoped>
@use '../scss' as r;

.input {
  display: inline-block;
  border: none;
  font: inherit;
  color: inherit;

  padding: .875rem .5rem .875rem 1rem;

  background: r.$bg-secondary;
  border-radius: r.$radius;

  transition: box-shadow .2s, opacity .2s;

  &:focus-visible {
    outline: none;
    box-shadow: r.$focus;
  }

  &:disabled {
    opacity: 0.5;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type=number] {
    -moz-appearance: textfield;
  }
}
</style>
