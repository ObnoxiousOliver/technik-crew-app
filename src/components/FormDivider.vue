<template>
  <div
    :class="['form-divider', {
      'form-divider--has-label': $slots.default
    }]"
  >
    <div class="form-divider__stroke" />
    <span class="form-divider__label" v-if="$slots.default">
      <slot />
    </span>
  </div>
</template>

<style lang="scss" scoped>
@use '../scss' as r;

.form-divider {
  position: relative;
  color: r.$text-secondary;
  padding: .5rem .3rem;
  font-size: .8rem;
  height: 1px;
  font-weight: 600;
  text-transform: uppercase;

  &--has-label {
    margin-top: .5rem;
  }

  &__stroke {
    position: absolute;
    inset: 50% 0 auto 0;
    background: r.$bg-stroke;
    height: 1px;
  }

  &__label {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: r.$bg-primary;
    padding: 0 .2rem;
  }
}
</style>
