<template>
  <nav class="bottom-nav">
    <slot />
  </nav>
</template>

<style lang="scss" scoped>
@use '../scss' as r;

.bottom-nav {
  position: fixed;
  inset: auto 1rem 1rem;
  display: flex;
  overflow: hidden;
  height: 3rem;
  border-radius: r.$radius;
  background: rgba(r.$bg-secondary, 0.8);
  backdrop-filter: blur(1rem);
}
</style>
