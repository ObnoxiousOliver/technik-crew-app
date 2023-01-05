<template>
  <div :class="['settings-list-divider', {
    'settings-list-divider--has-label': $slots.default
  }]">
    <div class="settings-list-divider__stroke" />
    <span class="settings-list-divider__label" v-if="$slots.default">
      <slot />
    </span>
  </div>
</template>

<style lang="scss" scoped>
@use '../scss' as r;

.settings-list-divider {
  position: relative;
  color: r.$text-secondary;
  margin: 0 1rem;
  padding: .5rem .3rem;
  font-size: .8rem;
  font-weight: 600;
  text-transform: uppercase;

  &--has-label {
    margin: 1.5rem 1rem .5rem;
    padding: 0 .3rem;
  }

  &__stroke {
    position: absolute;
    inset: 50% 0 auto 0;
    background: r.$bg-stroke;
    height: 1px;
  }

  &__label {
    position: relative;
    background: r.$bg-primary;
    padding: 0 .2rem;
  }
}
</style>
