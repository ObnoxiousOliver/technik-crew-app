<template>
  <div class="card">
    <div class="card__header">
      <div class="card__title">
        <slot name="title" />
      </div>
      <div class="card__btns">
        <slot name="btns" />
      </div>
    </div>
    <div class="card__content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../scss' as r;

.card {
  @include r.box;
  overflow: hidden;

  &__header {
    display: flex;
  }

  &__title {
    flex: 1 1 auto;
    padding: 1rem 0 1rem 1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 600;

    :deep(i) {
      display: inline-block;
      margin-right: .5rem;
    }

    :deep(.btn) {
      width: calc(100% + 2rem);
      text-align: left;
      background: none;
      padding: 1rem 0 1rem 1rem;
      margin: -1rem 0 -1rem -1rem;
      border-radius: 0;
      font: inherit;
    }
  }
  &__btns {
    display: flex;

    :deep(.btn) {
      background: none;
      height: auto;
      padding: 0;
      width: 3rem;
      border-radius: 0;
    }
  }
}
</style>
