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

  padding: .875rem 2rem;
  font-weight: 600;

  background: #171717;
  border-radius: r.$radius;
  user-select: none;
  cursor: pointer;
}
</style>
