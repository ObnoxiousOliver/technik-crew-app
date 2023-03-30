<template>
  <div class="card">
    <div class="card__icon">
      <slot name="icon" />
    </div>
    <div class="card__title">
      <slot name="title" />
    </div>
    <div class="card__btns">
      <slot name="btns" />
    </div>
    <div class="card__content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../scss' as r;

.card {
  position: relative;
  @include r.box;

  text-align: center;
  padding: 4rem 0;

  &__icon {
    font-size: 2rem;
  }

  &__title {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  &__content {
    color: r.$text-secondary;
  }

  &__btns {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    display: flex;

    :deep(.btn) {
      @include r.btnTransparent;
      @include r.btnSquare;
    }
  }
}
</style>
