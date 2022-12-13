<template>
  <div class="user-page">
    <h2 class="user-page__title">
      <slot name="title" />
    </h2>
    <div class="user-page__scroller">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../scss' as r;

.user-page {
  height: 100vh;
  position: relative;
  overflow: hidden;

  &__title {
    z-index: 1;
    position: relative;
    display: flex;
    align-items: center;
    height: 4rem;
    margin: 0 -1.5rem;
    padding: 0 1.5rem;
    background: r.$bg-primary;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__scroller {
    position: absolute;
    inset: 0;
    padding: 4rem 0 5rem;
    overflow: auto;
  }
}
</style>
