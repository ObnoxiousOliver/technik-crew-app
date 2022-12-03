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

  overflow: hidden;
  padding: .875rem 2rem;
  font-weight: 600;

  background: #171717;
  border-radius: 12px;
  user-select: none;
  cursor: pointer;
  transition: .5s;

  &::before {
    content: '';
    position: absolute;
    left: -3rem;
    top: 0;
    height: 100%;
    width: 2.5rem;
    border-left: #fff2 solid 1.25rem;
    border-right: #fff2 solid .5rem;
    transform: skew(-20deg);
    transition: 1s cubic-bezier(0.19, 1, 0.22, 1);
  }

  &:hover {
    box-shadow: r.$glow, r.$accent 0 0 0 .1rem inset;

    &::before {
      left: calc(100% + 3rem);
    }
  }
  &:hover:active {
    transform: scale(.98);
    transition: .1s;
  }
}
</style>
