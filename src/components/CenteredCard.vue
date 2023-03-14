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

<style scoped>

</style>
