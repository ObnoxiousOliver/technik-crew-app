<template>
  <button v-wave class="action-sheet-btn">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
@use '../scss' as r;

.action-sheet-btn {
  background: none;
  border: none;
  font: inherit;
  color: inherit;

  display: block;
  padding: 1rem 1.5rem;
  width: 100%;
  text-align: left;

  :deep(i) {
    margin-right: .5rem;
  }

  &.danger {
    color: r.$danger;
  }
}
</style>
