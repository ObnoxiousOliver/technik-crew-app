<template>
  <Btn class="add-btn btn--square">
    <i class="bi-plus-lg" />
  </Btn>
</template>

<style lang="scss" scoped>
@use '../scss' as r;

.add-btn {
  // border: r.$bg-stroke solid .1rem;
  // background: lighten(r.$bg-secondary, 5);
  box-shadow: r.$bg-primary 0 0 2rem 1rem;
}
</style>
