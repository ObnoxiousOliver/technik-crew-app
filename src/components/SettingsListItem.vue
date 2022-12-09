<template>
  <li :class="['settings-list-item', {
    'settings-list-item--danger': props.danger
  }]">
    <component :is="props.isButton ? 'button' : 'RouterLink'" class="settings-list-item__button" v-wave :to="props.to">
      <div class="settings-list-item__content">
        <slot />
      </div>
      <i v-if="props.arrow" class="settings-list-item__arrow bi-chevron-right" />
    </component>
  </li>
</template>

<script lang="ts" setup>
const props = defineProps({
  to: [Object, String],
  danger: Boolean,
  isButton: Boolean,
  arrow: { type: Boolean, default: () => true }
})
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.settings-list-item {
  &--danger {
    color: r.$danger;
  }

  &__button {
    appearance: none;
    background: none;
    border: none;
    font: inherit;
    width: 100%;
    text-align: left;
    display: flex;
    color: inherit;
    text-decoration: none;
    padding: 1rem 1.5rem;
  }

  &__content {
    flex: 1 1 auto;
  }
}
</style>
