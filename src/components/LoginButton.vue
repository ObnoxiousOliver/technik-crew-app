<template>
  <button class="login-btn">
    Anmelden
  </button>
</template>

<style lang="scss" scoped>
@use '../scss' as r;

.login-btn {
  position: relative;
  display: inline-block;
  border: none;
  font: inherit;
  color: inherit;

  overflow: hidden;
  padding: .875rem 2rem;
  font-weight: 600;

  background: r.$bg-secondary;
  border-radius: r.$radius;
  user-select: none;
  cursor: pointer;
  transition: .5s, box-shadow .2s;

  &::before {
    content: '';
    position: absolute;
    left: -3rem;
    top: 0;
    height: 100%;
    width: 2.5rem;
    opacity: 0.1;
    border-left: r.$text-primary solid 1.25rem;
    border-right: r.$text-primary solid .5rem;
    transform: skew(-10deg);
    transition: 1.5s cubic-bezier(0.19, 1, 0.22, 1);
  }

  &:hover, &:focus-visible {
    outline: none;
    box-shadow: r.$focus;

    &::before {
      transform: skew(-30deg);
      left: calc(100% + 3rem);
    }
  }
  &:hover:active {
    transform: scale(.98);
    transition: .1s;
  }
}
</style>
